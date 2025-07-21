import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Eye, EyeOff, Save } from 'lucide-react';

const SectionOrderManager = ({ sections, onSectionOrderChange, onSectionVisibilityChange, onSave }) => {
  const [orderedSections, setOrderedSections] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Initialize with current sections and add order property if missing
    const sectionsWithOrder = sections.map((section, index) => ({
      ...section,
      order: section.order !== undefined ? section.order : index,
      visible: section.visible !== undefined ? section.visible : true
    }));
    
    // Sort by order
    const sorted = sectionsWithOrder.sort((a, b) => a.order - b.order);
    setOrderedSections(sorted);
  }, [sections]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(orderedSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    setOrderedSections(updatedItems);
    setHasChanges(true);
    
    if (onSectionOrderChange) {
      onSectionOrderChange(updatedItems);
    }
  };

  const toggleVisibility = (sectionId) => {
    const updated = orderedSections.map(section => 
      section.id === sectionId || section.type === sectionId 
        ? { ...section, visible: !section.visible }
        : section
    );
    
    setOrderedSections(updated);
    setHasChanges(true);
    
    if (onSectionVisibilityChange) {
      onSectionVisibilityChange(updated);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(orderedSections);
      setHasChanges(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Section Order & Visibility</h3>
          <p className="text-sm text-gray-500 mt-1">Drag to reorder sections, toggle visibility</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save size={16} />
            Save Order
          </button>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                snapshot.isDraggingOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              {orderedSections.map((section, index) => (
                <Draggable 
                  key={section.id || section.type} 
                  draggableId={section.id || section.type} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-3 p-4 bg-white rounded-lg border transition-all ${
                        snapshot.isDragging 
                          ? 'shadow-lg rotate-2 border-blue-500' 
                          : 'hover:shadow-md border-gray-200'
                      } ${!section.visible ? 'opacity-60' : ''}`}
                    >
                      {/* Drag Handle */}
                      <div
                        {...provided.dragHandleProps}
                        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={20} />
                      </div>

                      {/* Section Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            {section.title || section.name || section.type}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {section.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Order: {index + 1} • {section.visible ? 'Visible' : 'Hidden'}
                        </p>
                      </div>

                      {/* Visibility Toggle */}
                      <button
                        onClick={() => toggleVisibility(section.id || section.type)}
                        className={`p-2 rounded-lg transition-colors ${
                          section.visible 
                            ? 'text-green-600 hover:bg-green-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={section.visible ? 'Hide section' : 'Show section'}
                      >
                        {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {hasChanges && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            You have unsaved changes. Click "Save Order" to apply the new section arrangement.
          </p>
        </div>
      )}
    </div>
  );
};

export default SectionOrderManager;
