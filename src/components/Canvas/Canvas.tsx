import React, { useState } from 'react';
import { BPMNDiagram, BPMNElement as BPMNElementType, DraggedElement } from '../../types/bpmn';
import { BPMNElement } from './BPMNElement';

interface CanvasProps {
  diagram: BPMNDiagram;
  onUpdateDiagram: (diagram: BPMNDiagram) => void;
  draggedElement: DraggedElement | null;
}

export const Canvas: React.FC<CanvasProps> = ({ diagram, onUpdateDiagram, draggedElement }) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left - draggedElement.offset.x,
      y: e.clientY - rect.top - draggedElement.offset.y,
    };

    const newElement: BPMNElementType = {
      id: crypto.randomUUID(),
      type: draggedElement.type,
      position,
      label: `${draggedElement.type.charAt(0).toUpperCase() + draggedElement.type.slice(1)} ${diagram.elements.length + 1}`,
    };

    const updatedDiagram = {
      ...diagram,
      elements: [...diagram.elements, newElement],
    };

    onUpdateDiagram(updatedDiagram);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleElementMove = (id: string, position: { x: number; y: number }) => {
    const updatedDiagram = {
      ...diagram,
      elements: diagram.elements.map(el =>
        el.id === id ? { ...el, position } : el
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleElementDelete = (id: string) => {
    const updatedDiagram = {
      ...diagram,
      elements: diagram.elements.filter(el => el.id !== id),
      connections: diagram.connections.filter(conn => 
        conn.source !== id && conn.target !== id
      ),
    };
    onUpdateDiagram(updatedDiagram);
    setSelectedElementId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-50">
      <div
        className="w-full h-full relative"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
      >
        {diagram.elements.map((element) => (
          <BPMNElement
            key={element.id}
            element={element}
            isSelected={selectedElementId === element.id}
            onSelect={setSelectedElementId}
            onMove={handleElementMove}
            onDelete={handleElementDelete}
          />
        ))}

        {diagram.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">Empty Canvas</div>
              <div className="text-gray-500 text-sm">
                Drag elements from the toolbar to start creating your BPMN diagram
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};