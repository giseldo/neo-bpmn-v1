import React, { useState } from 'react';
import { Plus, FileText, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { BPMNDiagram } from '../types/bpmn';

interface SidebarProps {
  diagrams: BPMNDiagram[];
  currentDiagram: BPMNDiagram | null;
  onCreateDiagram: (name: string) => void;
  onSelectDiagram: (diagram: BPMNDiagram) => void;
  onDeleteDiagram: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  diagrams,
  currentDiagram,
  onCreateDiagram,
  onSelectDiagram,
  onDeleteDiagram,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNewDiagramInput, setShowNewDiagramInput] = useState(false);
  const [newDiagramName, setNewDiagramName] = useState('');

  const handleCreateDiagram = () => {
    if (newDiagramName.trim()) {
      onCreateDiagram(newDiagramName.trim());
      setNewDiagramName('');
      setShowNewDiagramInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateDiagram();
    } else if (e.key === 'Escape') {
      setShowNewDiagramInput(false);
      setNewDiagramName('');
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col animate-slide-in">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">BPMN Designer</h1>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        {!showNewDiagramInput ? (
          <button
            onClick={() => setShowNewDiagramInput(true)}
            className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Diagram
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Diagram name..."
              value={newDiagramName}
              onChange={(e) => setNewDiagramName(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateDiagram}
                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewDiagramInput(false);
                  setNewDiagramName('');
                }}
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {diagrams.map((diagram) => (
            <div
              key={diagram.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentDiagram?.id === diagram.id
                  ? 'bg-blue-100 border border-blue-200'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onSelectDiagram(diagram)}
            >
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {diagram.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {diagram.elements.length} elements
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {diagram.updatedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDiagram(diagram.id);
                }}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        
        {diagrams.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No diagrams yet</p>
            <p className="text-gray-400 text-xs mt-1">Create your first BPMN diagram</p>
          </div>
        )}
      </div>
    </div>
  );
};