// Universal Section Editor - Handles all section types dynamically
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSection, updateSection } from '../../firebase/firestore';
import { useData } from '../../contexts/DataContext';

const UniversalSectionEditor = () => {
  const { sectionType } = useParams();
  const navigate = useNavigate();
  const { sections, useFirestore } = useData();
  
  const [sectionData, setSectionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    loadSectionData();
  }, [sectionType, sections]);

  const loadSectionData = async () => {
    setLoading(true);
    
    try {
      if (useFirestore) {
        const section = await getSection(sectionType);
        setSectionData(section);
      } else {
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

  const updateField = (path, value) => {
    setSectionData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Add item to array (for projects, education, experience, skills)
  const addArrayItem = (path, template) => {
    setSectionData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      if (!current[keys[keys.length - 1]]) {
        current[keys[keys.length - 1]] = [];
      }
      
      current[keys[keys.length - 1]].push(template);
      return newData;
    });
  };

  // Remove item from array
  const removeArrayItem = (path, index) => {
    setSectionData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]].splice(index, 1);
      return newData;
    });
  };

  // Render different editors based on section type
  const renderSectionEditor = () => {
    if (!sectionData) return null;

    switch (sectionType) {
      case 'intro':
        return renderIntroEditor();
      case 'skills':
        return renderSkillsEditor();
      case 'projects':
        return renderProjectsEditor();
      case 'education':
        return renderEducationEditor();
      case 'experience':
        return renderExperienceEditor();
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={sectionData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
          <input
            type="text"
            value={sectionData.data?.subtitle || ''}
            onChange={(e) => updateField('data.subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Introduction Content</label>
        <textarea
          value={sectionData.content || ''}
          onChange={(e) => updateField('content', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Highlight Message</label>
          <input
            type="text"
            value={sectionData.data?.highlight || ''}
            onChange={(e) => updateField('data.highlight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CV Link</label>
          <input
            type="text"
            value={sectionData.data?.cvLink || ''}
            onChange={(e) => updateField('data.cvLink', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderSkillsEditor = () => {
    const skillsList = sectionData.data?.skillsList || {};
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills Overview</label>
          <textarea
            value={sectionData.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Skills Categories</h3>
            <button
              onClick={() => {
                const categoryName = prompt('Enter category name:');
                if (categoryName) {
                  updateField(`data.skillsList.${categoryName}`, []);
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(skillsList).map(([category, skills]) => (
              <div key={category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{category}</h4>
                  <button
                    onClick={() => {
                      const newSkillsList = { ...skillsList };
                      delete newSkillsList[category];
                      updateField('data.skillsList', newSkillsList);
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Category
                  </button>
                </div>
                
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkills = [...skills];
                          newSkills[index] = e.target.value;
                          updateField(`data.skillsList.${category}`, newSkills);
                        }}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => {
                          const newSkills = skills.filter((_, i) => i !== index);
                          updateField(`data.skillsList.${category}`, newSkills);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm px-2"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newSkills = [...skills, 'New Skill'];
                      updateField(`data.skillsList.${category}`, newSkills);
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderProjectsEditor = () => {
    const projects = sectionData.data?.projects || [];
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Projects Overview</label>
          <textarea
            value={sectionData.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Projects</h3>
            <button
              onClick={() => addArrayItem('data.projects', {
                id: Date.now(),
                name: 'New Project',
                description: '',
                fullDescription: '',
                images: [],
                videos: [],
                link: []
              })}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>
          
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={project.id || index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium">Project #{index + 1}</h4>
                  <button
                    onClick={() => removeArrayItem('data.projects', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => updateField(`data.projects.${index}.name`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
                    <input
                      type="number"
                      value={project.id || ''}
                      onChange={(e) => updateField(`data.projects.${index}.id`, parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => updateField(`data.projects.${index}.description`, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                  <textarea
                    value={project.fullDescription || ''}
                    onChange={(e) => updateField(`data.projects.${index}.fullDescription`, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Images (one per line)</label>
                    <textarea
                      value={(project.images || []).join('\n')}
                      onChange={(e) => updateField(`data.projects.${index}.images`, e.target.value.split('\n').filter(line => line.trim()))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Videos (one per line)</label>
                    <textarea
                      value={(project.videos || []).join('\n')}
                      onChange={(e) => updateField(`data.projects.${index}.videos`, e.target.value.split('\n').filter(line => line.trim()))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Links (one per line)</label>
                    <textarea
                      value={(project.link || []).join('\n')}
                      onChange={(e) => updateField(`data.projects.${index}.link`, e.target.value.split('\n').filter(line => line.trim()))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderEducationEditor = () => {
    const educationList = sectionData.data?.educationList || [];
    
    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            <button
              onClick={() => addArrayItem('data.educationList', {
                level: 'university',
                institution: '',
                degree: '',
                major: '',
                years: '',
                logo: '',
                details: '',
                electives: []
              })}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Education
            </button>
          </div>
          
          <div className="space-y-6">
            {educationList.map((edu, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium">Education #{index + 1}</h4>
                  <button
                    onClick={() => removeArrayItem('data.educationList', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      value={edu.level || ''}
                      onChange={(e) => updateField(`data.educationList.${index}.level`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="school">High School</option>
                      <option value="university">University</option>
                      <option value="masters">Masters</option>
                      <option value="phd">PhD</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => updateField(`data.educationList.${index}.institution`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => updateField(`data.educationList.${index}.degree`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                    <input
                      type="text"
                      value={edu.major || ''}
                      onChange={(e) => updateField(`data.educationList.${index}.major`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                    <input
                      type="text"
                      value={edu.years || ''}
                      onChange={(e) => updateField(`data.educationList.${index}.years`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                  <textarea
                    value={edu.details || ''}
                    onChange={(e) => updateField(`data.educationList.${index}.details`, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {edu.electives && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Electives (one per line)</label>
                    <textarea
                      value={(edu.electives || []).join('\n')}
                      onChange={(e) => updateField(`data.educationList.${index}.electives`, e.target.value.split('\n').filter(line => line.trim()))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExperienceEditor = () => {
    const experience = sectionData.experience || [];
    
    return (
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
            <button
              onClick={() => addArrayItem('experience', {
                title: '',
                company: '',
                period: '',
                responsibilities: []
              })}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Experience
            </button>
          </div>
          
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium">Experience #{index + 1}</h4>
                  <button
                    onClick={() => removeArrayItem('experience', index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => updateField(`experience.${index}.title`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => updateField(`experience.${index}.company`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                    <input
                      type="text"
                      value={exp.period || ''}
                      onChange={(e) => updateField(`experience.${index}.period`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                  <textarea
                    value={(exp.responsibilities || []).join('\n')}
                    onChange={(e) => updateField(`experience.${index}.responsibilities`, e.target.value.split('\n').filter(line => line.trim()))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCapabilitiesEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={sectionData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={sectionData.content || ''}
          onChange={(e) => updateField('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderGenericEditor = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Raw JSON Data</label>
        <textarea
          value={JSON.stringify(sectionData, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setSectionData(parsed);
            } catch (error) {
              // Invalid JSON, don't update
            }
          }}
          rows={20}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Edit {sectionData.title || sectionData.name || sectionType}
              </h1>
            </div>
            
            <button
              onClick={handleSave}
              disabled={saving || !useFirestore}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
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
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-yellow-50 border-yellow-200 text-yellow-800'
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
            {renderSectionEditor()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalSectionEditor;
