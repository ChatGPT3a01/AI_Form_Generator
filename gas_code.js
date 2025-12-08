// =====================================================
// AI 問卷生成器 - Google Apps Script 程式碼
// 支援 Google Gemini 和 OpenAI GPT
// 請將此程式碼貼到 Google Apps Script 編輯器中
// =====================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    Logger.log('收到請求: ' + JSON.stringify(data));

    // 1. 根據 provider 呼叫對應的 AI API
    let aiResult;
    if (data.provider === 'openai') {
      aiResult = callOpenAIAPI(data);
    } else {
      aiResult = callGeminiAPI(data);
    }

    // 2. 建立 Google 表單
    const formResult = createGoogleForm(aiResult, data.category);

    // 3. 返回結果
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        ai_result: aiResult,
        form_result: formResult
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('錯誤: ' + error);
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// =====================================================
// Google Gemini API 呼叫
// =====================================================
function callGeminiAPI(data) {
  const apiKey = data.apiKey;
  const model = data.model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const prompt = buildPrompt(data);

  const payload = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.candidates && result.candidates[0]) {
    const text = result.candidates[0].content.parts[0].text;
    return extractJSON(text);
  }

  throw new Error('Gemini API 回應格式錯誤');
}

// =====================================================
// OpenAI API 呼叫
// =====================================================
function callOpenAIAPI(data) {
  const apiKey = data.apiKey;
  const model = data.model || 'gpt-4o';
  const url = 'https://api.openai.com/v1/chat/completions';

  const prompt = buildPrompt(data);

  const payload = {
    model: model,
    messages: [
      {
        role: 'system',
        content: '你是一個專業的問卷設計師，請根據使用者需求生成問卷題目，並以 JSON 格式回傳。'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + apiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  if (result.choices && result.choices[0]) {
    const text = result.choices[0].message.content;
    return extractJSON(text);
  }

  if (result.error) {
    throw new Error('OpenAI API 錯誤: ' + result.error.message);
  }

  throw new Error('OpenAI API 回應格式錯誤');
}

// =====================================================
// 共用函數：建立提示詞
// =====================================================
function buildPrompt(data) {
  return `請為「${data.category}」主題生成 ${data.questionCount} 個問卷題目。

題型配比：${data.questionTypes}
關鍵字：${data.keywords}
問卷目的：${data.purpose}

請以 JSON 格式回傳，格式如下：
{
  "questions": [
    {
      "question": "題目文字",
      "type": "單選" 或 "多選" 或 "文字",
      "options": ["選項1", "選項2", ...] // 文字題可省略此欄位
    }
  ]
}

請確保：
1. 題目清楚且符合主題
2. 選項合理且互斥
3. 題型符合配比要求
4. 嚴格遵守 JSON 格式，只回傳 JSON，不要有其他文字`;
}

// =====================================================
// 共用函數：從回應中提取 JSON
// =====================================================
function extractJSON(text) {
  // 嘗試提取 JSON 部分
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('無法從 AI 回應中提取 JSON');
}

// =====================================================
// 建立 Google 表單
// =====================================================
function createGoogleForm(aiResult, category) {
  // 建立新表單
  const form = FormApp.create(`AI 生成問卷：${category}`);
  form.setDescription(`本問卷由 AI 自動生成，主題：${category}`);

  // 添加題目
  aiResult.questions.forEach((q, index) => {
    if (q.type === '單選') {
      const item = form.addMultipleChoiceItem();
      item.setTitle(`${index + 1}. ${q.question}`);
      item.setChoiceValues(q.options);
      item.setRequired(true);
    } else if (q.type === '多選') {
      const item = form.addCheckboxItem();
      item.setTitle(`${index + 1}. ${q.question}`);
      item.setChoiceValues(q.options);
      item.setRequired(true);
    } else if (q.type === '文字') {
      const item = form.addParagraphTextItem();
      item.setTitle(`${index + 1}. ${q.question}`);
      item.setRequired(true);
    }
  });

  return {
    editUrl: form.getEditUrl(),
    responseUrl: form.getPublishedUrl()
  };
}
