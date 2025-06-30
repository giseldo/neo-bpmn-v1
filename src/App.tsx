import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { useDiagrams } from './hooks/useDiagrams';
import { DraggedElement, BPMNElement } from './types/bpmn';
import { exportToMermaid, exportToBPMN } from './utils/exporters';

function App() {
  const {
    diagrams,
    currentDiagram,
    createDiagram,
    updateDiagram,
    deleteDiagram,
    selectDiagram,
  } = useDiagrams();

  const [draggedElement, setDraggedElement] = useState<DraggedElement | null>(null);

  const handleDragStart = (elementType: BPMNElement['type'], event: React.DragEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setDraggedElement({
      type: elementType,
      offset: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
    });
  };

  const handleCreateDiagram = (name: string) => {
    createDiagram(name);
  };

  const handleExport = (format: 'mermaid' | 'bpmn') => {
    if (!currentDiagram) return;

    const content = format === 'mermaid' 
      ? exportToMermaid(currentDiagram)
      : exportToBPMN(currentDiagram);

    const blob = new Blob([content], { 
      type: format === 'mermaid' ? 'text/plain' : 'application/xml' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDiagram.name}.${format === 'mermaid' ? 'mmd' : 'bpmn'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (currentDiagram) {
      updateDiagram(currentDiagram);
    }
  };

  // Create a default diagram if none exist
  React.useEffect(() => {
    if (diagrams.length === 0) {
      createDiagram('My First Diagram');
    }
  }, [diagrams.length]);

  return (
    <div className="h-screen flex bg-white font-sans">
      <Sidebar
        diagrams={diagrams}
        currentDiagram={currentDiagram}
        onCreateDiagram={handleCreateDiagram}
        onSelectDiagram={selectDiagram}
        onDeleteDiagram={deleteDiagram}
      />
      
      <div className="flex-1 flex flex-col">
        <Toolbar
          onDragStart={handleDragStart}
          onExport={handleExport}
          onSave={handleSave}
        />
        
        {currentDiagram ? (
          <Canvas
            diagram={currentDiagram}
            onUpdateDiagram={updateDiagram}
            draggedElement={draggedElement}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to BPMN Designer
              </h2>
              <p className="text-gray-600">
                Create your first diagram to get started
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;