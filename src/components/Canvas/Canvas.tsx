import React, { useState } from 'react';
import { BPMNDiagram, BPMNElement as BPMNElementType, BPMNConnection, DraggedElement } from '../../types/bpmn';
import { BPMNElement } from './BPMNElement';
import { ConnectionLine } from './ConnectionLine';

interface CanvasProps {
  diagram: BPMNDiagram;
  onUpdateDiagram: (diagram: BPMNDiagram) => void;
  draggedElement: DraggedElement | null;
}

export const Canvas: React.FC<CanvasProps> = ({ diagram, onUpdateDiagram, draggedElement }) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ elementId: string; position: { x: number; y: number } } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
    if (isConnecting) return; // Don't move elements while connecting
    
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

  const handleElementLabelUpdate = (id: string, label: string) => {
    const updatedDiagram = {
      ...diagram,
      elements: diagram.elements.map(el =>
        el.id === id ? { ...el, label } : el
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleConnectionStart = (elementId: string, position: { x: number; y: number }) => {
    setIsConnecting(true);
    setConnectionStart({ elementId, position });
    setSelectedElementId(null);
    setSelectedConnectionId(null);
  };

  const handleConnectionEnd = (targetElementId: string) => {
    if (connectionStart && connectionStart.elementId !== targetElementId) {
      // Check if connection already exists
      const existingConnection = diagram.connections.find(
        conn => conn.source === connectionStart.elementId && conn.target === targetElementId
      );
      
      if (!existingConnection) {
        const newConnection: BPMNConnection = {
          id: crypto.randomUUID(),
          source: connectionStart.elementId,
          target: targetElementId,
        };

        const updatedDiagram = {
          ...diagram,
          connections: [...diagram.connections, newConnection],
        };

        onUpdateDiagram(updatedDiagram);
      }
    }
    
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleConnectionDelete = (id: string) => {
    const updatedDiagram = {
      ...diagram,
      connections: diagram.connections.filter(conn => conn.id !== id),
    };
    onUpdateDiagram(updatedDiagram);
    setSelectedConnectionId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
      setSelectedConnectionId(null);
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isConnecting) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
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
        onMouseMove={handleMouseMove}
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6B7280"
              />
            </marker>
            <marker
              id="arrowhead-selected"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3B82F6"
              />
            </marker>
          </defs>
          
          {/* Render connections */}
          {diagram.connections.map((connection) => {
            const sourceElement = diagram.elements.find(el => el.id === connection.source);
            const targetElement = diagram.elements.find(el => el.id === connection.target);
            
            if (!sourceElement || !targetElement) return null;
            
            return (
              <ConnectionLine
                key={connection.id}
                connection={connection}
                sourceElement={sourceElement}
                targetElement={targetElement}
                isSelected={selectedConnectionId === connection.id}
                onSelect={setSelectedConnectionId}
                onDelete={handleConnectionDelete}
              />
            );
          })}

          {/* Temporary connection line while connecting */}
          {isConnecting && connectionStart && (
            <line
              x1={connectionStart.position.x}
              y1={connectionStart.position.y}
              x2={mousePosition.x}
              y2={mousePosition.y}
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Elements */}
        <div style={{ zIndex: 2 }} className="relative">
          {diagram.elements.map((element) => (
            <BPMNElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={setSelectedElementId}
              onMove={handleElementMove}
              onDelete={handleElementDelete}
              onUpdateLabel={handleElementLabelUpdate}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              isConnecting={isConnecting}
            />
          ))}
        </div>

        {/* Empty state */}
        {diagram.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 0 }}>
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">Empty Canvas</div>
              <div className="text-gray-500 text-sm">
                Drag elements from the toolbar to start creating your BPMN diagram
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Hover over elements and use the blue dots to create connections
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Double-click on elements to rename them
              </div>
            </div>
          </div>
        )}

        {/* Connection mode indicator */}
        {isConnecting && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
            <div className="text-sm font-medium">Connection Mode</div>
            <div className="text-xs opacity-90">Click on another element to connect, or click canvas to cancel</div>
          </div>
        )}
      </div>
    </div>
  );
};