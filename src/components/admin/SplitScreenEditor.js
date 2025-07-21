// MVP Split-Screen Portfolio Editor with Live Preview
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllSections, updateSection, getSection } from '../../firebase/firestore';
import { mediaManager } from '../../firebase/mediaManager';
import { getUserConfig, updateUserSlug } from '../../firebase/userConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Eye, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  User, 
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  Plus,
  Trash2,
  Copy,
  Check
} from 'lucide-react';

// Import section editors and previews
import { 
  IntroEditor, 
  SkillsEditor, 
  ProjectsEditor, 
  ExperienceEditor, 
  EducationEditor 
} from './SectionEditors';

import { 
  IntroPreview, 
  SkillsPreview, 
  ProjectsPreview, 
  ExperiencePreview, 
  EducationPreview 
} from './SectionPreviews';

const SplitScreenEditor = () => {
  const { currentUser } = useAuth();
  const [activeSection, setActiveSection] = useState('intro');
  const [sections, setSections] = useState({});
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState(null);
  const [userConfig, setUserConfig] = useState(null);

  // Load user data
  useEffect(() => {
    if (currentUser) {
      loadUserData();
      mediaManager.updateUser(currentUser.uid);
    }
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      // Load sections
      const sectionTypes = ['intro', 'skills', 'projects', 'experience', 'education'];
      const sectionsData = {};
      
      for (const type of sectionTypes) {
        const sectionData = await getSection(type, currentUser.uid);
        sectionsData[type] = sectionData || getDefaultSection(type);
      }
      
      setSections(sectionsData);
      
      // Load user config
      const config = await getUserConfig();
      setUserConfig(config);
    } catch (error) {
      console.error('Error loading user data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    }
  };

  const getDefaultSection = (type) => {
    const defaults = {
      intro: {
        id: 'intro',
        type: 'intro',
        data: {
          name: 'Your Name',
          title: 'Your Title',
          subtitle: 'Your Subtitle',
          description: 'Tell the world about yourself...',
          profilePicture: '',
          cvLink: '',
          socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            email: ''
          }
        }
      },
      skills: {
        id: 'skills',
        type: 'skills',
        content: 'My technical skills and expertise',
        data: {
          skillsList: {
            'Frontend': ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS'],
            'Backend': ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
            'Tools': ['Git', 'Docker', 'AWS', 'Firebase']
          }
        }
      },
      projects: {
        id: 'projects',
        type: 'projects',
        content: 'Featured projects and work',
        data: {
          projects: []
        }
      },
      experience: {
        id: 'experience',
        type: 'experience',
        content: 'Professional experience',
        experience: []
      },
      education: {
        id: 'education',
        type: 'education',
        content: 'Educational background',
        data: {
          educationList: []
        }
      }
    };
    return defaults[type] || {};
  };

  const handleSectionUpdate = useCallback(async (sectionType, updatedData) => {
    setSaving(true);
    try {
      const result = await updateSection(sectionType, updatedData, currentUser.uid);
      if (result.success) {
        setSections(prev => ({
          ...prev,
          [sectionType]: updatedData
        }));
        setMessage({ type: 'success', text: 'Saved successfully!' });
        setTimeout(() => setMessage(null), 2000);
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save' });
    }
    setSaving(false);
  }, [currentUser]);

  const handleFileUpload = async (file, sectionType, fieldName) => {
    try {
      setUploadProgress(0);
      const category = file.type.startsWith('image/') ? 'images' : 
                     file.type.startsWith('video/') ? 'videos' : 'documents';
      
      const result = await mediaManager.uploadFile(file, category);
      
      if (result.success) {
        // Update section with new file URL
        const updatedSection = { ...sections[sectionType] };
        if (fieldName.includes('.')) {
          const keys = fieldName.split('.');
          let current = updatedSection;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = result.file.url;
        } else {
          updatedSection[fieldName] = result.file.url;
        }
        
        await handleSectionUpdate(sectionType, updatedSection);
        setMessage({ type: 'success', text: 'File uploaded successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' });
    }
    setUploadProgress(0);
  };

  const renderEditor = () => {
    const section = sections[activeSection];
    if (!section) return null;

    switch (activeSection) {
      case 'intro':
        return <IntroEditor section={section} onUpdate={handleSectionUpdate} onFileUpload={handleFileUpload} />;
      case 'skills':
        return <SkillsEditor section={section} onUpdate={handleSectionUpdate} />;
      case 'projects':
        return <ProjectsEditor section={section} onUpdate={handleSectionUpdate} onFileUpload={handleFileUpload} />;
      case 'experience':
        return <ExperienceEditor section={section} onUpdate={handleSectionUpdate} />;
      case 'education':
        return <EducationEditor section={section} onUpdate={handleSectionUpdate} />;
      default:
        return <div>Select a section to edit</div>;
    }
  };

  const renderPreview = () => {
    const section = sections[activeSection];
    if (!section) return null;

    const deviceClasses = {
      desktop: 'w-full max-w-6xl',
      tablet: 'w-full max-w-2xl',
      mobile: 'w-full max-w-sm'
    };

    return (
      <div className={`mx-auto ${deviceClasses[previewDevice]} transition-all duration-300`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {activeSection === 'intro' && <IntroPreview section={section} />}
          {activeSection === 'skills' && <SkillsPreview section={section} />}
          {activeSection === 'projects' && <ProjectsPreview section={section} />}
          {activeSection === 'experience' && <ExperiencePreview section={section} />}
          {activeSection === 'education' && <EducationPreview section={section} />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Editor</h1>
            <div className="flex items-center space-x-2">
              {saving && <div className="text-sm text-blue-600">Saving...</div>}
              {message && (
                <div className={`text-sm px-3 py-1 rounded ${
                  message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Device Preview Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-2 rounded ${previewDevice === 'desktop' ? 'bg-white shadow' : ''}`}
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-2 rounded ${previewDevice === 'tablet' ? 'bg-white shadow' : ''}`}
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-2 rounded ${previewDevice === 'mobile' ? 'bg-white shadow' : ''}`}
              >
                <Smartphone size={16} />
              </button>
            </div>
            
            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye size={16} />
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Sections</h3>
            <nav className="space-y-2">
              {[
                { id: 'intro', label: 'Introduction', icon: '👋' },
                { id: 'skills', label: 'Skills', icon: '🛠️' },
                { id: 'projects', label: 'Projects', icon: '🚀' },
                { id: 'experience', label: 'Experience', icon: '💼' },
                { id: 'education', label: 'Education', icon: '🎓' }
              ].map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{section.icon}</span>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Editor Panel */}
        <div className={`${showPreview ? 'w-1/2' : 'flex-1'} bg-white border-r border-gray-200 overflow-y-auto`}>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Edit {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h2>
              <p className="text-gray-600">Make changes and see them instantly in the preview</p>
            </div>
            
            {renderEditor()}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 bg-gray-100 overflow-y-auto">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Live Preview</h2>
                <div className="text-sm text-gray-500 capitalize">{previewDevice} View</div>
              </div>
              
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitScreenEditor;
