import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, MessageSquare, FileText, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AnalysisPanel from '../components/AnalysisPanel';
import ClausePanel from '../components/ClausePanel';
import ChatPanel from '../components/ChatPanel';
import ExplanationPanel from '../components/ExplanationPanel';

interface Document {
  id: string;
  title: string;
  extractedText: string;
  originalName: string;
}

// Add these analysis type interfaces
interface RiskAnalysis {
  type: 'risk';
  risks: string[];
  mitigations: string[];
  confidence: number;
}

interface ReviewAnalysis {
  type: 'review';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  confidence: number;
}

interface AmbiguityAnalysis {
  type: 'ambiguity';
  ambiguousTerms: string[];
  clarifications: string[];
  confidence: number;
}

type AnalysisResponse = RiskAnalysis | ReviewAnalysis | AmbiguityAnalysis | null;

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState<'analysis' | 'clauses' | 'chat' | 'explanation'>('analysis');
  const [analysis, setAnalysis] = useState<AnalysisResponse>(null);  const [clauses, setClauses] = useState<any[]>([]);
  const [simplifiedText, setSimplifiedText] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);
  const [explanation, setExplanation] = useState<{original: string; simplified: string; keyPoints: string[]} | null>(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`/api/files/${id}`);
      setDocument(response.data);
      // Auto-extract clauses when document loads
      if (response.data.extractedText) {
        await extractClauses(response.data.extractedText);
      }
    } catch (error) {
      toast.error('Failed to fetch document');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setSelectedText(selection.toString());
    }
  };

  const analyzeSelectedText = async (analysisType: string) => {
  if (!selectedText) {
    toast.error('Please select some text first');
    return;
  }

  setAnalyzing(true);
  setAnalysis(null);
  
  try {
    const response = await axios.post('/api/analyze-text', {
      text: selectedText,
      analysisType
    });
    
    // Add type property to response data
    const typedResponse = {
      ...response.data,
      type: analysisType
    };
    
    setAnalysis(typedResponse);
    setActivePanel('analysis');
    toast.success('Analysis completed successfully');
  } catch (error) {
    console.error('Analysis error:', error);
    toast.error('Failed to analyze text. Please try again.');
  } finally {
    setAnalyzing(false);
  }
};

  const extractClauses = async (text: string) => {
    if (!text) return;
    
    try {
      const response = await axios.post('/api/extract-clauses', {
        text
      });
      setClauses(response.data);
      if (response.data.length > 0) {
        toast.success(`Found ${response.data.length} legal clauses`);
      }
    } catch (error) {
      console.error('Clause extraction error:', error);
      toast.error('Failed to extract clauses');
    }
  };

  // Update explainSimple function
const explainSimple = async () => {
  if (!selectedText) {
    toast.error('Please select some text first');
    return;
  }

  setAnalyzing(true);
  setExplanation(null);
  try {
    const response = await axios.post('/api/explain-simple', {
      text: selectedText
    });
    
    setExplanation({
      original: response.data.original,
      simplified: response.data.simplified,
      keyPoints: response.data.keyPoints
    });
    setActivePanel('explanation'); // Switch to explanation panel
    toast.success('Text simplified successfully');
  } catch (error) {
    console.error('Explanation error:', error);
    toast.error('Failed to explain text. Please try again.');
  } finally {
    setAnalyzing(false);
  }
};

  const highlightClauses = (text: string) => {
    let highlightedText = text;
    
    clauses.forEach((clause, index) => {
      const colors = ['bg-red-100', 'bg-yellow-100', 'bg-green-100', 'bg-blue-100'];
      const color = colors[index % colors.length];
      
      highlightedText = highlightedText.replace(
        clause.text,
        `<span class="${color} px-1 rounded cursor-pointer" title="${clause.type} clause (${Math.round(clause.confidence * 100)}% confidence)">${clause.text}</span>`
      );
    });
    
    return highlightedText;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Document not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 p-2 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{document.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedText && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => analyzeSelectedText('risk')}
                    disabled={analyzing}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 disabled:opacity-50"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1 inline" />
                    Risk Analysis
                  </button>
                  <button
                    onClick={() => analyzeSelectedText('review')}
                    disabled={analyzing}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 disabled:opacity-50"
                  >
                    <CheckCircle className="h-3 w-3 mr-1 inline" />
                    Review
                  </button>
                  <button
                  onClick={explainSimple}
                  disabled={analyzing}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 disabled:opacity-50"
                >
                  <HelpCircle className="h-3 w-3 mr-1 inline" />
                  Explanation
                </button>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {simplifiedText && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Simplified Explanation:</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                    <h4 className="text-sm font-medium text-gray-600 mb-1">Original Text:</h4>
                    <p className="text-sm text-gray-700 italic">"{selectedText}"</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded border-l-4 border-green-500">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Plain English:</h4>
                    <p className="text-green-700">{simplifiedText}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSimplifiedText('')}
                  className="mt-2 text-sm text-green-600 hover:text-green-800"
                >
                  Hide
                </button>
              </div>
            )}
            
            <div
              className="prose prose-gray max-w-none leading-relaxed"
              onMouseUp={handleTextSelection}
            >
              {document.extractedText.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                  <span dangerouslySetInnerHTML={{ __html: highlightClauses(paragraph) }} />
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Panel Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActivePanel('analysis')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activePanel === 'analysis'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Brain className="h-4 w-4 mr-2 inline" />
            Analysis
          </button>
          <button
            onClick={() => setActivePanel('clauses')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activePanel === 'clauses'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="h-4 w-4 mr-2 inline" />
            Clauses
          </button>
          <button
            onClick={() => setActivePanel('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activePanel === 'chat'
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="h-4 w-4 mr-2 inline" />
            Chat
          </button>
          <button
          onClick={() => setActivePanel('explanation')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activePanel === 'explanation'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <HelpCircle className="h-4 w-4 mr-2 inline" />
          Explanation
        </button>

        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-auto">
          {activePanel === 'analysis' && (
            <AnalysisPanel analysis={analysis} selectedText={selectedText} analyzing={analyzing} />
          )}
          {activePanel === 'clauses' && (
            <ClausePanel clauses={clauses} />
          )}
          {activePanel === 'chat' && (
            <ChatPanel documentText={document.extractedText} />
          )}
          {activePanel === 'explanation' && (
            <ExplanationPanel explanation={explanation} analyzing={analyzing} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;