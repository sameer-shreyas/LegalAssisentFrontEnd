# LegalAssist AI - Premium AI-Powered Legal Document Platform

A premium, full-stack application designed for legal professionals to analyze, review, and understand legal documents using cutting-edge AI technology. Built with modern web technologies and a beautiful, professional interface.

## 🚀 Features

### 🤖 **AI-Powered Intelligence**
- **Claude API Integration**: Advanced legal text analysis and risk assessment
- **GPT-4o "Explain Like I'm 5"**: Complex legal language simplified into plain English
- **Hugging Face Clause Extraction**: Automatic identification of key legal clauses
- **Interactive AI Chat**: Ask questions about your documents and get expert insights

### 📄 **Document Management**
- **Multi-Format Support**: Upload PDF, DOCX, and TXT legal documents
- **Secure Storage**: Enterprise-grade document security and privacy
- **Text Extraction**: Automatic text extraction from uploaded documents
- **Sample Contracts**: Try the platform with realistic legal documents

### 🎨 **Premium User Experience**
- **Modern Design System**: Professional interface with smooth animations
- **Dark/Light Mode**: Customizable theme preferences
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Real-time Feedback**: Loading states, animations, and toast notifications
- **Intuitive Navigation**: Clean, organized interface designed for legal professionals

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS with custom design system
- Framer Motion for smooth animations
- React Router for navigation
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core with In-Memory Database
- JWT authentication
- BCrypt for password hashing
- Document text extraction (PDF, DOCX, TXT)
- Comprehensive error handling and logging
- Unit tests with xUnit

### AI Integration
- **Claude API (Anthropic)**: Legal text analysis and risk assessment
- **OpenAI GPT-4o**: Text simplification and chat interface
- **Hugging Face**: Clause extraction and NLP processing
- Retry logic and timeout handling
- Secure API key management

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js 18+ for frontend
- .NET 8 SDK for backend
- npm or yarn
- API keys for Claude, OpenAI, and Hugging Face

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd legal-document-assistant
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up backend:
```bash
cd backend
dotnet restore
```

4. Configure API keys in `backend/LegalDocumentAssistant.Api/appsettings.json`:
```json
{
  "AiSettings": {
    "ClaudeApiKey": "your-claude-api-key-here",
    "OpenAiApiKey": "your-openai-api-key-here",
    "HuggingFaceApiKey": "your-huggingface-api-key-here"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-key-that-should-be-at-least-32-characters-long"
  }
}
```

5. Start both applications:

**Backend (Terminal 1):**
```bash
cd backend
dotnet run --project LegalDocumentAssistant.Api
```

**Frontend (Terminal 2):**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: https://localhost:7001
- Swagger Documentation: https://localhost:7001/swagger

## 📁 Project Structure

