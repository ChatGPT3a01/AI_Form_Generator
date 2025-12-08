# CH6 - AI 問卷自動生成系統

<div align="center">

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-2.0+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Google Forms](https://img.shields.io/badge/Google-Forms-red.svg)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-purple.svg)

**使用 AI 自動生成專業問卷並直接建立 Google Forms**

[📊 完整簡報連結](https://chatgpt3a01.github.io/AI_Form_Generator/) | [📘 Facebook](https://www.facebook.com/iddmail) | [🎥 YouTube](https://www.youtube.com/@Liang-yt02)

</div>

---

## 📋 本章節 Part 說明

### Part 1：快速開始 - 3分鐘生成第一份AI問卷
- 系統運作流程預覽
- Google AI API Key 申請與設定
- Google Apps Script 部署步驟
- Flask 應用啟動與測試
- 即時生成問卷實作示範

### Part 2：系統價值與應用場景
- 問卷製作的五大痛點分析
- AI 如何解決這些問題
- 實際應用場景案例
- 系統限制與適用範圍說明

### Part 3：專案架構與三層設計
- 三層架構概覽（Flask、GAS、Google Services）
- Flask 層詳細設計與路由說明
- Google Apps Script 層設計
- 資料流動與錯誤處理機制

### Part 4：Gemini 提示詞工程與 AI 互動
- 提示詞的黃金結構解析
- Gemini API 呼叫細節
- AI 回應解析技巧
- 提示詞優化最佳實踐
- Token 用量與成本控制

### Part 5：Google Forms API 實作
- FormApp API 核心方法詳解
- 支援更多題型擴展
- 表單外觀與設定客製化
- 回應資料的程式化處理

### Part 6：實務應用與進階擴展
- 月度顧客滿意度調查自動化案例
- 活動後即時回饋收集實作
- 學術研究問卷迭代流程
- 多語言問卷生成
- 與其他系統整合方案

---

## 🚀 專案下載方式

### 方法一：使用 Git Clone
```bash
git clone https://github.com/ChatGPT3a01/AI_Form_Generator.git
cd AI_Form_Generator
```

### 方法二：直接下載 ZIP
1. 前往 [GitHub Repository](https://github.com/ChatGPT3a01/AI_Form_Generator)
2. 點擊綠色「Code」按鈕
3. 選擇「Download ZIP」
4. 解壓縮到您的工作目錄

---

## 📦 安裝方式 (Installation)

### 系統需求
- Python 3.8 或更高版本
- Google 帳號（用於 Google AI Studio 和 Google Apps Script）

### 步驟 1：安裝 Python 套件
```bash
pip install flask requests
```

### 步驟 2：申請 Google AI API Key
1. 前往 [Google AI Studio](https://aistudio.google.com/)
2. 登入您的 Google 帳號
3. 點擊「Get API Key」
4. 建立並複製 API Key（格式為 `AIzaSy...`）

### 步驟 3：部署 Google Apps Script
1. 前往 [Google Apps Script](https://script.google.com/)
2. 建立新專案，命名為「AI 問卷生成器」
3. 將 `gas_code.js` 的內容貼入編輯器
4. 點擊「部署」→「新增部署作業」
5. 選擇類型「網頁應用程式」
6. 執行身分選擇「我」
7. 存取權限選擇「所有人」
8. 點擊「部署」並完成授權
9. 複製部署完成後的 URL

### 步驟 4：設定 Flask 應用
開啟 `app.py`，將第 16 行的 GAS URL 替換為您的部署 URL：
```python
GAS_URL = "在此貼上您的 GAS 部署 URL"
```

---

## 🖥️ 佈署流程 (Deployment)

### 本地開發測試
```bash
# 啟動 Flask 開發伺服器
python app.py

# 開啟瀏覽器訪問
# http://127.0.0.1:5000
```

### 生產環境部署（選用）

#### 使用 Gunicorn（Linux/Mac）
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

#### 使用 Waitress（Windows）
```bash
pip install waitress
waitress-serve --port=8000 app:app
```

#### 部署到雲端平台
- **Render.com**：適合免費託管
- **Railway.app**：簡單快速部署
- **Google Cloud Run**：與 GAS 整合最佳

---

## 📚 教學補充

### 系統架構圖
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   使用者瀏覽器   │────▶│   Flask 應用    │────▶│ Google Apps     │
│   (前端介面)    │◀────│   (Python)      │◀────│ Script (GAS)    │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                         ┌───────────────────────────────┤
                         ▼                               ▼
                 ┌─────────────────┐           ┌─────────────────┐
                 │  Gemini AI API  │           │  Google Forms   │
                 │  (題目生成)     │           │  (問卷建立)     │
                 └─────────────────┘           └─────────────────┘
```

### 技術原理說明

#### 1. Flask 中介層
- 提供使用者友善的網頁介面
- 接收表單資料並驗證格式
- 轉發請求到 Google Apps Script
- 處理回應並展示結果

#### 2. Google Apps Script
- 呼叫 Gemini AI 生成問卷題目
- 解析 AI 回應的 JSON 結構
- 使用 FormApp API 建立 Google Forms
- 返回表單編輯和填寫連結

#### 3. AI 提示詞設計
- 任務定義：明確指示生成目標
- 上下文資訊：題型配比、關鍵字、目的
- 輸出格式：JSON 結構範例
- 品質要求：確保題目清楚、選項合理

### 支援的 AI 模型

#### Google Gemini
- gemini-2.5-flash（推薦，速度快）
- gemini-2.5-pro
- gemini-2.0-flash
- gemini-2.0-pro

#### OpenAI（選用）
- gpt-4o
- gpt-4.1
- gpt-4-turbo
- gpt-4.5-preview

### 常見問題排解

| 問題 | 可能原因 | 解決方法 |
|------|----------|----------|
| API Key 無效 | 格式錯誤或已過期 | 重新申請並確認格式 |
| GAS 回傳錯誤 | URL 未更新 | 檢查 app.py 第 16 行 |
| 授權失敗 | 未完成 GAS 授權 | 重新部署並完成授權流程 |
| 表單建立失敗 | Drive 空間不足 | 清理 Google Drive 空間 |

---

## 📁 專案結構

```
AI_Form_Generator/
├── app.py              # Flask 主應用程式
├── gas_code.js         # Google Apps Script 程式碼
├── templates/
│   └── index.html      # 網頁介面模板
├── static/
│   └── style.css       # 樣式表
├── slides/             # 教學簡報
│   ├── index.html      # 統整頁
│   ├── Part1.html      # 快速開始
│   ├── Part2.html      # 系統價值
│   ├── Part3.html      # 專案架構
│   ├── Part4.html      # 提示詞工程
│   ├── Part5.html      # Forms API
│   └── Part6.html      # 進階擴展
└── README.md           # 本說明文件
```

---

## 🔗 相關資源

- [Google AI Studio](https://aistudio.google.com/) - 申請 Gemini API Key
- [Google Apps Script](https://script.google.com/) - 部署 GAS
- [Google Forms API 文件](https://developers.google.com/apps-script/reference/forms)

---

## 📞 聯絡與支援

- 📘 [Facebook](https://www.facebook.com/iddmail)
- 🎥 [YouTube 頻道](https://www.youtube.com/@Liang-yt02)

---

<div align="center">

© 2026 自己架設 AI - 零基礎到大師 | Made with 曾慶良(阿亮老師) ❤️

</div>
