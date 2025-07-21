import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { mediaManager } from '../../firebase/mediaManager';
import { updateSection } from '../../firebase/firestore';
import { migrateLocalDataToFirebase } from '../../utils/dataMigration';
import '../../utils/debugFirestore'; // Import debug functions for console access
import '../../utils/authDebug'; // Import auth debug functions
import '../../utils/dataInvestigation'; // Import data investigation tools
import '../../utils/firebaseStructureDebug'; // Import Firebase structure debug
import '../../utils/uploadTest'; // Import upload testing tools
import { Upload, Save, Eye, User, Image as ImageIcon, FileText, Link, Download, Plus, Trash2, Edit3, Settings, GripVertical, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react';
import SectionPreview from './SectionPreview';
import FileUpload from './FileUpload';
import SectionOrderManager from './SectionOrderManager';

const UniversalEditor = () => {
  const { currentUser } = useAuth();
  const { sections, useFirestore } = useData();
  const [activeTab, setActiveTab] = useState('manage');
  const [editingData, setEditingData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Get all available sections
  const availableSections = [
    { id: 'manage', name: 'Manage Sections', icon: '⚙️' },
    { id: 'intro', name: 'Profile', icon: '👤' },
    { id: 'skills', name: 'Skills', icon: '⚡' },
    { id: 'projects', name: 'Projects', icon: '🚀' },
    { id: 'capabilities', name: 'Capabilities', icon: '💡' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'footerAndLinks', name: 'Footer & Links', icon: '🔗' }
  ];

  useEffect(() => {
    // Special case for section management
    if (activeTab === 'manage') {
      setEditingData({ sections });
      return;
    }
    
    // Load current section data
    const section = sections.find(s => s.type === activeTab || s.id === activeTab);
    if (section) {
      setEditingData({ ...section });
    } else {
      // Create new section structure
      const defaultData = createDefaultSection(activeTab);
      setEditingData(defaultData);
    }
  }, [sections, activeTab]);

  const createDefaultSection = (sectionType) => {
    const base = {
      id: sectionType,
      type: sectionType,
      title: sectionType.charAt(0).toUpperCase() + sectionType.slice(1),
      content: '',
      data: {}
    };

    switch (sectionType) {
      case 'intro':
        return {
          ...base,
          name: 'Your Name',
          title: 'Introduction',
          content: 'Tell people about yourself...',
          data: {
            subtitle: 'Your Title',
            highlight: 'Your tagline',
            image: '',
            cvLink: ''
          }
        };
      case 'skills':
        return {
          ...base,
          content: 'Overview of my technical skills and expertise',
          data: {
            skillsList: {
              'Front-End': ['React.js', 'HTML5', 'CSS3'],
              'Back-End': ['Node.js', 'Python'],
              'Other': ['Git', 'Docker']
            }
          }
        };
      case 'projects':
        return {
          ...base,
          content: 'Here are some of the projects I have worked on',
          data: {
            projects: [{
              id: 1,
              name: 'Sample Project',
              description: 'Brief project description',
              fullDescription: 'Detailed project description...',
              images: [],
              videos: [],
              link: ['']
            }]
          }
        };
      case 'capabilities':
        return {
          ...base,
          title: 'What Can I Do?',
          content: 'Over the years, I\'ve gained experience across multiple domains, from front-end UI development to back-end services and databases.',
          data: {
            capabilities: [
              'Full-Stack Development',
              'UI/UX Design', 
              'Database Management',
              'API Development'
            ]
          }
        };
      case 'experience':
        return {
          ...base,
          title: 'Experience',
          content: 'My professional experience and work history...',
          data: {
            experiences: [{
              id: 1,
              title: 'Your Job Title',
              company: 'Company Name',
              duration: '2023 - Present',
              description: 'Job description and responsibilities...',
              location: 'City, Country'
            }]
          }
        };
      case 'education':
        return {
          ...base,
          title: 'Education',
          content: 'My educational background and qualifications...',
          data: {
            educations: [{
              id: 1,
              degree: 'Your Degree',
              institution: 'University Name',
              duration: '2019 - 2023',
              description: 'Relevant coursework and achievements...',
              location: 'City, Country'
            }]
          }
        };
      case 'contact':
        return {
          ...base,
          title: 'Contact',
          content: 'How to get in touch with me...',
          data: {
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: ''
          }
        };
      case 'footerAndLinks':
        return {
          ...base,
          title: 'Footer & Links',
          content: 'Footer section containing contact information, social links, and welcome message.',
          data: {
            contactInfo: {
              phone: '+970 0598-682-679',
              email: 'ahmadl.qatu@gmail.com',
              location: 'Ramallah, Palestine'
            },
            socialLinks: {
              github: 'https://github.com/Ahmad-Alqattu',
              linkedin: 'https://www.linkedin.com/in/ahmad-al-qattu-987587201/',
              facebook: 'https://www.facebook.com/ahmadluay.alqatu.5',
              email: 'mailto:ahmadl.qatu@gmail.com'
            },
            welcomeMessage: {
              title: 'Welcome to My Portfolio',
              description: 'Thank you for visiting my personal portfolio website.\nConnect with me on email or drop me a message!'
            },
            cvLink: '/assets/AhmadQattu_resume.pdf',
            copyrightText: 'Ahmad AL-Qatu'
          }
        };
      default:
        return {
          ...base,
          content: `Content for ${sectionType} section...`
        };
    }
  };

  const handleChange = (field, value) => {
    setEditingData(prev => {
      const newData = { ...prev };
      const parts = field.split('.');
      let current = newData;

      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }

      current[parts[parts.length - 1]] = value;
      return newData;
    });
  };

  const handleImageUpload = async (file, targetField = 'data.image') => {
    console.log('🖼️ Starting image upload for field:', targetField, 'File:', file.name);
    setUploading(true);
    try {
      const result = await mediaManager.uploadFile(file, 'images');
      console.log('📤 Upload result:', result);
      
      if (result.success) {
        console.log('✅ Upload successful, setting field:', targetField, 'to:', result.file.url);
        handleChange(targetField, result.file.url);
        setMessage('✅ Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
        return result; // Return result for caller
      } else {
        console.error('❌ Upload failed:', result.error);
        setMessage('❌ Upload failed: ' + result.error);
        return result;
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      setMessage('❌ Upload error: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Always save to default-user collection
      const result = await updateSection(editingData.id || editingData.type, editingData, 'default-user');
      if (result.success) {
        setMessage('✅ Section saved to Firebase successfully!');
        console.log('💾 Section saved:', editingData.type || editingData.id);
      } else {
        setMessage('❌ Firebase save failed: ' + result.error);
        console.error('❌ Save failed:', result.error);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Save error: ' + error.message);
      console.error('❌ Save error:', error);
    }
    setSaving(false);
  };

  const handleMigrateData = async () => {
    setMessage('🔄 Migrating data...');
    try {
      const result = await migrateLocalDataToFirebase();
      if (result.success) {
        setMessage(`✅ Migrated ${result.migrated}/${result.total} sections!`);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage('❌ Migration failed: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Migration error: ' + error.message);
    }
  };

  const previewSection = (sectionId) => {
    // Open the main portfolio and scroll to specific section
    const previewUrl = `/?section=${sectionId}`;
    window.open(previewUrl, '_blank');
  };

  const handleSectionOrderChange = (orderedSections) => {
    // Update sections order in real-time
    console.log('Section order changed:', orderedSections);
  };

  const handleSectionOrderSave = async (orderedSections) => {
    setSaving(true);
    setMessage('');
    
    try {
      // Save each section with updated order
      const promises = orderedSections.map(section => 
        updateSection(section.id || section.type, section)
      );
      
      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      
      if (successful === results.length) {
        setMessage('✅ Section order saved successfully!');
        refreshData();
      } else {
        setMessage(`⚠️ Partially saved: ${successful}/${results.length} sections`);
      }
    } catch (error) {
      setMessage(`❌ Failed to save order: ${error.message}`);
    }
    
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const renderFieldEditor = () => {
    if (!editingData) return null;

    switch (activeTab) {
      case 'manage':
        return <SectionOrderManager sections={sections} onSectionOrderChange={handleSectionOrderChange} onSave={handleSectionOrderSave} />;
      case 'intro':
        return <IntroEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'skills':
        return <SkillsEditor data={editingData} onChange={handleChange} />;
      case 'projects':
        return <ProjectsEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'capabilities':
        return <CapabilitiesEditor data={editingData} onChange={handleChange} />;
      case 'experience':
        return <ExperienceEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'education':
        return <EducationEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} />;
      case 'footerAndLinks':
        return <FooterAndLinksEditor data={editingData} onChange={handleChange} />;
      default:
        return <BasicEditor data={editingData} onChange={handleChange} />;
    }
  };

  if (!editingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Editor</h1>
              <p className="text-gray-600">Edit all sections of your portfolio</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleMigrateData}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                <Download size={16} />
                Import JSON
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  showPreview 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {showPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                {showPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye size={16} />
                Full Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {availableSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveTab(section.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === section.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{section.icon}</span>
                {section.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            {message}
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {showPreview ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editor</h3>
              {renderFieldEditor()}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
              <SectionPreview sectionType={activeTab} sectionData={editingData} />
            </div>
          </div>
        ) : (
          <div>
            {renderFieldEditor()}
          </div>
        )}
      </div>
    </div>
  );
};

// Intro Section Editor
const IntroEditor = ({ data, onChange, onImageUpload, uploading }) => {
  const handleImageUpload = async (file) => {
    if (onImageUpload) {
      const result = await onImageUpload(file, 'profile');
      if (result?.success) {
        onChange('data.image', result.file.url);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <FileUpload
            onFileUpload={handleImageUpload}
            uploading={uploading}
            accept="image/*"
            maxSizeKB={2048}
            allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
            currentFile={data.data?.image}
            label="Upload Profile Picture"
            preview={true}
          />
          
          <input
            type="url"
            value={data.data?.image || ''}
            onChange={(e) => onChange('data.image', e.target.value)}
            placeholder="Or paste image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Basic Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
          <input
            type="text"
            value={data.data?.subtitle || ''}
            onChange={(e) => onChange('data.subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
          <input
            type="text"
            value={data.data?.highlight || ''}
            onChange={(e) => onChange('data.highlight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CV/Resume</label>
          <div className="space-y-3">
            {/* File Upload */}
            <div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const result = await onImageUpload(file, 'data.cvLink');
                    if (result?.success) {
                      onChange('data.cvLink', result.file.url);
                    }
                  }
                }}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 border border-blue-300"
              >
                <FileText size={16} />
                {uploading ? 'Uploading CV...' : 'Upload CV/Resume'}
              </label>
            </div>
            
            {/* URL Option */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Or paste CV URL:</label>
              <input
                type="url"
                value={data.data?.cvLink || ''}
                onChange={(e) => onChange('data.cvLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
            
            {/* Show current CV */}
            {data.data?.cvLink && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <FileText size={14} />
                <a 
                  href={data.data.cvLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-green-800"
                >
                  View Current CV
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">About Me</label>
      <textarea
        value={data.content || ''}
        onChange={(e) => onChange('content', e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tell people about yourself..."
      />
    </div>
  </div>
  );
};

// Skills Section Editor
const SkillsEditor = ({ data, onChange }) => {
  const skillCategories = data.data?.skillsList || {};
  
  const addSkillCategory = () => {
    const categoryName = prompt('Category name:');
    if (categoryName) {
      onChange(`data.skillsList.${categoryName}`, []);
    }
  };
  
  const addSkill = (category) => {
    const skill = prompt(`Add skill to ${category}:`);
    if (skill) {
      const currentSkills = skillCategories[category] || [];
      onChange(`data.skillsList.${category}`, [...currentSkills, skill]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Skills</h3>
        <button
          onClick={addSkillCategory}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your skills..."
        />
      </div>
      
      <div className="space-y-6">
        {Object.entries(skillCategories).map(([category, skills]) => (
          <div key={category} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-900">{category}</h4>
              <button
                onClick={() => addSkill(category)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => {
                      const newSkills = skills.filter((_, i) => i !== idx);
                      onChange(`data.skillsList.${category}`, newSkills);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Projects Section Editor
const ProjectsEditor = ({ data, onChange, onImageUpload, uploading }) => {
  const projects = data.data?.projects || [];
  const [expandedProject, setExpandedProject] = useState(0);
  
  // Color scheme for projects
  const projectColors = [
    'bg-blue-50 border-blue-200',
    'bg-green-50 border-green-200', 
    'bg-purple-50 border-purple-200',
    'bg-orange-50 border-orange-200',
    'bg-pink-50 border-pink-200',
    'bg-indigo-50 border-indigo-200'
  ];
  
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: 'New Project',
      description: '',
      fullDescription: '',
      images: [],
      videos: [],
      link: ['', ''], // Two link fields
      active: true // Add active state
    };
    onChange('data.projects', [...projects, newProject]);
  };

  const removeProject = (idx) => {
    const newProjects = projects.filter((_, i) => i !== idx);
    onChange('data.projects', newProjects);
  };

  const toggleProjectActive = (idx) => {
    const updatedProjects = projects.map((project, i) => 
      i === idx ? { ...project, active: !project.active } : project
    );
    onChange('data.projects', updatedProjects);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange('data.projects', items);
  };

  const handleImageUpload = async (file, projectIdx) => {
    try {
      const result = await onImageUpload(file, 'projects');
      if (result?.success) {
        const currentImages = projects[projectIdx]?.images || [];
        onChange(`data.projects.${projectIdx}.images`, [...currentImages, result.file.url]);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Projects</h3>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your projects section..."
        />
      </div>
      
      <div className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {projects.map((project, idx) => (
                  <Draggable key={project.id} draggableId={String(project.id)} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg overflow-hidden ${projectColors[idx % projectColors.length]} ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        {/* Project Header - Always Visible */}
                        <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-opacity-80 transition-colors">
                          <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} className="text-gray-400" />
                            </div>
                            
                            <div 
                              className={`transform transition-transform ${expandedProject === idx ? 'rotate-90' : ''}`}
                              onClick={() => setExpandedProject(expandedProject === idx ? -1 : idx)}
                            >
                              ▶
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${idx % 6 === 0 ? 'bg-blue-500' : idx % 6 === 1 ? 'bg-green-500' : idx % 6 === 2 ? 'bg-purple-500' : idx % 6 === 3 ? 'bg-orange-500' : idx % 6 === 4 ? 'bg-pink-500' : 'bg-indigo-500'}`}></div>
                              <div>
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  {project.name || `Project #${idx + 1}`}
                                  {/* Active/Inactive Toggle */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleProjectActive(idx);
                                    }}
                                    className={`text-sm px-2 py-1 rounded-full ${
                                      project.active !== false 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {project.active !== false ? '✓ Active' : '✗ Inactive'}
                                  </button>
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {project.description || 'No description'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProject(idx);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
            
            {/* Project Details - Collapsible */}
            {expandedProject === idx && (
              <div className="p-4 border-t bg-white space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => onChange(`data.projects.${idx}.name`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter project name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                    <input
                      type="text"
                      value={project.description || ''}
                      onChange={(e) => onChange(`data.projects.${idx}.description`, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description"
                    />
                  </div>
                </div>

                {/* Project Links - Two separate boxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🔗 Primary Link (GitHub/Demo)
                    </label>
                    <input
                      type="url"
                      value={project.link?.[0] || ''}
                      onChange={(e) => {
                        const newLinks = [...(project.link || ['', ''])];
                        newLinks[0] = e.target.value;
                        onChange(`data.projects.${idx}.link`, newLinks);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/username/project"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🌐 Secondary Link (Live Demo/Docs)
                    </label>
                    <input
                      type="url"
                      value={project.link?.[1] || ''}
                      onChange={(e) => {
                        const newLinks = [...(project.link || ['', ''])];
                        newLinks[1] = e.target.value;
                        onChange(`data.projects.${idx}.link`, newLinks);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://project-demo.com"
                    />
                  </div>
                </div>
                
                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                  <textarea
                    value={project.fullDescription || ''}
                    onChange={(e) => onChange(`data.projects.${idx}.fullDescription`, e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed project description, technologies used, challenges faced..."
                  />
                </div>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files).forEach(file => {
                            handleImageUpload(file, idx);
                          });
                        }}
                        className="hidden"
                        id={`project-images-${idx}`}
                      />
                      <label
                        htmlFor={`project-images-${idx}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg cursor-pointer hover:bg-green-200 border border-green-300"
                      >
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP up to 5MB each</p>
                    </div>
                    
                    {/* Image Preview Grid */}
                    {project.images?.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        {project.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative group">
                            <img 
                              src={img.startsWith('http') ? img : `/${img}`} 
                              alt={`${project.name} image ${imgIdx + 1}`}
                              className="w-full h-20 object-cover rounded border shadow-sm"
                            />
                            <button
                              onClick={() => {
                                const newImages = project.images.filter((_, i) => i !== imgIdx);
                                onChange(`data.projects.${idx}.images`, newImages);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

// Capabilities Section Editor
const CapabilitiesEditor = ({ data, onChange }) => {
  const capabilities = data.data?.capabilities || [];
  
  const addCapability = () => {
    const newCapability = {
      title: 'New Capability',
      description: 'Describe this capability...'
    };
    onChange('data.capabilities', [...capabilities, newCapability]);
  };

  const updateCapability = (index, field, value) => {
    const updatedCapabilities = [...capabilities];
    
    // Handle both string and object formats
    if (typeof updatedCapabilities[index] === 'string') {
      // Convert string to object
      updatedCapabilities[index] = {
        title: updatedCapabilities[index],
        description: 'Professional capability in this area.'
      };
    }
    
    updatedCapabilities[index][field] = value;
    onChange('data.capabilities', updatedCapabilities);
  };

  const removeCapability = (index) => {
    const updatedCapabilities = capabilities.filter((_, i) => i !== index);
    onChange('data.capabilities', updatedCapabilities);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Capabilities</h3>
        <button
          onClick={addCapability}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Capability
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe what you can do..."
        />
      </div>
      
      <div className="space-y-4">
        {capabilities.map((capability, idx) => {
          // Handle both string and object formats
          const capabilityObj = typeof capability === 'string' 
            ? { title: capability, description: '' }
            : capability;
            
          return (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Capability #{idx + 1}</h4>
                <button
                  onClick={() => removeCapability(idx)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Capability Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={capabilityObj.title || ''}
                    onChange={(e) => updateCapability(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Capability title..."
                  />
                </div>
                
                {/* Capability Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={capabilityObj.description || ''}
                    onChange={(e) => updateCapability(idx, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe this capability in detail..."
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Experience Section Editor
const ExperienceEditor = ({ data, onChange, onImageUpload, uploading }) => {
  const experiences = data.data?.experiences || [];
  
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: 'Job Title',
      company: 'Company Name',
      duration: '2023 - Present',
      description: 'Job description and responsibilities...',
      location: 'City, Country',
      logo: '', // Changed from image to logo
      active: true,
      order: experiences.length + 1
    };
    onChange('data.experiences', [...experiences, newExperience]);
  };

  const toggleExperienceActive = (idx) => {
    const updatedExperiences = experiences.map((experience, i) => 
      i === idx ? { ...experience, active: !experience.active } : experience
    );
    onChange('data.experiences', updatedExperiences);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order properties
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onChange('data.experiences', reorderedItems);
  };

  const handleImageUpload = async (file, expIdx) => {
    try {
      const result = await onImageUpload(file, 'experience');
      if (result?.success) {
        onChange(`data.experiences.${expIdx}.logo`, result.file.url); // Changed from .image to .logo
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your professional experience..."
        />
      </div>
      
      <div className="space-y-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="experiences">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {experiences.map((exp, idx) => (
                  <Draggable key={exp.id || `exp-${idx}`} draggableId={String(exp.id || `exp-${idx}`)} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg p-4 bg-gray-50 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} className="text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              Experience #{idx + 1}
                              {/* Active/Inactive Toggle */}
                              <button
                                onClick={() => toggleExperienceActive(idx)}
                                className={`text-sm px-2 py-1 rounded-full ${
                                  exp.active !== false 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {exp.active !== false ? '✓ Active' : '✗ Inactive'}
                              </button>
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              const newExperiences = experiences.filter((_, i) => i !== idx);
                              onChange('data.experiences', newExperiences);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
            
            {/* Company Image */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo (Optional)</label>
              <div className="flex items-center gap-4">
                {/* Company Logo Display - Changed from .image to .logo */}
                {exp.logo && (
                  <img
                    src={exp.logo.startsWith('http') ? exp.logo : `/${exp.logo}`}
                    alt="Company logo"
                    className="w-16 h-16 object-contain rounded border"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file, idx);
                    }}
                    className="hidden"
                    id={`exp-image-${idx}`}
                  />
                  <label
                    htmlFor={`exp-image-${idx}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => onChange(`data.experiences.${idx}.title`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => onChange(`data.experiences.${idx}.company`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={exp.duration || ''}
                  onChange={(e) => onChange(`data.experiences.${idx}.duration`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2023 - Present"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => onChange(`data.experiences.${idx}.location`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={exp.description || ''}
                onChange={(e) => onChange(`data.experiences.${idx}.description`, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Job responsibilities and achievements..."
              />
            </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

// Education Section Editor
const EducationEditor = ({ data, onChange, onImageUpload, uploading }) => {
  const educations = data.data?.educations || [];
  
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: 'Your Degree',
      institution: 'University Name',
      duration: '2019 - 2023',
      description: 'Relevant coursework and achievements...',
      location: 'City, Country',
      logo: '', // Changed from image to logo
      active: true,
      order: educations.length + 1
    };
    onChange('data.educations', [...educations, newEducation]);
  };

  const toggleEducationActive = (idx) => {
    const updatedEducations = educations.map((education, i) => 
      i === idx ? { ...education, active: !education.active } : education
    );
    onChange('data.educations', updatedEducations);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(educations);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order properties
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onChange('data.educations', reorderedItems);
  };

  const handleImageUpload = async (file, eduIdx) => {
    try {
      const result = await onImageUpload(file, 'education');
      if (result?.success) {
        onChange(`data.educations.${eduIdx}.logo`, result.file.url); // Changed from .image to .logo
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your educational background..."
        />
      </div>
      
      <div className="space-y-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="educations">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                {educations.map((edu, idx) => (
                  <Draggable key={edu.id || `edu-${idx}`} draggableId={String(edu.id || `edu-${idx}`)} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg p-4 bg-gray-50 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} className="text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              Education #{idx + 1}
                              {/* Active/Inactive Toggle */}
                              <button
                                onClick={() => toggleEducationActive(idx)}
                                className={`text-sm px-2 py-1 rounded-full ${
                                  edu.active !== false 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {edu.active !== false ? '✓ Active' : '✗ Inactive'}
                              </button>
                            </h4>
                          </div>
                          <button
                            onClick={() => {
                              const newEducations = educations.filter((_, i) => i !== idx);
                              onChange('data.educations', newEducations);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
            
            {/* Institution Logo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution Logo (Optional)</label>
              <div className="flex items-center gap-4">
                {/* Institution Logo Display - Changed from .image to .logo */}
                {edu.logo && (
                  <img
                    src={edu.logo.startsWith('http') ? edu.logo : `/${edu.logo}`}
                    alt="Institution logo"
                    className="w-16 h-16 object-contain rounded border"
                  />
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleImageUpload(file, idx);
                    }}
                    className="hidden"
                    id={`edu-image-${idx}`}
                  />
                  <label
                    htmlFor={`edu-image-${idx}`}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    <Upload size={14} />
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => onChange(`data.educations.${idx}.degree`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => onChange(`data.educations.${idx}.institution`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="University Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={edu.duration || ''}
                  onChange={(e) => onChange(`data.educations.${idx}.duration`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2019 - 2023"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={edu.location || ''}
                  onChange={(e) => onChange(`data.educations.${idx}.location`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={edu.description || ''}
                onChange={(e) => onChange(`data.educations.${idx}.description`, e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Relevant coursework, achievements, GPA..."
              />
            </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

// Basic Editor for other sections
const BasicEditor = ({ data, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-6">{data.title}</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={data.title || ''}
          onChange={(e) => onChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={data.content || ''}
          onChange={(e) => onChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter content for this section..."
        />
      </div>
    </div>
  </div>
);

// Footer and Links Editor
const FooterAndLinksEditor = ({ data, onChange }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-6">Footer & Links</h3>
    
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Welcome Message</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={data.data?.welcomeMessage?.title || ''}
              onChange={(e) => onChange('data.welcomeMessage.title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Welcome to My Portfolio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={data.data?.welcomeMessage?.description || ''}
              onChange={(e) => onChange('data.welcomeMessage.description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Thank you for visiting..."
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📞 Phone</label>
            <input
              type="tel"
              value={data.data?.contactInfo?.phone || ''}
              onChange={(e) => onChange('data.contactInfo.phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+970 0598-682-679"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📧 Email</label>
            <input
              type="email"
              value={data.data?.contactInfo?.email || ''}
              onChange={(e) => onChange('data.contactInfo.email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ahmadl.qatu@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📍 Location</label>
            <input
              type="text"
              value={data.data?.contactInfo?.location || ''}
              onChange={(e) => onChange('data.contactInfo.location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ramallah, Palestine"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Social Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🐙 GitHub</label>
            <input
              type="url"
              value={data.data?.socialLinks?.github || ''}
              onChange={(e) => onChange('data.socialLinks.github', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://github.com/Ahmad-Alqattu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">💼 LinkedIn</label>
            <input
              type="url"
              value={data.data?.socialLinks?.linkedin || ''}
              onChange={(e) => onChange('data.socialLinks.linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.linkedin.com/in/ahmad-al-qattu-987587201/"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📘 Facebook</label>
            <input
              type="url"
              value={data.data?.socialLinks?.facebook || ''}
              onChange={(e) => onChange('data.socialLinks.facebook', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.facebook.com/ahmadluay.alqatu.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📧 Email Link</label>
            <input
              type="text"
              value={data.data?.socialLinks?.email || ''}
              onChange={(e) => onChange('data.socialLinks.email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="mailto:ahmadl.qatu@gmail.com"
            />
          </div>
        </div>
      </div>

      {/* Other Links */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Additional Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📄 CV/Resume Link</label>
            <input
              type="text"
              value={data.data?.cvLink || ''}
              onChange={(e) => onChange('data.cvLink', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="/assets/AhmadQattu_resume.pdf"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">© Copyright Text</label>
            <input
              type="text"
              value={data.data?.copyrightText || ''}
              onChange={(e) => onChange('data.copyrightText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ahmad AL-Qatu"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UniversalEditor;
