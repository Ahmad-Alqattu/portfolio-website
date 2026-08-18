import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { mediaManager } from '../../firebase/mediaManager';
import { updateSection } from '../../firebase/firestore';
import { migrateLocalDataToFirebase } from '../../utils/dataMigration';
import { Upload, Save, Eye, User, Image as ImageIcon, FileText, Link, Download, Plus, Trash2, Edit3, Settings, GripVertical, EyeOff, ToggleLeft, ToggleRight, FolderOpen } from 'lucide-react';
import SectionPreview from './SectionPreview';
import FileUpload from './FileUpload';
import SectionOrderManager from './SectionOrderManager';
import StorageBrowser from './StorageBrowser';
import { translateObjectDeep } from '../../utils/autoTranslate';
import { Languages } from 'lucide-react';
import { localize } from '../../utils/localize';

// Bilingual field helpers: a text field may be a plain string (English-only,
// legacy/simple case) or a { en, ar } object once an Arabic translation is
// added. These keep both shapes working through the same dot-path onChange.
const getPath = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

const getLocalizedFieldValue = (data, path, lang) => {
  const raw = getPath(data, path);
  if (raw == null) return '';
  if (typeof raw === 'string') return lang === 'en' ? raw : '';
  if (typeof raw === 'object') return raw[lang] || '';
  return '';
};

const setLocalizedFieldValue = (onChange, data, path, lang, newText) => {
  const raw = getPath(data, path);
  if (lang === 'en') {
    if (raw && typeof raw === 'object') {
      onChange(path, { ...raw, en: newText });
    } else {
      onChange(path, newText);
    }
    return;
  }
  const enValue = typeof raw === 'string' ? raw : (raw?.en || '');
  onChange(path, { en: enValue, ar: newText });
};