```
legal-document-assistant/
├── backend/
│   ├── LegalDocumentAssistant.Api/     # ASP.NET Core Web API
│   │   ├── Controllers/                # API Controllers
│   │   ├── Services/                   # Business logic services
│   │   ├── Models/                     # Entity models
│   │   ├── DTOs/                       # Data Transfer Objects
│   │   └── Data/                       # Entity Framework context
│   └── LegalDocumentAssistant.Tests/   # Unit tests
├── src/
│   ├── components/                     # React components
│   │   ├── ui/                         # Reusable UI components
│   │   ├── AnalysisPanel.tsx
│   │   ├── ChatPanel.tsx
│   │   ├── ClausePanel.tsx
│   │   └── Layout.tsx
│   ├── contexts/                       # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/                          # Page components
│   │   ├── Dashboard.tsx
│   │   ├── DocumentEditor.tsx
│   │   └── Login.tsx
│   ├── utils/                          # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.js                  # Tailwind CSS configuration
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Document Management
- `GET /api/files` - List user documents
- `POST /api/files` - Upload document
- `GET /api/files/:id` - Get document details
- `DELETE /api/files/:id` - Delete document

### AI Analysis
- `POST /api/analyze-text` - Analyze selected text for risks
- `POST /api/extract-clauses` - Extract legal clauses
- `POST /api/explain-simple` - Simplify complex legal text
- `POST /api/chat` - Chat with AI about document
- `POST /api/ai/explain` - Demo endpoint for testing AI integration

## 🤖 AI Features

### **Claude API - Legal Analysis**
- **Risk Assessment**: Identifies potential legal risks and liabilities
- **Contract Review**: Comprehensive analysis of contract terms
- **Confidence Scoring**: AI confidence levels for each analysis
- **Actionable Suggestions**: Specific recommendations for improvements

### **Hugging Face - Clause Extraction**
- **Automatic Detection**: Identifies key legal clauses including:
  - Termination clauses
  - Indemnity provisions
  - Confidentiality agreements
  - Jurisdiction specifications
  - Payment terms
  - Intellectual property clauses
- **Visual Highlighting**: Color-coded clause highlighting in documents
- **Confidence Scores**: Reliability metrics for each extracted clause

### **GPT-4o - "Explain Like I'm 5"**
- **Plain English Translation**: Converts complex legal language to simple terms
- **Key Points Extraction**: Bullet-point summaries of important concepts
- **Practical Implications**: What the legal text means in real-world terms
- **Side-by-Side Comparison**: Original text alongside simplified explanation

### **AI Chat Assistant**
- **Document-Specific Queries**: Ask questions about uploaded documents
- **Contextual Understanding**: AI maintains context of the conversation
- **Legal Expertise**: Specialized knowledge for legal document analysis
- **Suggested Questions**: Pre-built queries to get started quickly

## 🔒 Security Features

- JWT-based authentication
- Password hashing with BCrypt
- Secure file upload handling
- API key protection
- Input validation and sanitization
- Secure file upload handling
- CORS configuration
- Request timeout and retry logic

## 🎨 Design System

### **Color Palette**
- **Primary**: #1e40af (Professional Blue)
- **Accent**: #f59e0b (Warm Gold)
- **Background**: #f8fafc (Neutral Gray)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### **Typography**
- **Font Family**: Inter (Clean, professional)
- **Headings**: 120% line height
- **Body Text**: 150% line height
- **Maximum 3 font weights**: Regular, Medium, Bold

### **Components**
- **Consistent 8px spacing system**
- **Soft shadows and subtle animations**
- **Responsive breakpoints for all devices**
- **Dark/Light mode support**

## 🧪 Testing

Run backend tests:
```bash
cd backend
dotnet test
```

The test suite includes:
- **Unit tests** for services and controllers
- **Integration tests** for API endpoints
- **Mock AI API responses** for reliable testing

## 🚀 Deployment

### Frontend Deployment
Build for production:
```bash
npm run build
```

Deploy to platforms like:
- Vercel
- Netlify
- AWS S3 + CloudFront

### Backend Deployment
Build and publish:
```bash
cd backend
dotnet publish -c Release -o ./publish
```

Deploy to platforms like:
- Azure App Service
- AWS Elastic Beanstalk
- Google Cloud Run
- Docker containers

## 🔑 API Keys Setup

### **Getting API Keys**

1. **Claude API (Anthropic)**:
   - Visit: https://console.anthropic.com/
   - Create account and get API key
   - Free tier includes generous usage limits

2. **OpenAI GPT-4o**:
   - Visit: https://platform.openai.com/api-keys
   - Create API key
   - Note: GPT-4o requires paid credits

3. **Hugging Face**:
   - Visit: https://huggingface.co/settings/tokens
   - Create a free account and generate token
   - Free tier includes inference API access

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- **Real-time Collaboration**: Multi-user document editing
- **Document Version Control**: Track changes and revisions
- **Advanced AI Models**: Integration with specialized legal AI models
- **Export Features**: PDF reports with AI annotations
- **Mobile App**: Native iOS and Android applications
- **Enterprise Features**: SSO, advanced security, audit logs
- **API Integrations**: Connect with legal practice management systems

---

**Built with ❤️ for the legal community**

*Transforming legal document analysis with the power of AI*

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- Real-time collaboration features
- Document version control
- Export documents with AI annotations
- Premium subscription plans
- Advanced AI models integration
- Mobile app development

---

Built with ❤️ for the legal community