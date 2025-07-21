// Simple Profile Editor - Clean & Practical - ALL Sections
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { mediaManager } from '../../firebase/mediaManager';
import { updateSection } from '../../firebase/firestore';
import { migrateLocalDataToFirebase } from '../../utils/dataMigration';
import { Upload, Save, Eye, User, Image as ImageIcon, FileText, Link, Download, Plus, Trash2, Edit3 } from 'lucide-react';

const SimpleProfileEditor = () => {
  const { currentUser } = useAuth();
  const { sections, useFirestore } = useData();
  const [currentSection, setCurrentSection] = useState('intro');
  const [sectionData, setSectionData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current section data
    const section = sections.find(s => s.type === currentSection || s.id === currentSection);
    if (section) {
      setSectionData({ ...section });
    } else {
      // Create new section if doesn't exist
      setSectionData({
        id: currentSection,
        type: currentSection,
        title: currentSection.charAt(0).toUpperCase() + currentSection.slice(1),
        content: '',
        data: {}
      });
    }
  }, [sections, currentSection]);

  const handleInputChange = (field, value) => {
    setSectionData(prev => {
      if (field.includes('.')) {
        const parts = field.split('.');
        const newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        current[parts[parts.length - 1]] = value;
        return newData;
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const result = await mediaManager.uploadFile(file, 'profile');
      if (result.success) {
        handleInputChange('data.image', result.file.url);
        setMessage('✅ Image uploaded successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Upload failed: ' + result.error);
      }
    } catch (error) {
      setMessage('❌ Upload error: ' + error.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (useFirestore) {
        const result = await updateSection(sectionData.id || sectionData.type, sectionData);
        if (result.success) {
          setMessage('✅ Section saved successfully!');
        } else {
          setMessage('❌ Save failed: ' + result.error);
        }
      } else {
        setMessage('✅ Changes saved locally!');
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Save error: ' + error.message);
    }
    setSaving(false);
  };

  const handleMigrateData = async () => {
    setMessage('📥 Migrating your local data to Firebase...');
    try {
      const result = await migrateLocalDataToFirebase();
      if (result.success) {
        setMessage(`✅ Migration complete! ${result.migrated}/${result.total} sections migrated.`);
        // Refresh the page to load the migrated data
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage(`❌ Migration failed: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Migration error: ${error.message}`);
    }
  };

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-600">Update your portfolio information</p>
            </div>
            <div className="flex gap-3">
              {useFirestore && (
                <button
                  onClick={handleMigrateData}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  <Download size={16} />
                  Import from JSON
                </button>
              )}
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye size={16} />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Profile Picture Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Profile Picture
                  </label>
                  
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {profileData.data?.image ? (
                        <img
                          src={profileData.data.image.startsWith('http') ? profileData.data.image : `/${profileData.data.image}`}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                          <User size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="profile-upload"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 border"
                      >
                        <Upload size={16} />
                        {uploading ? 'Uploading...' : 'Upload New Photo'}
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG up to 5MB
                      </p>
                    </div>
                  </div>

                  {/* Image URL Option */}
                  <div className="mt-4">
                    <label className="block text-sm text-gray-600 mb-2">
                      Or paste image URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={profileData.data?.image || ''}
                        onChange={(e) => handleInputChange('data.image', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* CV Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Resume/CV
                  </label>
                  
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          // Handle CV upload
                          mediaManager.uploadFile(file, 'documents').then(result => {
                            if (result.success) {
                              handleInputChange('data.cvLink', result.file.url);
                              setMessage('✅ CV uploaded successfully!');
                            }
                          });
                        }
                      }}
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 border"
                    >
                      <FileText size={16} />
                      Upload CV
                    </label>
                    
                    <input
                      type="url"
                      value={profileData.data?.cvLink || ''}
                      onChange={(e) => handleInputChange('data.cvLink', e.target.value)}
                      placeholder="Or paste CV URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Basic Info Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={profileData.data?.subtitle || ''}
                    onChange={(e) => handleInputChange('data.subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Software Engineer, Designer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highlight/Tagline
                  </label>
                  <input
                    type="text"
                    value={profileData.data?.highlight || ''}
                    onChange={(e) => handleInputChange('data.highlight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief, catchy description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Me
                  </label>
                  <textarea
                    value={profileData.content || ''}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell people about yourself, your experience, and what you do..."
                  />
                </div>
              </div>
            </div>

            {/* Live Preview Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Live Preview</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-6">
                  {profileData.data?.image ? (
                    <img
                      src={profileData.data.image.startsWith('http') ? profileData.data.image : `/${profileData.data.image}`}
                      alt="Profile Preview"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={24} className="text-gray-500" />
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {profileData.name || 'Your Name'}
                    </h4>
                    <p className="text-blue-600 font-medium">
                      {profileData.data?.subtitle || 'Your Title'}
                    </p>
                    {profileData.data?.highlight && (
                      <p className="text-gray-600 mt-1">
                        {profileData.data.highlight}
                      </p>
                    )}
                  </div>
                </div>
                
                {profileData.content && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {profileData.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfileEditor;
