import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, Star, Zap, HelpCircle } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: any;
  selectedText: string;
  analyzing?: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, selectedText, analyzing = false }) => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    risks: true,
    mitigations: true,
    strengths: true,
    weaknesses: true,
    recommendations: true,
    ambiguousTerms: true,
    clarifications: true
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

  // Determine which sections to show based on analysis type
  const showRisks = analysis.type === 'risk' || analysis.risks;
  const showMitigations = analysis.type === 'risk' || analysis.mitigations;
  const showStrengths = analysis.type === 'review' || analysis.strengths;
  const showWeaknesses = analysis.type === 'review' || analysis.weaknesses;
  const showRecommendations = analysis.type === 'review' || analysis.recommendations;
  const showAmbiguousTerms = analysis.type === 'ambiguity' || analysis.ambiguousTerms;
  const showClarifications = analysis.type === 'ambiguity' || analysis.clarifications;

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
      {showRisks && analysis.risks && analysis.risks.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-900">Identified Risks</h3>
            </div>
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

      {/* Mitigations */}
      {showMitigations && analysis.mitigations && analysis.mitigations.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Mitigation Strategies</h3>
            </div>
            <button
              onClick={() => toggleSection('mitigations')}
              className="text-green-600 hover:text-green-800"
            >
              {expandedSections.mitigations ? '−' : '+'}
            </button>
          </div>
          {expandedSections.mitigations && (
            <ul className="space-y-2">
              {analysis.mitigations.map((mitigation: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{mitigation}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Strengths */}
      {showStrengths && analysis.strengths && analysis.strengths.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Strengths</h3>
            </div>
            <button
              onClick={() => toggleSection('strengths')}
              className="text-green-600 hover:text-green-800"
            >
              {expandedSections.strengths ? '−' : '+'}
            </button>
          </div>
          {expandedSections.strengths && (
            <ul className="space-y-2">
              {analysis.strengths.map((strength: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Weaknesses */}
      {showWeaknesses && analysis.weaknesses && analysis.weaknesses.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="font-semibold text-yellow-900">Weaknesses</h3>
            </div>
            <button
              onClick={() => toggleSection('weaknesses')}
              className="text-yellow-600 hover:text-yellow-800"
            >
              {expandedSections.weaknesses ? '−' : '+'}
            </button>
          </div>
          {expandedSections.weaknesses && (
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-yellow-700 text-sm">{weakness}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Recommendations */}
      {showRecommendations && analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Recommendations</h3>
            </div>
            <button
              onClick={() => toggleSection('recommendations')}
              className="text-blue-600 hover:text-blue-800"
            >
              {expandedSections.recommendations ? '−' : '+'}
            </button>
          </div>
          {expandedSections.recommendations && (
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-blue-700 text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Ambiguous Terms */}
      {showAmbiguousTerms && analysis.ambiguousTerms && analysis.ambiguousTerms.length > 0 && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-orange-900">Ambiguous Terms</h3>
            </div>
            <button
              onClick={() => toggleSection('ambiguousTerms')}
              className="text-orange-600 hover:text-orange-800"
            >
              {expandedSections.ambiguousTerms ? '−' : '+'}
            </button>
          </div>
          {expandedSections.ambiguousTerms && (
            <ul className="space-y-2">
              {analysis.ambiguousTerms.map((term: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-orange-700 text-sm">{term}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Clarifications */}
      {showClarifications && analysis.clarifications && analysis.clarifications.length > 0 && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900">Suggested Clarifications</h3>
            </div>
            <button
              onClick={() => toggleSection('clarifications')}
              className="text-purple-600 hover:text-purple-800"
            >
              {expandedSections.clarifications ? '−' : '+'}
            </button>
          </div>
          {expandedSections.clarifications && (
            <ul className="space-y-2">
              {analysis.clarifications.map((clarification: string, index: number) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-purple-700 text-sm">{clarification}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Suggestions (fallback) */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Recommendations</h3>
            </div>
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