const UniversalEditor = () => {
  const { currentUser } = useAuth();
  const { sections, useFirestore, refreshData } = useData();
  const [activeTab, setActiveTab] = useState('manage');
  const [editLanguage, setEditLanguage] = useState('en');
  const [editingData, setEditingData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [storageBrowserOpen, setStorageBrowserOpen] = useState(false);
  const [storageBrowserCallback, setStorageBrowserCallback] = useState(null);
  const [storageBrowserFileType, setStorageBrowserFileType] = useState('all');
  const [storageBrowserMultiSelect, setStorageBrowserMultiSelect] = useState(false);

  // Get all available sections
  const availableSections = [
    { id: 'manage', name: 'Manage Sections', icon: '⚙️' },
    { id: 'intro', name: 'Profile', icon: '👤' },
    { id: 'skills', name: 'Skills', icon: '⚡' },
    { id: 'projects', name: 'Projects', icon: '🚀' },
    { id: 'capabilities', name: 'Capabilities', icon: '💡' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'certificates', name: 'Certificates', icon: '📜' },
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
            educationList: [{
              id: 1,
              degree: 'Your Degree',
              institution: 'University Name',
              duration: '2019 - 2023',
              description: 'Relevant coursework and achievements...',
              location: 'City, Country'
            }]
          }
        };
      case 'certificates':
        return {
          ...base,
          title: 'Certificates',
          content: 'My professional certifications and achievements...',
          data: {
            certificates: [{
              id: 1,
              name: 'Certificate Name',
              issuer: 'Issuing Organization',
              issueDate: '2023',
              description: 'Description of the certificate...',
              image: '',
              pdf: '',
              link: '', // Optional verification link
              active: true
            }]
          }
        };
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

  const [translating, setTranslating] = useState(false);

  const handleAutoTranslate = async (targetLang) => {
    if (!editingData || activeTab === 'manage') return;
    const sourceLang = targetLang === 'ar' ? 'en' : 'ar';
    setTranslating(true);
    setMessage(`🌐 Translating to ${targetLang === 'ar' ? 'Arabic' : 'English'}...`);
    try {
      const translated = await translateObjectDeep(editingData, sourceLang, targetLang);
      setEditingData(translated);
      setMessage('✅ Translated! Review the text, then click Save.');
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error('Auto-translate failed:', error);
      setMessage('❌ Translation failed: ' + error.message);
    } finally {
      setTranslating(false);
    }
  };

  const handleImageUpload = async (file, targetField = 'data.image') => {
    setUploading(true);
    try {
      const result = await mediaManager.uploadFile(file, 'images');
      
      if (result.success) {
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

  const handleBackupData = () => {
    try {
      // Create backup file with current Firebase data
      const backupData = {
        timestamp: new Date().toISOString(),
        sections: sections
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage('✅ Backup downloaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Backup failed: ' + error.message);
      console.error('❌ Backup error:', error);
    }
  };

  const openStorageBrowser = (callback, fileType = 'all', multiSelect = false) => {
    setStorageBrowserCallback(() => callback);
    setStorageBrowserFileType(fileType);
    setStorageBrowserMultiSelect(multiSelect);
    setStorageBrowserOpen(true);
  };

  const handleStorageSelect = (url, fileInfo) => {
    if (storageBrowserCallback) {
      storageBrowserCallback(url, fileInfo);
    }
    setStorageBrowserOpen(false);
    setStorageBrowserCallback(null);
  };

  const handleMigrateData = async () => {
    // Confirm before migrating to prevent accidental overwrites
    const confirmed = window.confirm(
      '⚠️ WARNING: This will OVERWRITE all your current Firebase data with data from sectionsData.json!\n\n' +
      '✅ Recommendation: Download a backup first!\n\n' +
      'Do you want to continue?'
    );

    if (!confirmed) {
      setMessage('Migration cancelled');
      setTimeout(() => setMessage(''), 2000);
      return;
    }

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
        return <IntroEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} onBrowseStorage={openStorageBrowser} editLanguage={editLanguage} />;
      case 'skills':
        return <SkillsEditor data={editingData} onChange={handleChange} editLanguage={editLanguage} />;
      case 'projects':
        return <ProjectsEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} onBrowseStorage={openStorageBrowser} editLanguage={editLanguage} />;
      case 'capabilities':
        return <CapabilitiesEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} onBrowseStorage={openStorageBrowser} editLanguage={editLanguage} />;
      case 'experience':
        return <ExperienceEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} onBrowseStorage={openStorageBrowser} editLanguage={editLanguage} />;
      case 'education':
        return <EducationEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} onBrowseStorage={openStorageBrowser} editLanguage={editLanguage} />;
      case 'certificates':
        return <CertificatesEditor data={editingData} onChange={handleChange} onImageUpload={handleImageUpload} uploading={uploading} onBrowseStorage={openStorageBrowser} editLanguage={editLanguage} />;
      case 'footerAndLinks':
        return <FooterAndLinksEditor data={editingData} onChange={handleChange} editLanguage={editLanguage} />;
      default:
        return <BasicEditor data={editingData} onChange={handleChange} editLanguage={editLanguage} />;
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
      <div className="bg-white shadow-xs border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Portfolio Editor</h1>
              <p className="text-gray-600">Edit all sections of your portfolio</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto mt-4 md:mt-0">
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setEditLanguage('en')}
                  className={`px-3 py-1 text-sm rounded-md ${editLanguage === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setEditLanguage('ar')}
                  className={`px-3 py-1 text-sm rounded-md ${editLanguage === 'ar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  AR
                </button>
              </div>
              {activeTab !== 'manage' && (
                <button
                  onClick={() => handleAutoTranslate(editLanguage === 'ar' ? 'ar' : 'en')}
                  disabled={translating}
                  title="Auto-translate this section's text from the other language (free, machine translation — review before saving)"
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 disabled:opacity-50 w-full md:w-auto"
                >
                  <Languages size={16} />
                  {translating ? 'Translating...' : `Auto-translate to ${editLanguage === 'ar' ? 'Arabic' : 'English'}`}
                </button>
              )}
              <button
                onClick={handleBackupData}
                className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-300 rounded-lg hover:bg-green-50 w-full md:w-auto"
                title="Download backup of current Firebase data"
              >
                <Download size={16} />
                Backup Data
              </button>
              <button
                onClick={handleMigrateData}
                className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 w-full md:w-auto"
                title="⚠️ WARNING: Overwrites Firebase with JSON file!"
              >
                <FileText size={16} />
                Import JSON
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full md:w-auto ${
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
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 w-full md:w-auto"
              >
                <Eye size={16} />
                Full Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 w-full md:w-auto"
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
                {localize(section.name, 'en')}
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

      {/* Storage Browser Dialog */}
      <StorageBrowser
        isOpen={storageBrowserOpen}
        onClose={() => setStorageBrowserOpen(false)}
        onSelect={handleStorageSelect}
        fileType={storageBrowserFileType}
        multiSelect={storageBrowserMultiSelect}
      />
    </div>
  );
};

// Intro Section Editor
const IntroEditor = ({ data, onChange, onImageUpload, uploading, onBrowseStorage, editLanguage = 'en' }) => {
  const handleImageUpload = async (file) => {
    if (onImageUpload) {
      const result = await onImageUpload(file, 'profile');
      if (result?.success) {
        onChange('data.image', result.file.url);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border p-6">
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

          <button
            onClick={() => onBrowseStorage && onBrowseStorage((url) => onChange('data.image', url), 'image')}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <FolderOpen size={16} />
            Browse Storage
          </button>

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
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name {editLanguage === 'ar' && '(العربية)'}</label>
            <input
              type="text"
              dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
              value={getLocalizedFieldValue(data, 'name', editLanguage)}
            onChange={(e) => setLocalizedFieldValue(onChange, data, 'name', editLanguage, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title {editLanguage === 'ar' && '(العربية)'}</label>
          <input
            type="text"
            dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
            value={getLocalizedFieldValue(data.data, 'subtitle', editLanguage)}
            onChange={(e) => setLocalizedFieldValue((path, value) => onChange(`data.${path}`, value), data.data, 'subtitle', editLanguage, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline {editLanguage === 'ar' && '(العربية)'}</label>
          <input
            type="text"
            dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
            value={getLocalizedFieldValue(data.data, 'highlight', editLanguage)}
            onChange={(e) => setLocalizedFieldValue((path, value) => onChange(`data.${path}`, value), data.data, 'highlight', editLanguage, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={data.data?.available !== false}
              onChange={(e) => onChange('data.available', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show &quot;Available for work&quot; badge on photo
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CV/Resume</label>
          <div className="space-y-3">
            {/* File Upload */}
            <div className="flex gap-2">
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
              <button
                type="button"
                onClick={() => onBrowseStorage && onBrowseStorage((url) => onChange('data.cvLink', url), 'document')}
                className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                <FolderOpen size={16} />
                Browse Storage
              </button>
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
      <label className="block text-sm font-medium text-gray-700 mb-2">About Me {editLanguage === 'ar' && '(العربية)'}</label>
      <textarea
        dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
        value={getLocalizedFieldValue(data, 'content', editLanguage)}
        onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Tell people about yourself..."
      />
    </div>
  </div>
  );
};

// Skills Section Editor
const SkillsEditor = ({ data, onChange, editLanguage = 'en' }) => {
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
    <div className="bg-white rounded-lg shadow-xs border p-6">
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
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
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
                  {localize(skill, editLanguage)}
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
const ProjectsEditor = ({ data, onChange, onImageUpload, uploading, onBrowseStorage, editLanguage = 'en' }) => {
  const projects = data.data?.projects || [];
  const [expandedProject, setExpandedProject] = useState(0);
  
  // Initialize order values for projects that don't have them
  useEffect(() => {
    const needsOrder = projects.some(project => project.order === undefined);
    if (needsOrder) {
      const projectsWithOrder = projects.map((project, index) => ({
        ...project,
        order: project.order !== undefined ? project.order : index + 1
      }));
      onChange('data.projects', projectsWithOrder);
    }
  }, []); // Only run once when component mounts
  
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
      active: true, // Add active state
      order: projects.length + 1 // Add order based on current position
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

    // Add order property to each project based on its new position
    const itemsWithOrder = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onChange('data.projects', itemsWithOrder);
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

  const handleVideoUpload = async (file, projectIdx) => {
    try {
      const result = await onImageUpload(file, 'projects');
      if (result?.success) {
        const currentVideos = projects[projectIdx]?.videos || [];
        onChange(`data.projects.${projectIdx}.videos`, [...currentVideos, result.file.url]);
      }
    } catch (error) {
      console.error('Video upload failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border p-6">
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
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
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
                                  {localize(project.name, 'en') || `Project #${idx + 1}`}
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
                                  {localize(project.description, 'en') || 'No description'}
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
                    <div className="flex gap-2">
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
                      <button
                        type="button"
                        onClick={() => onBrowseStorage && onBrowseStorage((urls) => {
                          const currentImages = projects[idx]?.images || [];
                          // urls can be an array (multi-select) or single string
                          const newUrls = Array.isArray(urls) ? urls : [urls];
                          onChange(`data.projects.${idx}.images`, [...currentImages, ...newUrls]);
                        }, 'image', true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                      >
                        <FolderOpen size={16} />
                        Browse Storage
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">JPG, PNG, WebP up to 5MB each</p>
                    
                    {/* Image Preview Grid */}
                    {project.images?.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        {project.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="relative group">
                            <img 
                              src={img.startsWith('http') ? img : `/${img}`} 
                              alt={`${project.name} image ${imgIdx + 1}`}
                              className="w-full h-20 object-cover rounded-sm border shadow-xs"
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
                
                {/* Video Upload and Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Videos</label>
                  <div className="space-y-3">
                    {/* Upload Button */}
                    <div className="flex gap-2 flex-wrap">
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={(e) => {
                          Array.from(e.target.files).forEach(file => {
                            handleVideoUpload(file, idx);
                          });
                        }}
                        className="hidden"
                        id={`project-videos-${idx}`}
                      />
                      <label
                        htmlFor={`project-videos-${idx}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg cursor-pointer hover:bg-purple-200 border border-purple-300"
                      >
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload Videos'}
                      </label>
                      <button
                        type="button"
                        onClick={() => onBrowseStorage && onBrowseStorage((urls) => {
                          const currentVideos = projects[idx]?.videos || [];
                          // urls can be an array (multi-select) or single string
                          const newUrls = Array.isArray(urls) ? urls : [urls];
                          onChange(`data.projects.${idx}.videos`, [...currentVideos, ...newUrls]);
                        }, 'video', true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                      >
                        <FolderOpen size={16} />
                        Browse Storage
                      </button>
                      <p className="text-xs text-gray-500 w-full mt-1">MP4, WebM, MOV up to 50MB each</p>
                    </div>
                    
                    {/* Video Link Input */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            const currentVideos = project.videos || [];
                            const newVideos = [...currentVideos, e.target.value.trim()];
                            onChange(`data.projects.${idx}.videos`, newVideos);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          if (input.value.trim()) {
                            const currentVideos = project.videos || [];
                            const newVideos = [...currentVideos, input.value.trim()];
                            onChange(`data.projects.${idx}.videos`, newVideos);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 border border-blue-300 flex items-center gap-2"
                      >
                        <Link size={16} />
                        Add Link
                      </button>
                    </div>
                    
                    {/* Video Preview Grid */}
                    {project.videos?.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {project.videos.map((video, videoIdx) => (
                          <div key={videoIdx} className="relative group">
                            {video.startsWith('http') && (video.includes('youtube.com') || video.includes('youtu.be') || video.includes('vimeo.com')) ? (
                              <div className="w-full h-32 bg-gray-100 rounded-sm border shadow-xs flex items-center justify-center">
                                <div className="text-center">
                                  <Link size={24} className="mx-auto mb-2 text-gray-400" />
                                  <p className="text-xs text-gray-600 truncate px-2">
                                    {video.includes('youtube.com') ? 'YouTube' : video.includes('vimeo.com') ? 'Vimeo' : 'Video Link'}
                                  </p>
                                  <a href={video} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                                    View Video
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <video 
                                src={video.startsWith('http') ? video : `/${video}`} 
                                className="w-full h-32 object-cover rounded-sm border shadow-xs"
                                controls
                                preload="metadata"
                              />
                            )}
                            <button
                              onClick={() => {
                                const newVideos = project.videos.filter((_, i) => i !== videoIdx);
                                onChange(`data.projects.${idx}.videos`, newVideos);
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
const CapabilitiesEditor = ({ data, onChange, onImageUpload, uploading, onBrowseStorage, editLanguage = 'en' }) => {
  const capabilities = data.data?.capabilities || [];

  const addCapability = () => {
    const newCapability = {
      id: Date.now(),
      title: 'New Capability',
      description: 'Describe this capability...',
      icon: '', // Add icon field
      active: true,
      order: capabilities.length + 1
    };
    onChange('data.capabilities', [...capabilities, newCapability]);
  };

  const handleIconUpload = async (file, capIdx) => {
    try {
      const result = await onImageUpload(file, 'capabilities');
      if (result?.success) {
        updateCapability(capIdx, 'icon', result.file.url);
      }
    } catch (error) {
      console.error('Icon upload failed:', error);
    }
  };

  const updateCapability = (index, field, value) => {
    const updatedCapabilities = [...capabilities];
    
    // Handle both string and object formats
    if (typeof updatedCapabilities[index] === 'string') {
      // Convert string to object
      updatedCapabilities[index] = {
        id: Date.now(),
        title: updatedCapabilities[index],
        description: 'Professional capability in this area.',
        active: true,
        order: index + 1
      };
    }
    
    updatedCapabilities[index][field] = value;
    onChange('data.capabilities', updatedCapabilities);
  };

  const removeCapability = (index) => {
    const updatedCapabilities = capabilities.filter((_, i) => i !== index);
    onChange('data.capabilities', updatedCapabilities);
  };

  const toggleCapabilityActive = (index) => {
    const updatedCapabilities = capabilities.map((capability, i) => 
      i === index ? { ...capability, active: !capability.active } : capability
    );
    onChange('data.capabilities', updatedCapabilities);
  };

  const handleDragEnd = (items) => {
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onChange('data.capabilities', reorderedItems);
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border p-6">
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
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe what you can do..."
        />
      </div>
      
      <DragDropContext onDragEnd={(result) => {
        if (!result.destination) return;
        
        const items = Array.from(capabilities);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        
        handleDragEnd(items);
      }}>
        <Droppable droppableId="capabilities">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {capabilities.map((capability, idx) => {
                // Handle both string and object formats
                const capabilityObj = typeof capability === 'string' 
                  ? { id: idx, title: capability, description: '', active: true }
                  : capability;
                  
                return (
                  <Draggable key={capabilityObj.id || idx} draggableId={String(capabilityObj.id || idx)} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg p-4 bg-gray-50 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            {/* Drag Handle */}
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical size={16} className="text-gray-400" />
                            </div>
                            <h4 className="font-medium text-gray-900">Capability #{idx + 1}</h4>
                            <button
                              onClick={() => toggleCapabilityActive(idx)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                capabilityObj.active !== false 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {capabilityObj.active !== false ? '✓ Active' : '✗ Inactive'}
                            </button>
                          </div>
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

                          {/* Icon/Image Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Icon/Image (Optional)</label>
                            <div className="flex items-center gap-4">
                              {capabilityObj.icon && (
                                <div className="relative">
                                  <img
                                    src={capabilityObj.icon.startsWith('http') ? capabilityObj.icon : `/${capabilityObj.icon}`}
                                    alt={`${capabilityObj.title} icon`}
                                    className="w-16 h-16 object-contain rounded-sm border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => updateCapability(idx, 'icon', '')}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600 flex items-center justify-center"
                                    title="Remove icon"
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) handleIconUpload(file, idx);
                                  }}
                                  className="hidden"
                                  id={`cap-icon-${idx}`}
                                />
                                <label
                                  htmlFor={`cap-icon-${idx}`}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200"
                                >
                                  <Upload size={14} />
                                  {uploading ? 'Uploading...' : 'Upload Icon'}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => onBrowseStorage && onBrowseStorage((url) => updateCapability(idx, 'icon', url), 'image')}
                                  className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                                >
                                  <FolderOpen size={14} />
                                  Browse
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

// Experience Section Editor
const ExperienceEditor = ({ data, onChange, onImageUpload, uploading, onBrowseStorage, editLanguage = 'en' }) => {
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
    <div className="bg-white rounded-lg shadow-xs border p-6">
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
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
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
                    className="w-16 h-16 object-contain rounded-sm border"
                  />
                )}
                <div className="flex gap-2">
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
                  <button
                    type="button"
                    onClick={() => onBrowseStorage && onBrowseStorage((url) => onChange(`data.experiences.${idx}.logo`, url), 'image')}
                    className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    <FolderOpen size={14} />
                    Browse
                  </button>
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
                placeholder="Job overview and summary..."
              />
            </div>

            {/* Responsibilities Section */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Key Responsibilities</label>
                <button
                  onClick={() => {
                    const currentResponsibilities = exp.responsibilities || [];
                    onChange(`data.experiences.${idx}.responsibilities`, [...currentResponsibilities, '']);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Plus size={14} />
                  Add Responsibility
                </button>
              </div>
              
              <div className="space-y-2">
                {(exp.responsibilities || []).map((responsibility, respIdx) => (
                  <div key={respIdx} className="flex gap-2">
                    <textarea
                      value={responsibility}
                      onChange={(e) => {
                        const newResponsibilities = [...(exp.responsibilities || [])];
                        newResponsibilities[respIdx] = e.target.value;
                        onChange(`data.experiences.${idx}.responsibilities`, newResponsibilities);
                      }}
                      rows={2}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Describe a key responsibility or achievement..."
                    />
                    <button
                      onClick={() => {
                        const newResponsibilities = (exp.responsibilities || []).filter((_, i) => i !== respIdx);
                        onChange(`data.experiences.${idx}.responsibilities`, newResponsibilities);
                      }}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                {(!exp.responsibilities || exp.responsibilities.length === 0) && (
                  <p className="text-sm text-gray-500 italic">No responsibilities added yet. Click "Add Responsibility" to get started.</p>
                )}
              </div>
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
const EducationEditor = ({ data, onChange, onImageUpload, uploading, onBrowseStorage, editLanguage = 'en' }) => {
  const educations = data.data?.educationList || [];
  
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
    onChange('data.educationList', [...educations, newEducation]);
  };

  const toggleEducationActive = (idx) => {
    const updatedEducations = educations.map((education, i) => 
      i === idx ? { ...education, active: !education.active } : education
    );
    onChange('data.educationList', updatedEducations);
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

    onChange('data.educationList', reorderedItems);
  };

  const handleImageUpload = async (file, eduIdx) => {
    try {
      const result = await onImageUpload(file, 'education');
      if (result?.success) {
        onChange(`data.educationList.${eduIdx}.logo`, result.file.url); // Changed from .image to .logo
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border p-6">
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
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
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
                              onChange('data.educationList', newEducations);
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
                    className="w-16 h-16 object-contain rounded-sm border"
                  />
                )}
                <div className="flex gap-2">
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
                  <button
                    type="button"
                    onClick={() => onBrowseStorage && onBrowseStorage((url) => onChange(`data.educationList.${idx}.logo`, url), 'image')}
                    className="inline-flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                  >
                    <FolderOpen size={14} />
                    Browse
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => onChange(`data.educationList.${idx}.degree`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => onChange(`data.educationList.${idx}.institution`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="University Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={edu.duration || ''}
                  onChange={(e) => onChange(`data.educationList.${idx}.duration`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="2019 - 2023"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={edu.location || ''}
                  onChange={(e) => onChange(`data.educationList.${idx}.location`, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="City, Country"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={edu.description || ''}
                onChange={(e) => onChange(`data.educationList.${idx}.description`, e.target.value)}
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
const BasicEditor = ({ data, onChange, editLanguage = 'en' }) => (
  <div className="bg-white rounded-lg shadow-xs border p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-6">{localize(data.title, 'en')}</h3>
    
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Title {editLanguage === 'ar' && '(العربية)'}</label>
        <input
          type="text"
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'title', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'title', editLanguage, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter content for this section..."
        />
      </div>
    </div>
  </div>
);

// Footer and Links Editor
// FooterAndLinksEditor Component
const FooterAndLinksEditor = ({ data, onChange, editLanguage = 'en' }) => {
  // Get intro section data for CV link sync
  const { sections } = useData();
  const introSection = sections.find(s => s.type === 'intro');
  const introCvLink = introSection?.data?.cvLink || '';

  // Sync CV link from intro section if available
  const handleSyncCvLink = () => {
    if (introCvLink) {
      onChange('data.cvLink', introCvLink);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Footer & Links</h3>
      
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Welcome Message</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title {editLanguage === 'ar' && '(العربية)'}</label>
              <input
                type="text"
                dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
                value={getLocalizedFieldValue(data.data?.welcomeMessage, 'title', editLanguage)}
                onChange={(e) => setLocalizedFieldValue((path, value) => onChange(`data.welcomeMessage.${path}`, value), data.data?.welcomeMessage, 'title', editLanguage, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Welcome to My Portfolio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description {editLanguage === 'ar' && '(العربية)'}</label>
              <textarea
                dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
                value={getLocalizedFieldValue(data.data?.welcomeMessage, 'description', editLanguage)}
                onChange={(e) => setLocalizedFieldValue((path, value) => onChange(`data.welcomeMessage.${path}`, value), data.data?.welcomeMessage, 'description', editLanguage, e.target.value)}
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

        {/* Social Links with Enable/Disable */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">Social Links</h4>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={data.data?.socialLinks?.enabled !== false}
                onChange={(e) => onChange('data.socialLinks.enabled', e.target.checked)}
                className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700">Show Social Links</span>
            </label>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${data.data?.socialLinks?.enabled === false ? 'opacity-50' : ''}`}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">🐙 GitHub</label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={data.data?.socialLinks?.githubEnabled !== false}
                    onChange={(e) => onChange('data.socialLinks.githubEnabled', e.target.checked)}
                    className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                  />
                  <span className="text-gray-600">Enable</span>
                </label>
              </div>
              <input
                type="url"
                value={data.data?.socialLinks?.github || ''}
                onChange={(e) => onChange('data.socialLinks.github', e.target.value)}
                disabled={data.data?.socialLinks?.githubEnabled === false || data.data?.socialLinks?.enabled === false}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="https://github.com/Ahmad-Alqattu"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">💼 LinkedIn</label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={data.data?.socialLinks?.linkedinEnabled !== false}
                    onChange={(e) => onChange('data.socialLinks.linkedinEnabled', e.target.checked)}
                    className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                  />
                  <span className="text-gray-600">Enable</span>
                </label>
              </div>
              <input
                type="url"
                value={data.data?.socialLinks?.linkedin || ''}
                onChange={(e) => onChange('data.socialLinks.linkedin', e.target.value)}
                disabled={data.data?.socialLinks?.linkedinEnabled === false || data.data?.socialLinks?.enabled === false}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="https://www.linkedin.com/in/ahmad-al-qattu-987587201/"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">📘 Facebook</label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={data.data?.socialLinks?.facebookEnabled !== false}
                    onChange={(e) => onChange('data.socialLinks.facebookEnabled', e.target.checked)}
                    className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                  />
                  <span className="text-gray-600">Enable</span>
                </label>
              </div>
              <input
                type="url"
                value={data.data?.socialLinks?.facebook || ''}
                onChange={(e) => onChange('data.socialLinks.facebook', e.target.value)}
                disabled={data.data?.socialLinks?.facebookEnabled === false || data.data?.socialLinks?.enabled === false}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="https://www.facebook.com/ahmadluay.alqatu.5"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-gray-700">📧 Email Link</label>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={data.data?.socialLinks?.emailEnabled !== false}
                    onChange={(e) => onChange('data.socialLinks.emailEnabled', e.target.checked)}
                    className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 scale-75"
                  />
                  <span className="text-gray-600">Enable</span>
                </label>
              </div>
              <input
                type="text"
                value={data.data?.socialLinks?.email || ''}
                onChange={(e) => onChange('data.socialLinks.email', e.target.value)}
                disabled={data.data?.socialLinks?.emailEnabled === false || data.data?.socialLinks?.enabled === false}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                placeholder="mailto:ahmadl.qatu@gmail.com"
              />
            </div>
          </div>
        </div>

        {/* CV Link with Sync Option */}
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">CV/Resume Link</h4>
          
          {introCvLink && (
            <div className="mb-3 p-3 bg-blue-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  <strong>Profile CV Link:</strong> {introCvLink}
                </div>
                <button
                  onClick={handleSyncCvLink}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-sm hover:bg-blue-700 transition-colors"
                >
                  Sync from Profile
                </button>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">📄 Footer CV Link</label>
              <input
                type="text"
                value={data.data?.cvLink || ''}
                onChange={(e) => onChange('data.cvLink', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="/assets/AhmadQattu_resume.pdf"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used for the Download CV link in the footer
              </p>
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
};

// Certificates Section Editor
const CertificatesEditor = ({ data, onChange, onImageUpload, uploading, onBrowseStorage, editLanguage = 'en' }) => {
  const rawCertificates = data.data?.certificates || [];
  // Sort certificates by order property
  const certificates = [...rawCertificates].sort((a, b) => (a.order || 999) - (b.order || 999));
  const [expandedCertificate, setExpandedCertificate] = useState(0);

  // Initialize order values for certificates that don't have them
  useEffect(() => {
    const needsOrder = rawCertificates.some(cert => cert.order === undefined);
    if (needsOrder) {
      const certificatesWithOrder = rawCertificates.map((cert, index) => ({
        ...cert,
        order: cert.order !== undefined ? cert.order : index + 1
      }));
      onChange('data.certificates', certificatesWithOrder);
    }
  }, []);

  const addCertificate = () => {
    const newCertificate = {
      id: Date.now(),
      name: 'New Certificate',
      issuer: 'Issuing Organization',
      issueDate: '2024',
      description: 'Description of the certificate...',
      image: '',
      pdf: '',
      link: '', // Optional verification link
      active: true,
      order: certificates.length + 1
    };
    onChange('data.certificates', [...certificates, newCertificate]);
  };

  const removeCertificate = (idx) => {
    const newCertificates = certificates.filter((_, i) => i !== idx);
    onChange('data.certificates', newCertificates);
  };

  const toggleCertificateActive = (idx) => {
    const updatedCertificates = certificates.map((cert, i) => 
      i === idx ? { ...cert, active: !cert.active } : cert
    );
    onChange('data.certificates', updatedCertificates);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(certificates);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const itemsWithOrder = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onChange('data.certificates', itemsWithOrder);
  };

  const handleFileUpload = async (file, certIdx, fileType) => {
    try {
      const result = await onImageUpload(file, 'certificates');
      if (result?.success) {
        onChange(`data.certificates.${certIdx}.${fileType}`, result.file.url);
      }
    } catch (error) {
      console.error(`${fileType} upload failed:`, error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xs border p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Certificates</h3>
        <button
          onClick={addCertificate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Certificate
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
        <textarea
          dir={editLanguage === 'ar' ? 'rtl' : 'ltr'}
          value={getLocalizedFieldValue(data, 'content', editLanguage)}
          onChange={(e) => setLocalizedFieldValue(onChange, data, 'content', editLanguage, e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your certificates section..."
        />
      </div>
      
      <div className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="certificates">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {certificates.map((certificate, idx) => (
                  <Draggable key={certificate.id} draggableId={String(certificate.id)} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border rounded-lg overflow-hidden bg-linear-to-r from-purple-50 to-blue-50 ${
                          snapshot.isDragging ? 'shadow-lg' : ''
                        }`}
                      >
                        {/* Certificate Header */}
                        <div className="flex justify-between items-center p-4 cursor-pointer hover:bg-opacity-80 transition-colors">
                          <div className="flex items-center gap-3">
                            <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                              <GripVertical size={20} className="text-gray-400" />
                            </div>
                            
                            <div 
                              className={`transform transition-transform ${expandedCertificate === idx ? 'rotate-90' : ''}`}
                              onClick={() => setExpandedCertificate(expandedCertificate === idx ? -1 : idx)}
                            >
                              ▶
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                              <div>
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  📜 {localize(certificate.name, 'en') || `Certificate #${idx + 1}`}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCertificateActive(idx);
                                    }}
                                    className={`text-sm px-2 py-1 rounded-full ${
                                      certificate.active !== false 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                    }`}
                                  >
                                    {certificate.active !== false ? '✓ Active' : '✗ Inactive'}
                                  </button>
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {localize(certificate.issuer, 'en') || 'No issuer'} • {certificate.issueDate || 'No date'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCertificate(idx);
                            }}
                            className="text-red-600 hover:text-red-800 p-1 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Certificate Details */}
                        {expandedCertificate === idx && (
                          <div className="p-4 border-t bg-white space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Name</label>
                                <input
                                  type="text"
                                  value={certificate.name || ''}
                                  onChange={(e) => onChange(`data.certificates.${idx}.name`, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter certificate name"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
                                <input
                                  type="text"
                                  value={certificate.issuer || ''}
                                  onChange={(e) => onChange(`data.certificates.${idx}.issuer`, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Organization name"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                                <input
                                  type="text"
                                  value={certificate.issueDate || ''}
                                  onChange={(e) => onChange(`data.certificates.${idx}.issueDate`, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="2024"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">🔗 Verification Link (Optional)</label>
                                <input
                                  type="url"
                                  value={certificate.link || ''}
                                  onChange={(e) => onChange(`data.certificates.${idx}.link`, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="https://verify-certificate.com/..."
                                />
                              </div>
                            </div>
                            
                            {/* Description */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                              <textarea
                                value={certificate.description || ''}
                                onChange={(e) => onChange(`data.certificates.${idx}.description`, e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Description of the certificate..."
                              />
                            </div>
                            
                            {/* File Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Certificate Image */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Image</label>
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          handleFileUpload(file, idx, 'image');
                                        }
                                      }}
                                      className="hidden"
                                      id={`cert-image-${idx}`}
                                    />
                                    <label
                                      htmlFor={`cert-image-${idx}`}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 border border-blue-300"
                                    >
                                      <ImageIcon size={16} />
                                      {uploading ? 'Uploading...' : 'Upload Image'}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => onBrowseStorage && onBrowseStorage((url) => {
                                        onChange(`data.certificates.${idx}.image`, url);
                                      }, 'image')}
                                      className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                                    >
                                      <FolderOpen size={16} />
                                      Browse Storage
                                    </button>
                                  </div>
                                  
                                  {certificate.image && (
                                    <div className="relative">
                                      <img 
                                        src={certificate.image.startsWith('http') ? certificate.image : `/${certificate.image}`} 
                                        alt={`${certificate.name} certificate`}
                                        className="w-full h-32 object-cover rounded-sm border shadow-xs"
                                      />
                                      <button
                                        onClick={() => onChange(`data.certificates.${idx}.image`, '')}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Certificate PDF */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Certificate PDF</label>
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                          handleFileUpload(file, idx, 'pdf');
                                        }
                                      }}
                                      className="hidden"
                                      id={`cert-pdf-${idx}`}
                                    />
                                    <label
                                      htmlFor={`cert-pdf-${idx}`}
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg cursor-pointer hover:bg-red-200 border border-red-300"
                                    >
                                      <FileText size={16} />
                                      {uploading ? 'Uploading...' : 'Upload PDF'}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => onBrowseStorage && onBrowseStorage((url) => {
                                        onChange(`data.certificates.${idx}.pdf`, url);
                                      }, 'document')}
                                      className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                                    >
                                      <FolderOpen size={16} />
                                      Browse Storage
                                    </button>
                                  </div>
                                  
                                  {certificate.pdf && (
                                    <div className="flex items-center gap-2 text-sm text-green-600">
                                      <FileText size={14} />
                                      <a 
                                        href={certificate.pdf} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="underline hover:text-green-800"
                                      >
                                        View Certificate PDF
                                      </a>
                                      <button
                                        onClick={() => onChange(`data.certificates.${idx}.pdf`, '')}
                                        className="text-red-600 hover:text-red-800 ml-2"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  )}
                                </div>
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

export default UniversalEditor;
