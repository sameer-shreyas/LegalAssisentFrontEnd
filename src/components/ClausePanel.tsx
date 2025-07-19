import React, { useState } from 'react';
import { FileText, Tag, TrendingUp } from 'lucide-react';

interface Clause {
  type: string;
  text: string;
  confidence: number;
  startIndex: number;
  endIndex: number;
}

interface ClausePanelProps {
  clauses: Clause[];
}

const ClausePanel: React.FC<ClausePanelProps> = ({ clauses }) => {
  const [expandedClauses, setExpandedClauses] = useState<{ [key: number]: boolean }>({});

  const toggleClause = (index: number) => {
    setExpandedClauses(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getClauseColor = (type: string) => {
    switch (type) {
      case 'termination':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'indemnity':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confidentiality':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'jurisdiction':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getClauseIcon = (type: string) => {
    switch (type) {
      case 'termination':
        return '🚪';
      case 'indemnity':
        return '🛡️';
      case 'confidentiality':
        return '🔒';
      case 'jurisdiction':
        return '⚖️';
      default:
        return '📋';
    }
  };

  if (clauses.length === 0) {
    return (
      <div className="p-6 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clauses Extracted</h3>
        <p className="text-gray-600">AI is processing the document to extract legal clauses.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Extracted Clauses</h3>
        <p className="text-sm text-gray-600">
          {clauses.length} clause{clauses.length !== 1 ? 's' : ''} found in the document
        </p>
      </div>

      {clauses.map((clause, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between p-4 cursor-pointer" onClick={() => toggleClause(index)}>
            <div className="flex items-center">
              <span className="text-xl mr-2">{getClauseIcon(clause.type)}</span>
              <div>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getClauseColor(clause.type)}`}>
                  {clause.type}
                </span>
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              {Math.round(clause.confidence * 100)}%
            </div>
            <button className="ml-2 text-gray-400 hover:text-gray-600">
              {expandedClauses[index] ? '−' : '+'}
            </button>
          </div>
          
          {expandedClauses[index] && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{clause.text}</p>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center text-xs text-gray-500">
                  <Tag className="h-3 w-3 mr-1" />
                  Position: {clause.startIndex} - {clause.endIndex}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Clause Summary</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-blue-700">
            <strong>Termination:</strong> {clauses.filter(c => c.type === 'termination').length}
          </div>
          <div className="text-blue-700">
            <strong>Indemnity:</strong> {clauses.filter(c => c.type === 'indemnity').length}
          </div>
          <div className="text-blue-700">
            <strong>Confidentiality:</strong> {clauses.filter(c => c.type === 'confidentiality').length}
          </div>
          <div className="text-blue-700">
            <strong>Jurisdiction:</strong> {clauses.filter(c => c.type === 'jurisdiction').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClausePanel;