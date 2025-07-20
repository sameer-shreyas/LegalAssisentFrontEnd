import React from 'react';
import { HelpCircle, Clipboard, Check } from 'lucide-react';

interface ExplanationPanelProps {
  explanation: {
    original: string;
    simplified: string;
    keyPoints: string[];
  } | null;
  analyzing?: boolean;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanation, analyzing = false }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (analyzing) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplifying Text...</h3>
        <p className="text-gray-600">AI is explaining the legal text in simple terms.</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="p-6 text-center">
        <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Explanation Yet</h3>
        <p className="text-gray-600">
          Select text in the document and click "Explain Simple" to get a plain English explanation.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">Simplified Explanation</h2>
        </div>
        <button
          onClick={() => copyToClipboard(explanation.simplified)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-1" /> Copied!
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4 mr-1" /> Copy
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Original Text:</h3>
        <p className="text-gray-700 italic mb-4">{explanation.original}</p>
        
        <h3 className="text-sm font-medium text-green-700 mb-2">Plain English Explanation:</h3>
        <p className="text-green-700">{explanation.simplified}</p>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-sm font-medium text-blue-700 mb-3">Key Points:</h3>
        <ul className="space-y-2">
          {explanation.keyPoints.map((point, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
              <span className="text-blue-700 text-sm">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExplanationPanel;