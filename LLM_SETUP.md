# 🤖 راهنمای نصب و پیکربندی LLM

## گزینه‌های موجود

شما سه گزینه برای استفاده از LLM دارید:

### 1️⃣ OpenAI API (پیشنهادی - بهترین کیفیت)

**مزایا:**
- کیفیت بسیار بالا
- پشتیبانی از فارسی عالی
- پاسخ‌های هوشمند

**نصب:**
```bash
npm install openai
```

**پیکربندی:**
1. فایل `.env.local` ایجاد کنید:
```env
OPENAI_API_KEY=sk-your-api-key-here
```

2. API key از [platform.openai.com](https://platform.openai.com/api-keys) دریافت کنید

**قیمت:** حدود $0.002 برای هر 1000 کلمه (خیلی ارزان)

---

### 2️⃣ Google Gemini (رایگان)

**مزایا:**
- کاملاً رایگان
- کیفیت خوب
- پشتیبانی از فارسی

**نصب:**
```bash
npm install @google/generative-ai
```

**پیکربندی:**
```env
GOOGLE_API_KEY=your-google-api-key
```

**کد:**
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(prompt);
const response = result.response.text();
```

---

### 3️⃣ Ollama (محلی - بدون نیاز به اینترنت)

**مزایا:**
- کاملاً رایگان
- محلی (بدون ارسال داده به اینترنت)
- بدون نیاز به API key

**نصب:**
1. Ollama را نصب کنید: [ollama.com](https://ollama.com)
2. مدل را دانلود کنید:
```bash
ollama pull llama2
# یا
ollama pull mistral
```

**استفاده:**
```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  body: JSON.stringify({
    model: 'llama2',
    prompt: userInput,
    stream: false
  })
});
```

---

## 🚀 راهنمای سریع (پیشنهادی)

### برای شروع سریع با Google Gemini (رایگان):

1. نصب کتابخانه:
```bash
npm install @google/generative-ai
```

2. دریافت API key رایگان:
   - به [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) بروید
   - API key ایجاد کنید

3. فایل `.env.local` ایجاد کنید:
```env
GOOGLE_API_KEY=your-key-here
```

4. کد را به `src/utils/llm.js` اضافه کنید:
```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateRealLLMResponse(userInput) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `You are a financial assistant. User says: ${userInput}`;
  const result = await model.generateContent(prompt);
  
  return {
    type: 'response',
    message: result.response.text()
  };
}
```

---

## 📝 مقایسه گزینه‌ها

| ویژگی | OpenAI | Google Gemini | Ollama |
|-------|--------|---------------|--------|
| قیمت | ~$0.002/1K کلمه | رایگان | رایگان |
| کیفیت | عالی ⭐⭐⭐⭐⭐ | خوب ⭐⭐⭐⭐ | متوسط ⭐⭐⭐ |
| فارسی | عالی | خوب | ضعیف |
| سرعت | سریع | سریع | کند |
| آفلاین | ❌ | ❌ | ✅ |
| نیاز به API Key | ✅ | ✅ | ❌ |

---

## 💡 توصیه من

**برای شروع:** Google Gemini (رایگان و راحت)
**برای production:** OpenAI (بهترین کیفیت)
**برای حریم خصوصی:** Ollama (محلی)

کدام گزینه رو ترجیح می‌دید تا برای شما پیاده‌سازی کنم؟

