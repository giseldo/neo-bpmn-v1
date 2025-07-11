import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Circle, Square, Diamond, Download, Upload, Layers } from 'lucide-react';
import { BPMNElement } from '../types/bpmn';

interface ToolbarProps {
  onDragStart: (elementType: BPMNElement['type'] | 'pool', event: React.DragEvent) => void;
  onExport: (format: 'mermaid' | 'bpmn') => void;
  onImport: (content: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onDragStart, onExport, onImport }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const elements = [
    { type: 'start' as const, icon: Circle, label: t('toolbar.startEvent'), color: 'text-green-600' },
    { type: 'task' as const, icon: Square, label: t('toolbar.task'), color: 'text-blue-600' },
    { type: 'gateway' as const, icon: Diamond, label: t('toolbar.gateway'), color: 'text-yellow-600' },
    { type: 'end' as const, icon: Circle, label: t('toolbar.endEvent'), color: 'text-red-600' },
    { type: 'pool' as const, icon: Layers, label: t('toolbar.pool'), color: 'text-purple-600' },
  ];

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onImport(content);
      };
      reader.readAsText(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-gray-700">{t('toolbar.elements')}</h2>
          <div className="flex items-center gap-2">
            {elements.map(({ type, icon: Icon, label, color }) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => onDragStart(type, e)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-gray-200"
                title={label}
              >
                <Icon size={18} className={color} />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Upload size={16} />
            {t('toolbar.import')}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".mmd,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Download size={16} />
              {t('toolbar.export')}
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => onExport('mermaid')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
              >
                {t('toolbar.export')} {t('toolbar.mermaid')}
              </button>
              <button
                onClick={() => onExport('bpmn')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
              >
                {t('toolbar.export')} {t('toolbar.bpmn')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};