from flask import Flask, render_template, request, jsonify
import requests
import json

app = Flask(__name__)

# ============================================================
# ⚠️ 重要：請將下方 URL 替換為您自己的 Google Apps Script 部署網址
#
# 取得方式：
# 1. 前往 https://script.google.com/
# 2. 開啟您的「AI 問卷生成器」專案
# 3. 點擊「部署」→「管理部署作業」
# 4. 複製「網頁應用程式 URL」貼到下方
# ============================================================
GAS_URL = "在此貼上您的 GAS 部署 URL"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        print(f"接收到的資料: {data}")

        # 傳送到 Google Apps Script
        response = requests.post(
            GAS_URL, 
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"GAS 回傳狀態碼: {response.status_code}")
        print(f"GAS 回傳內容: {response.text}")

        if response.status_code == 200:
            try:
                result = response.json()
                return jsonify(result)
            except json.JSONDecodeError:
                return jsonify({
                    "status": "error", 
                    "message": f"GAS 回傳格式錯誤: {response.text}"
                })
        else:
            return jsonify({
                "status": "error", 
                "message": f"GAS 回傳錯誤，狀態碼: {response.status_code}"
            })
            
    except Exception as e:
        print(f"發生錯誤: {str(e)}")
        return jsonify({
            "status": "error", 
            "message": str(e)
        })

if __name__ == '__main__':
    app.run(debug=True)