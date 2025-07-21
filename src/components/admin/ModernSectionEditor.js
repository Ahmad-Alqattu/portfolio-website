// Modern Section Editor with Tailwind CSS
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSection, updateSection } from '../../firebase/firestore';
import { useData } from '../../contexts/DataContext';

const ModernSectionEditor = () => {
  const { sectionType } = useParams();
  const navigate = useNavigate();
  const { sections, useFirestore } = useData();
  
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadSectionData();
  }, [sectionType, sections]);

  const loadSectionData = async () => {
    setLoading(true);
    
    try {
      if (useFirestore) {
        // Load from Firebase
        const section = await getSection(sectionType);
        setSectionData(section);
      } else {
        // Load from context (JSON data)
        const section = sections.find(s => s.type === sectionType || s.id === sectionType);
        setSectionData(section);
      }
    } catch (error) {
      console.error('Error loading section:', error);
      setMessage({ type: 'error', text: 'Failed to load section data' });
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!useFirestore) {
      setMessage({ type: 'warning', text: 'Firebase not connected. Changes cannot be saved.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const result = await updateSection(sectionData.id, sectionData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Section updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update section' });
      }
    } catch (error) {
      console.error('Error saving section:', error);
      setMessage({ type: 'error', text: 'Failed to save changes' });
    }

    setSaving(false);
  };

  const handleFieldChange = (fieldPath, value) => {
    setSectionData(prev => {
      const newData = { ...prev };
      const keys = fieldPath.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const renderEditor = () => {
    if (!sectionData) return null;

    switch (sectionType) {
      case 'intro':
        return renderIntroEditor();
      case 'skills':
        return renderSkillsEditor();
      case 'projects':
        return renderProjectsEditor();
      case 'capabilities':
        return renderCapabilitiesEditor();
      default:
        return renderGenericEditor();
    }
  };

  const renderIntroEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={sectionData.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title
          </label>
          <input
            type="text"
            value={sectionData.data?.subtitle || ''}
            onChange={(e) => handleFieldChange('data.subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Introduction / Bio
        </label>
        <textarea
          value={sectionData.content || ''}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Highlight Text
        </label>
        <input
          type="text"
          value={sectionData.data?.highlight || ''}
          onChange={(e) => handleFieldChange('data.highlight', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>
  );

  const renderSkillsEditor = () => {
    const skillsList = sectionData.data?.skillsList || {};
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Description
          </label>
          <textarea
            value={sectionData.content || ''}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Skills Categories</h3>
          <div className="space-y-4">
            {Object.entries(skillsList).map(([category, skills]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => {
                      const newSkillsList = { ...skillsList };
                      delete newSkillsList[category];
                      newSkillsList[e.target.value] = skills;
                      handleFieldChange('data.skillsList', newSkillsList);
                    }}
                    className="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                  />
                  <button
                    onClick={() => {
                      const newSkillsList = { ...skillsList };
                      delete newSkillsList[category];
                      handleFieldChange('data.skillsList', newSkillsList);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...skills];
                          newSkills[index] = e.target.value;
                          handleFieldChange(`data.skillsList.${category}`, newSkills);
                        }}
                        className="bg-transparent border-none focus:outline-none text-sm"
                      />
                      <button
                        onClick={() => {
                          const newSkills = skills.filter((_, i) => i !== index);
                          handleFieldChange(`data.skillsList.${category}`, newSkills);
                        }}
                        className="ml-2 text-red-600 hover:text-red-800 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newSkills = [...skills, 'New Skill'];
                      handleFieldChange(`data.skillsList.${category}`, newSkills);
                    }}
                    className="bg-indigo-100 text-indigo-600 rounded-full px-3 py-1 text-sm hover:bg-indigo-200"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newSkillsList = { ...skillsList, 'New Category': ['Skill 1'] };
                handleFieldChange('data.skillsList', newSkillsList);
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-indigo-400 hover:text-indigo-600"
            >
              + Add New Category
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGenericEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={sectionData.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <textarea
          value={sectionData.content || ''}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Raw Data (JSON)</h3>
        <textarea
          value={JSON.stringify(sectionData.data || {}, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              handleFieldChange('data', parsed);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          rows={10}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
        />
      </div>
    </div>
  );

  const renderProjectsEditor = () => renderGenericEditor();
  const renderCapabilitiesEditor = () => renderGenericEditor();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!sectionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Section Not Found</h2>
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit {sectionData.title || sectionData.name || sectionType}
              </h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving || !useFirestore}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
            'bg-yellow-50 border border-yellow-200 text-yellow-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Editor Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Section Content</h3>
            <p className="mt-1 text-sm text-gray-600">
              Edit the content for the {sectionType} section
            </p>
          </div>
          
          <div className="px-6 py-6">
            {renderEditor()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSectionEditor;
