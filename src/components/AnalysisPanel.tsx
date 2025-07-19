import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: any;
  selectedText: string;
  analyzing?: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, selectedText, analyzing = false }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    risks: true,
    suggestions: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (analyzing) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Document...</h3>
        <p className="text-gray-600">AI is processing your selected text for legal insights.</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 text-center">
        <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Yet</h3>
        <p className="text-gray-600">Select text in the document and click an analysis button to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Analysis Type */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Analysis Type</h3>
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
          {analysis.type}
        </span>
      </div>

      {/* Selected Text */}
      {selectedText && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Selected Text</h3>
          <p className="text-gray-700 text-sm italic">"{selectedText}"</p>
        </div>
      )}

      {/* Confidence Score */}
      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="font-semibold text-green-900">Confidence Score</h3>
        </div>
        <div className="flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${analysis.confidence}%` }}
            />
          </div>
          <span className="text-green-700 font-medium">{analysis.confidence}%</span>
        </div>
      </div>

      {/* Risks */}
      {analysis.risks && analysis.risks.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="font-semibold text-red-900">Identified Risks</h3>
            <button
              onClick={() => toggleSection('risks')}
              className="text-red-600 hover:text-red-800"
            >
              {expandedSections.risks ? '−' : '+'}
            </button>
          </div>
          {expandedSections.risks && (
            <ul className="space-y-2">
              {analysis.risks.map((risk: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{risk}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-green-900">Recommendations</h3>
            <button
              onClick={() => toggleSection('suggestions')}
              className="text-green-600 hover:text-green-800"
            >
              {expandedSections.suggestions ? '−' : '+'}
            </button>
          </div>
          {expandedSections.suggestions && (
            <ul className="space-y-2">
              {analysis.suggestions.map((suggestion: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPanel;