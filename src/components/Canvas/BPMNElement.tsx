import React from 'react';
import { Circle, Square, Diamond, CircleDot } from 'lucide-react';
import { BPMNElement as BPMNElementType } from '../../types/bpmn';

interface BPMNElementProps {
  element: BPMNElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
}

export const BPMNElement: React.FC<BPMNElementProps> = ({
  element,
  isSelected,
  onSelect,
  onMove,
  onDelete,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  const getElementConfig = () => {
    switch (element.type) {
      case 'start':
        return {
          Icon: Circle,
          color: 'text-green-600 border-green-600',
          bgColor: 'bg-green-50',
          size: 60,
        };
      case 'task':
        return {
          Icon: Square,
          color: 'text-blue-600 border-blue-600',
          bgColor: 'bg-blue-50',
          size: 100,
        };
      case 'gateway':
        return {
          Icon: Diamond,
          color: 'text-yellow-600 border-yellow-600',
          bgColor: 'bg-yellow-50',
          size: 80,
        };
      case 'end':
        return {
          Icon: CircleDot,
          color: 'text-red-600 border-red-600',
          bgColor: 'bg-red-50',
          size: 60,
        };
    }
  };

  const config = getElementConfig();
  const { Icon, color, bgColor, size } = config;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y,
    });
    onSelect(element.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      onMove(element.id, newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && isSelected) {
      onDelete(element.id);
    }
  };

  return (
    <div
      className={`absolute cursor-move select-none group ${isDragging ? 'z-10' : 'z-0'}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: size,
        height: size,
      }}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`
          w-full h-full ${bgColor} border-2 ${color} rounded-lg
          flex items-center justify-center transition-all duration-200
          ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
          hover:shadow-md group-hover:scale-105
          ${element.type === 'start' || element.type === 'end' ? 'rounded-full' : ''}
          ${element.type === 'gateway' ? 'transform rotate-45' : ''}
        `}
      >
        <Icon 
          size={element.type === 'task' ? 24 : 20} 
          className={`${color} ${element.type === 'gateway' ? 'transform -rotate-45' : ''}`} 
        />
      </div>
      
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 bg-white px-2 py-1 rounded border shadow-sm min-w-max">
        {element.label || element.type}
      </div>

      {isSelected && (
        <button
          onClick={() => onDelete(element.id)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  );
};