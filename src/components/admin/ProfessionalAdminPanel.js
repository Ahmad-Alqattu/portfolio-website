// Professional All-in-One Admin Panel
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { getAllSections, updateSection } from '../../firebase/firestore';
import { mediaManager } from '../../firebase/mediaManager';
import { getUserConfig, updateUserSlug, validateSlug } from '../../firebase/userConfig';
import { uploadJsonToFirebase } from '../../utils/userMigration';

const ProfessionalAdminPanel = () => {
  const { currentUser } = useAuth();
  const { sections: contextSections, useFirestore } = useData();
  const navigate = useNavigate();
  
  // State management
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [expandedSections, setExpandedSections] = useState({ intro: true });
  const [message, setMessage] = useState(null);
  const [userConfig, setUserConfig] = useState(null);
  const [slugInput, setSlugInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    loadData();
    
    // Update media manager with current user
    if (currentUser) {
      mediaManager.updateUser(currentUser.uid);
    }
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load sections
      if (useFirestore && currentUser) {
        const sectionsData = await getAllSections();
        setSections(sectionsData);
      } else {
        setSections(contextSections);
      }

      // Load user config only if user is authenticated
      if (currentUser) {
        const config = await getUserConfig();
        setUserConfig(config);
        setSlugInput(config.customSlug || '');

        // Load media files only if user is authenticated
        try {
          const mediaResult = await mediaManager.getMediaByType();
          if (mediaResult.success) {
            setMediaFiles(mediaResult.mediaData);
          }
        } catch (mediaError) {
          console.log('Media loading skipped - no files or permission issue');
          setMediaFiles({});
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    }
    setLoading(false);
  };

  const handleSectionUpdate = async (sectionId, data) => {
    if (!useFirestore) {
      setMessage({ type: 'warning', text: 'Firebase not connected' });
      return;
    }

    setSaving(true);
    try {
      const result = await updateSection(sectionId, data);
      if (result.success) {
        setSections(prev => prev.map(s => s.id === sectionId ? { ...s, ...data } : s));
        setMessage({ type: 'success', text: 'Section updated successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update section' });
    }
    setSaving(false);
  };

  const handleFileUpload = async (files, category = 'general') => {
    setUploadProgress({ [category]: 0 });
    
    try {
      const result = await mediaManager.uploadMultipleFiles(files, category);
      
      if (result.successful.length > 0) {
        setMessage({ 
          type: 'success', 
          text: `Uploaded ${result.totalUploaded} files successfully` 
        });
        
        // Reload media files
        const mediaResult = await mediaManager.getMediaByType();
        if (mediaResult.success) {
          setMediaFiles(mediaResult.mediaData);
        }
      }
      
      if (result.failed.length > 0) {
        setMessage({ 
          type: 'warning', 
          text: `${result.totalFailed} files failed to upload` 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' });
    }
    
    setUploadProgress({});
  };

  const handleSlugUpdate = async () => {
    const validation = validateSlug(slugInput);
    if (!validation.valid) {
      setMessage({ type: 'error', text: validation.error });
      return;
    }

    try {
      const result = await updateUserSlug(slugInput);
      if (result.success) {
        setUserConfig(prev => ({ ...prev, customSlug: slugInput }));
        setMessage({ type: 'success', text: 'Slug updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update slug' });
    }
  };

  const toggleSectionExpansion = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const renderSidebar = () => (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white">Portfolio Admin</h2>
        <p className="text-gray-400 text-sm mt-1">{currentUser?.email}</p>
      </div>
      
      <nav className="mt-6">
        {[
          { id: 'dashboard', icon: '📊', label: 'Dashboard' },
          { id: 'content', icon: '📝', label: 'Content Editor' },
          { id: 'media', icon: '🖼️', label: 'Media Manager' },
          { id: 'settings', icon: '⚙️', label: 'Settings' },
          { id: 'migration', icon: '📤', label: 'Data Migration' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-800 transition-colors ${
              activeSection === item.id ? 'bg-blue-600 border-r-4 border-blue-400' : ''
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={() => {
            logOut();
            navigate('/login');
          }}
          className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Total Sections</h3>
          <p className="text-3xl font-bold">{sections.length}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Media Files</h3>
          <p className="text-3xl font-bold">
            {Object.values(mediaFiles || {}).reduce((acc, files) => acc + (files?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-purple-500 text-white p-6 rounded-lg">
          <h3 className="text-lg font-semibold">Firebase Status</h3>
          <p className="text-lg font-semibold">{useFirestore ? '✅ Connected' : '❌ Offline'}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4">Portfolio URL</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="your-portfolio-slug"
          />
          <button
            onClick={handleSlugUpdate}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Update Slug
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Your portfolio will be available at: <strong>{window.location.origin}/{slugInput}</strong>
        </p>
      </div>
    </div>
  );

  const renderContentEditor = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Editor</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setExpandedSections(sections.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}))}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Expand All
          </button>
          <button
            onClick={() => setExpandedSections({})}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Collapse All
          </button>
        </div>
      </div>
      
      {sections.map(section => (
        <div key={section.id} className="bg-white rounded-lg shadow border">
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSectionExpansion(section.id)}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">
                {section.type === 'intro' ? '👋' :
                 section.type === 'skills' ? '🛠️' :
                 section.type === 'projects' ? '🚀' :
                 section.type === 'experience' ? '💼' :
                 section.type === 'education' ? '🎓' : '📋'}
              </span>
              <div>
                <h3 className="text-lg font-semibold">{section.title || section.name}</h3>
                <p className="text-sm text-gray-600">{section.type}</p>
              </div>
            </div>
            <span className="text-2xl">
              {expandedSections[section.id] ? '🔽' : '▶️'}
            </span>
          </div>
          
          {expandedSections[section.id] && (
            <div className="p-6 border-t border-gray-200">
              {renderSectionEditor(section)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSectionEditor = (section) => {
    const updateField = (path, value) => {
      const keys = path.split('.');
      const newData = { ...section };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      handleSectionUpdate(section.id, newData);
    };

    return (
      <div className="space-y-4">
        {/* Basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={section.title || section.name || ''}
              onChange={(e) => updateField(section.name ? 'name' : 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          
          {section.data?.subtitle && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              <input
                type="text"
                value={section.data.subtitle || ''}
                onChange={(e) => updateField('data.subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={section.content || ''}
            onChange={(e) => updateField('content', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Section-specific editors */}
        {section.type === 'skills' && renderSkillsEditor(section, updateField)}
        {section.type === 'projects' && renderProjectsEditor(section, updateField)}
        {section.type === 'experience' && renderExperienceEditor(section, updateField)}
        {section.type === 'education' && renderEducationEditor(section, updateField)}
        
        <div className="pt-4 border-t">
          <button
            onClick={() => handleSectionUpdate(section.id, section)}
            disabled={saving}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  const renderSkillsEditor = (section, updateField) => {
    const skills = section.data?.skillsList || {};
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold">Skills Categories</h4>
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h5 className="font-medium">{category}</h5>
              <button
                onClick={() => {
                  const newSkills = { ...skills };
                  delete newSkills[category];
                  updateField('data.skillsList', newSkills);
                }}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remove Category
              </button>
            </div>
            <textarea
              value={skillList.join(', ')}
              onChange={(e) => {
                const newSkillsList = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                updateField(`data.skillsList.${category}`, newSkillsList);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Skill 1, Skill 2, Skill 3..."
            />
          </div>
        ))}
        <button
          onClick={() => {
            const categoryName = prompt('Category name:');
            if (categoryName) {
              updateField(`data.skillsList.${categoryName}`, []);
            }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Category
        </button>
      </div>
    );
  };

  const renderProjectsEditor = (section, updateField) => {
    const projects = section.data?.projects || [];
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold">Projects</h4>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          💡 <strong>Tip:</strong> Use the Media Manager to upload images/videos, then copy the URLs here.
        </div>
        {projects.map((project, index) => (
          <div key={project.id || index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                value={project.name || ''}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index] = { ...project, name: e.target.value };
                  updateField('data.projects', newProjects);
                }}
                placeholder="Project name"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                value={project.id || ''}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index] = { ...project, id: parseInt(e.target.value) };
                  updateField('data.projects', newProjects);
                }}
                placeholder="Project ID"
                className="px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <textarea
              value={project.description || ''}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index] = { ...project, description: e.target.value };
                updateField('data.projects', newProjects);
              }}
              placeholder="Short description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            
            <textarea
              value={project.fullDescription || ''}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index] = { ...project, fullDescription: e.target.value };
                updateField('data.projects', newProjects);
              }}
              placeholder="Full description"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Images (one per line)</label>
                <textarea
                  value={(project.images || []).join('\n')}
                  onChange={(e) => {
                    const newProjects = [...projects];
                    newProjects[index] = { 
                      ...project, 
                      images: e.target.value.split('\n').filter(line => line.trim()) 
                    };
                    updateField('data.projects', newProjects);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Videos (one per line)</label>
                <textarea
                  value={(project.videos || []).join('\n')}
                  onChange={(e) => {
                    const newProjects = [...projects];
                    newProjects[index] = { 
                      ...project, 
                      videos: e.target.value.split('\n').filter(line => line.trim()) 
                    };
                    updateField('data.projects', newProjects);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Links (one per line)</label>
                <textarea
                  value={(project.link || []).join('\n')}
                  onChange={(e) => {
                    const newProjects = [...projects];
                    newProjects[index] = { 
                      ...project, 
                      link: e.target.value.split('\n').filter(line => line.trim()) 
                    };
                    updateField('data.projects', newProjects);
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            
            <button
              onClick={() => {
                const newProjects = projects.filter((_, i) => i !== index);
                updateField('data.projects', newProjects);
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Project
            </button>
          </div>
        ))}
        
        <button
          onClick={() => {
            const newProject = {
              id: Date.now(),
              name: 'New Project',
              description: '',
              fullDescription: '',
              images: [],
              videos: [],
              link: []
            };
            updateField('data.projects', [...projects, newProject]);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Project
        </button>
      </div>
    );
  };

  const renderExperienceEditor = (section, updateField) => {
    const experience = section.experience || [];
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold">Work Experience</h4>
        {experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                value={exp.title || ''}
                onChange={(e) => {
                  const newExp = [...experience];
                  newExp[index] = { ...exp, title: e.target.value };
                  updateField('experience', newExp);
                }}
                placeholder="Job title"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={exp.company || ''}
                onChange={(e) => {
                  const newExp = [...experience];
                  newExp[index] = { ...exp, company: e.target.value };
                  updateField('experience', newExp);
                }}
                placeholder="Company"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                value={exp.period || ''}
                onChange={(e) => {
                  const newExp = [...experience];
                  newExp[index] = { ...exp, period: e.target.value };
                  updateField('experience', newExp);
                }}
                placeholder="Period (e.g., 2020-2023)"
                className="px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <textarea
              value={(exp.responsibilities || []).join('\n')}
              onChange={(e) => {
                const newExp = [...experience];
                newExp[index] = { 
                  ...exp, 
                  responsibilities: e.target.value.split('\n').filter(line => line.trim()) 
                };
                updateField('experience', newExp);
              }}
              placeholder="Responsibilities (one per line)"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            
            <button
              onClick={() => {
                const newExp = experience.filter((_, i) => i !== index);
                updateField('experience', newExp);
              }}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Experience
            </button>
          </div>
        ))}
        
        <button
          onClick={() => {
            const newExp = {
              title: '',
              company: '',
              period: '',
              responsibilities: []
            };
            updateField('experience', [...experience, newExp]);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Experience
        </button>
      </div>
    );
  };

  const renderEducationEditor = (section, updateField) => {
    const education = section.data?.educationList || [];
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold">Education</h4>
        {education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <select
                value={edu.level || ''}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index] = { ...edu, level: e.target.value };
                  updateField('data.educationList', newEdu);
                }}
                className="px-3 py-2 border border-gray-300 rounded"
              >
                <option value="">Select level</option>
                <option value="school">High School</option>
                <option value="university">University</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
              </select>
              
              <input
                type="text"
                value={edu.institution || ''}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index] = { ...edu, institution: e.target.value };
                  updateField('data.educationList', newEdu);
                }}
                placeholder="Institution name"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              
              <input
                type="text"
                value={edu.degree || ''}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index] = { ...edu, degree: e.target.value };
                  updateField('data.educationList', newEdu);
                }}
                placeholder="Degree"
                className="px-3 py-2 border border-gray-300 rounded"
              />
              
              <input
                type="text"
                value={edu.major || ''}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index] = { ...edu, major: e.target.value };
                  updateField('data.educationList', newEdu);
                }}
                placeholder="Major"
                className="px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            
            <input
              type="text"
              value={edu.years || ''}
              onChange={(e) => {
                const newEdu = [...education];
                newEdu[index] = { ...edu, years: e.target.value };
                updateField('data.educationList', newEdu);
              }}
              placeholder="Years (e.g., 2019-2024)"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            
            <textarea
              value={edu.details || ''}
              onChange={(e) => {
                const newEdu = [...education];
                newEdu[index] = { ...edu, details: e.target.value };
                updateField('data.educationList', newEdu);
              }}
              placeholder="Additional details"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            
            {edu.electives && (
              <textarea
                value={(edu.electives || []).join('\n')}
                onChange={(e) => {
                  const newEdu = [...education];
                  newEdu[index] = { 
                    ...edu, 
                    electives: e.target.value.split('\n').filter(line => line.trim()) 
                  };
                  updateField('data.educationList', newEdu);
                }}
                placeholder="Electives (one per line)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
              />
            )}
            
            <button
              onClick={() => {
                const newEdu = education.filter((_, i) => i !== index);
                updateField('data.educationList', newEdu);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Education
            </button>
          </div>
        ))}
        
        <button
          onClick={() => {
            const newEdu = {
              level: '',
              institution: '',
              degree: '',
              major: '',
              years: '',
              details: '',
              electives: []
            };
            updateField('data.educationList', [...education, newEdu]);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Education
        </button>
      </div>
    );
  };

  const renderMediaManager = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Media Manager</h2>
      
      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upload Files</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['images', 'videos', 'documents'].map(category => (
            <div key={category} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="text-4xl mb-2">
                {category === 'images' ? '🖼️' : category === 'videos' ? '🎥' : '📄'}
              </div>
              <h4 className="font-medium mb-2 capitalize">{category}</h4>
              <input
                type="file"
                multiple
                accept={
                  category === 'images' ? 'image/*' :
                  category === 'videos' ? 'video/*' : 
                  '.pdf,.doc,.docx'
                }
                onChange={(e) => handleFileUpload(e.target.files, category)}
                className="hidden"
                id={`upload-${category}`}
              />
              <label
                htmlFor={`upload-${category}`}
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 inline-block"
              >
                Upload {category}
              </label>
              
              {uploadProgress[category] !== undefined && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress[category]}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Media Gallery */}
      {Object.entries(mediaFiles || {}).map(([category, files]) => (
        files && files.length > 0 && (
          <div key={category} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4 capitalize">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  {category === 'images' ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(file.url)}
                    />
                  ) : category === 'videos' ? (
                    <video
                      src={file.url}
                      className="w-full h-24 object-cover rounded cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(file.url)}
                    />
                  ) : (
                    <div 
                      className="w-full h-24 bg-gray-200 rounded flex items-center justify-center cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(file.url)}
                    >
                      📄
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <button
                      onClick={() => navigator.clipboard.writeText(file.url)}
                      className="bg-white text-gray-900 px-2 py-1 rounded text-xs mr-1"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => mediaManager.deleteFile(file.path).then(() => loadData())}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Portfolio Configuration</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Slug</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleSlugUpdate}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme Settings</label>
            <div className="grid grid-cols-2 gap-4">
              <select className="px-3 py-2 border border-gray-300 rounded-lg">
                <option>Light Theme</option>
                <option>Dark Theme</option>
                <option>Auto</option>
              </select>
              <input
                type="color"
                defaultValue="#6366f1"
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMigration = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Data Migration</h2>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Import from JSON</h3>
        <p className="text-gray-600 mb-4">
          Upload your existing portfolio data from JSON file to Firebase.
        </p>
        
        <button
          onClick={async () => {
            setLoading(true);
            try {
              const result = await uploadJsonToFirebase();
              if (result.success) {
                setMessage({ type: 'success', text: 'Data migrated successfully!' });
                loadData();
              } else {
                setMessage({ type: 'error', text: 'Migration failed' });
              }
            } catch (error) {
              setMessage({ type: 'error', text: 'Migration failed' });
            }
            setLoading(false);
          }}
          disabled={loading || !useFirestore}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Migrating...' : 'Start Migration'}
        </button>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'content': return renderContentEditor();
      case 'media': return renderMediaManager();
      case 'settings': return renderSettings();
      case 'migration': return renderMigration();
      default: return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {renderSidebar()}
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            
            {useFirestore ? (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                🟢 Firebase Connected
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                🔴 Offline Mode
              </span>
            )}
          </div>
        </header>
        
        <main className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
              message.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              {message.text}
              <button
                onClick={() => setMessage(null)}
                className="float-right ml-4"
              >
                ×
              </button>
            </div>
          )}
          
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default ProfessionalAdminPanel;
