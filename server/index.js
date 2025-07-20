import express from 'express';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Mock database (in production, use a real database)
let users = [];
let documents = [];

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Helper function to extract text from different file types
const extractTextFromFile = async (filePath, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } else if (mimetype === 'text/plain') {
      return fs.readFileSync(filePath, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('Error extracting text:', error);
    return '';
  }
};

// Routes

// Authentication routes
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    createdAt: new Date()
  };

  users.push(user);
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
  
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// Document routes
app.post('/api/files', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const extractedText = await extractTextFromFile(file.path, file.mimetype);
    
    const document = {
      id: Date.now().toString(),
      title: req.body.title || file.originalname,
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      userId: req.user.userId,
      extractedText,
      uploadedAt: new Date()
    };

    documents.push(document);
    res.json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

app.get('/api/files', authenticateToken, (req, res) => {
  const userDocuments = documents.filter(doc => doc.userId === req.user.userId);
  res.json(userDocuments);
});

app.get('/api/files/:id', authenticateToken, (req, res) => {
  const document = documents.find(doc => doc.id === req.params.id && doc.userId === req.user.userId);
  if (!document) {
    return res.status(404).json({ message: 'Document not found' });
  }
  res.json(document);
});

app.delete('/api/files/:id', authenticateToken, (req, res) => {
  const documentIndex = documents.findIndex(doc => doc.id === req.params.id && doc.userId === req.user.userId);
  if (documentIndex === -1) {
    return res.status(404).json({ message: 'Document not found' });
  }

  const document = documents[documentIndex];
  try {
    fs.unlinkSync(path.join('uploads', document.filename));
  } catch (error) {
    console.error('Error deleting file:', error);
  }

  documents.splice(documentIndex, 1);
  res.json({ message: 'Document deleted successfully' });
});

// AI Analysis routes
// Update /api/analyze-text route
app.post('/api/analyze-text', authenticateToken, async (req, res) => {
  try {
    const { text, analysisType } = req.body;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return different responses based on analysisType
    let analysis;
    switch (analysisType) {
      case 'risk':
        analysis = {
          type: 'risk',
          risks: [
            'Potential ambiguity in termination clause',
            'Indemnification terms may be too broad',
            'Jurisdiction clause needs clarification'
          ],
          mitigations: [
            'Add specific termination notice requirements',
            'Define scope of indemnification more clearly',
            'Specify governing law jurisdiction'
          ],
          confidence: 85
        };
        break;
      
      case 'review':
        analysis = {
          type: 'review',
          strengths: [
            'Clear ownership of work product',
            'Well-defined payment terms',
            'Comprehensive confidentiality provisions'
          ],
          weaknesses: [
            'Vague force majeure clause',
            'Missing audit rights for service provider',
            'Inadequate dispute resolution mechanism'
          ],
          recommendations: [
            'Add specific force majeure events',
            'Include audit rights clause',
            'Specify arbitration process'
          ],
          confidence: 78
        };
        break;
      
      case 'ambiguity':
        analysis = {
          type: 'ambiguity',
          ambiguousTerms: [
            '"Reasonable efforts" without definition',
            '"Material breach" not quantified',
            '"Substantial portion" without specification'
          ],
          clarifications: [
            'Define "reasonable efforts" as commercially reasonable steps',
            'Specify material breach thresholds',
            'Quantify "substantial portion" as 20% or more'
          ],
          confidence: 92
        };
        break;
      
      default:
        // Fallback to generic structure
        analysis = {
          type: analysisType,
          risks: [
            'Potential ambiguity in termination clause',
            'Indemnification terms may be too broad',
            'Jurisdiction clause needs clarification'
          ],
          suggestions: [
            'Consider adding specific termination notice requirements',
            'Define scope of indemnification more clearly',
            'Specify governing law jurisdiction'
          ],
          confidence: 85
        };
    }

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error analyzing text', error: error.message });
  }
});

app.post('/api/extract-clauses', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    // Mock Hugging Face API integration (replace with actual HF API call)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const extractedClauses = [
      {
        type: 'termination',
        text: 'Either party may terminate this agreement with 30 days written notice.',
        confidence: 0.92,
        startIndex: 245,
        endIndex: 312
      },
      {
        type: 'indemnity',
        text: 'The Provider shall indemnify and hold harmless the Client from any claims.',
        confidence: 0.88,
        startIndex: 456,
        endIndex: 523
      },
      {
        type: 'confidentiality',
        text: 'Both parties agree to maintain confidentiality of proprietary information.',
        confidence: 0.95,
        startIndex: 678,
        endIndex: 752
      },
      {
        type: 'jurisdiction',
        text: 'This agreement shall be governed by the laws of [State/Country].',
        confidence: 0.87,
        startIndex: 890,
        endIndex: 951
      }
    ];

    res.json(extractedClauses);
  } catch (error) {
    res.status(500).json({ message: 'Error extracting clauses', error: error.message });
  }
});

app.post('/api/explain-simple', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    // Mock GPT-4o API integration (replace with actual OpenAI API call)
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const explanation = {
      original: text,
      simplified: "This part of the contract says that if something goes wrong and someone gets sued, one party (usually the service provider) will take responsibility and pay for any legal costs or damages. It's like having insurance - they're saying 'don't worry, we'll handle it if there's a problem.'",
      keyPoints: [
        'One party protects the other from lawsuits',
        'They agree to pay legal costs if problems arise',
        'This is common in business contracts'
      ]
    };

    res.json(explanation);
  } catch (error) {
    res.status(500).json({ message: 'Error explaining text', error: error.message });
  }
});

// Chat interface for legal queries
app.post('/api/chat', authenticateToken, async (req, res) => {
  try {
    const { question, documentText } = req.body;
    
    // Mock AI chat response (replace with actual AI API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const responses = {
      'risk': 'Based on my analysis, the main risks in this contract include: potential ambiguity in termination clauses, broad indemnification terms, and unclear jurisdiction specifications.',
      'favor': 'This contract appears to favor the service provider more than the client, particularly in the liability and termination sections.',
      'default': 'I\'ve analyzed your question about the legal document. Here are the key points to consider...'
    };
    
    let response = responses.default;
    if (question.toLowerCase().includes('risk')) response = responses.risk;
    if (question.toLowerCase().includes('favor')) response = responses.favor;
    
    res.json({ response, timestamp: new Date() });
  } catch (error) {
    res.status(500).json({ message: 'Error processing chat', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});