# 🚀 Financial Dashboard

A smart financial dashboard with AI-powered chat interface for managing salary data and financial projections.

## ✨ Features

- **Interactive Table**: AG Grid with cell selection and editing
- **AI Chat Interface**: Google Gemini-powered intelligent assistant
- **Smart Commands**: Natural language commands in Persian and English
- **Real-time Updates**: Live data manipulation with automatic calculations
- **Responsive Design**: Modern UI with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Table**: AG Grid Community
- **AI**: Google Gemini API
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Gemini API Key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd financial-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Create .env.local file
GOOGLE_API_KEY=your-google-api-key-here
```

4. **Run development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🤖 AI Commands

### Interactive Cell Selection
- Click on cells to select them
- Use chat commands to modify selected cells

### Supported Commands

**Persian:**
- `سلول‌های انتخاب شده رو 20% کاهش بده` - Decrease selected cells by 20%
- `سلول‌های انتخاب شده رو 10% افزایش بده` - Increase selected cells by 10%
- `سلول‌های انتخاب شده رو 5000 کن` - Set selected cells to 5000
- `حقوق CEO رو 15% افزایش بده` - Increase CEO salary by 15%

**English:**
- `decrease selected cells by 20%`
- `increase selected cells by 10%`
- `set selected cells to 5000`
- `increase salary in CEO by 15%`

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variable: `GOOGLE_API_KEY`
- Deploy!

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Environment Variables
- `GOOGLE_API_KEY`: Your Google Gemini API key

### API Setup
1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file
3. Restart the development server

## 📱 Usage

1. **Select Cells**: Click on table cells to select them
2. **Chat Commands**: Type natural language commands in the chat
3. **Real-time Updates**: See changes applied immediately
4. **AI Assistant**: Get intelligent responses and suggestions

## 🎯 Features in Detail

### Smart Table
- **Cell Selection**: Multi-cell selection with visual feedback
- **Real-time Editing**: Direct cell editing with validation
- **Auto Calculations**: Automatic total row calculations
- **Responsive Design**: Works on all screen sizes

### AI Chat Interface
- **Natural Language**: Understands Persian and English
- **Context Aware**: Remembers conversation history
- **Smart Parsing**: Converts natural language to commands
- **Error Handling**: Graceful fallbacks and error messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Create a new issue with detailed description
- Contact the development team

---

**Built with ❤️ using Next.js and Google Gemini**