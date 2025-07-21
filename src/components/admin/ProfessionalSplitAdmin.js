import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Save, Upload, Eye, Settings, Database, FileText, Image, Video, Folder, Plus, Trash2, Edit3, Monitor, Smartphone, Tablet } from 'lucide-react';
import { mediaManager } from '../../firebase/mediaManager';
import { getAllSections, updateSection } from '../../firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

const ProfessionalSplitAdmin = () => {
  const { user } = useAuth();
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState('intro');
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const [uploadProgress, setUploadProgress] = useState({});
  const [mediaFiles, setMediaFiles] = useState({ images: [], videos: [], documents: [] });
  const [currentEditData, setCurrentEditData] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    loadSections();
    loadMedia();
  }, [user]);

  const loadSections = async () => {
    try {
      const data = await getAllSections();
      setSections(data);
      if (data.length > 0) {
        setCurrentEditData(data[0]);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const loadMedia = async () => {
    try {
      const images = await mediaManager.getMediaByType('images');
      const videos = await mediaManager.getMediaByType('videos');
      const documents = await mediaManager.getMediaByType('documents');
      setMediaFiles({ images, videos, documents });
    } catch (error) {
      console.error('Error loading media:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaveStatus('saving');
      await updateSection(activeSection, currentEditData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
      await loadSections();
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  const handleFileUpload = async (files, type) => {
    const file = files[0];
    if (!file) return;

    const uploadId = Date.now();
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));

    try {
      const downloadURL = await mediaManager.uploadFile(file, type, (progress) => {
        setUploadProgress(prev => ({ ...prev, [uploadId]: progress }));
      });
      
      setUploadProgress(prev => ({ ...prev, [uploadId]: 100 }));
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[uploadId];
          return newProgress;
        });
      }, 2000);
      
      await loadMedia();
      return downloadURL;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[uploadId];
        return newProgress;
      });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const renderSectionEditor = () => {
    if (!currentEditData) return null;

    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">معلومات شخصية</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
                <input
                  type="text"
                  value={currentEditData.name || ''}
                  onChange={(e) => setCurrentEditData({...currentEditData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">العنوان الوظيفي</label>
                <input
                  type="text"
                  value={currentEditData.data?.subtitle || ''}
                  onChange={(e) => setCurrentEditData({
                    ...currentEditData, 
                    data: {...currentEditData.data, subtitle: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">النص التعريفي</label>
              <textarea
                value={currentEditData.content || ''}
                onChange={(e) => setCurrentEditData({...currentEditData, content: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العبارة المميزة</label>
              <input
                type="text"
                value={currentEditData.data?.highlight || ''}
                onChange={(e) => setCurrentEditData({
                  ...currentEditData, 
                  data: {...currentEditData.data, highlight: e.target.value}
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-800 mb-3">الصورة الشخصية</h4>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files, 'images')}
                    className="hidden"
                    id="profile-image"
                  />
                  <label
                    htmlFor="profile-image"
                    className="cursor-pointer bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 text-blue-500 mb-2" />
                    <span className="text-blue-600 font-medium">ارفع صورة جديدة</span>
                  </label>
                </div>
                
                {currentEditData.data?.image && (
                  <div className="w-24 h-24 border rounded-lg overflow-hidden">
                    <img 
                      src={currentEditData.data.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">المهارات</h3>
            
            {currentEditData.data?.skillsList && Object.entries(currentEditData.data.skillsList).map(([category, skills]) => (
              <div key={category} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-800">{category}</h4>
                  <button
                    onClick={() => {
                      const newSkillsList = {...currentEditData.data.skillsList};
                      newSkillsList[category] = [...skills, ''];
                      setCurrentEditData({
                        ...currentEditData,
                        data: {...currentEditData.data, skillsList: newSkillsList}
                      });
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => {
                          const newSkillsList = {...currentEditData.data.skillsList};
                          newSkillsList[category][index] = e.target.value;
                          setCurrentEditData({
                            ...currentEditData,
                            data: {...currentEditData.data, skillsList: newSkillsList}
                          });
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => {
                          const newSkillsList = {...currentEditData.data.skillsList};
                          newSkillsList[category] = skills.filter((_, i) => i !== index);
                          setCurrentEditData({
                            ...currentEditData,
                            data: {...currentEditData.data, skillsList: newSkillsList}
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">المشاريع</h3>
            
            {currentEditData.data?.projects?.map((project, index) => (
              <div key={project.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-800">مشروع {index + 1}</h4>
                  <button
                    onClick={() => {
                      const newProjects = currentEditData.data.projects.filter((_, i) => i !== index);
                      setCurrentEditData({
                        ...currentEditData,
                        data: {...currentEditData.data, projects: newProjects}
                      });
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المشروع</label>
                    <input
                      type="text"
                      value={project.name || ''}
                      onChange={(e) => {
                        const newProjects = [...currentEditData.data.projects];
                        newProjects[index] = {...project, name: e.target.value};
                        setCurrentEditData({
                          ...currentEditData,
                          data: {...currentEditData.data, projects: newProjects}
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط المشروع</label>
                    <input
                      type="url"
                      value={project.link?.[0] || ''}
                      onChange={(e) => {
                        const newProjects = [...currentEditData.data.projects];
                        newProjects[index] = {...project, link: [e.target.value]};
                        setCurrentEditData({
                          ...currentEditData,
                          data: {...currentEditData.data, projects: newProjects}
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف المختصر</label>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => {
                      const newProjects = [...currentEditData.data.projects];
                      newProjects[index] = {...project, description: e.target.value};
                      setCurrentEditData({
                        ...currentEditData,
                        data: {...currentEditData.data, projects: newProjects}
                      });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الوصف التفصيلي</label>
                  <textarea
                    value={project.fullDescription || ''}
                    onChange={(e) => {
                      const newProjects = [...currentEditData.data.projects];
                      newProjects[index] = {...project, fullDescription: e.target.value};
                      setCurrentEditData({
                        ...currentEditData,
                        data: {...currentEditData.data, projects: newProjects}
                      });
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="border-t pt-4">
                  <h5 className="font-medium text-gray-700 mb-3">صور المشروع</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {project.images?.map((img, imgIndex) => (
                      <div key={imgIndex} className="relative group">
                        <img 
                          src={img} 
                          alt={`Project ${index + 1} - Image ${imgIndex + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <button
                            onClick={() => copyToClipboard(img)}
                            className="text-white text-xs bg-blue-500 px-2 py-1 rounded mr-1"
                          >
                            نسخ
                          </button>
                          <button
                            onClick={() => {
                              const newProjects = [...currentEditData.data.projects];
                              newProjects[index].images = project.images.filter((_, i) => i !== imgIndex);
                              setCurrentEditData({
                                ...currentEditData,
                                data: {...currentEditData.data, projects: newProjects}
                              });
                            }}
                            className="text-white text-xs bg-red-500 px-2 py-1 rounded"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="border-2 border-dashed border-gray-300 rounded h-20 flex items-center justify-center">
                      <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={async (e) => {
                            const files = Array.from(e.target.files);
                            const newImages = [];
                            for (const file of files) {
                              const url = await handleFileUpload([file], 'images');
                              if (url) newImages.push(url);
                            }
                            if (newImages.length > 0) {
                              const newProjects = [...currentEditData.data.projects];
                              newProjects[index].images = [...(project.images || []), ...newImages];
                              setCurrentEditData({
                                ...currentEditData,
                                data: {...currentEditData.data, projects: newProjects}
                              });
                            }
                          }}
                          className="hidden"
                        />
                        <Plus className="w-6 h-6" />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newProject = {
                  id: Date.now(),
                  name: '',
                  description: '',
                  fullDescription: '',
                  images: [],
                  videos: [],
                  link: ['']
                };
                const newProjects = [...(currentEditData.data?.projects || []), newProject];
                setCurrentEditData({
                  ...currentEditData,
                  data: {...currentEditData.data, projects: newProjects}
                });
              }}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              إضافة مشروع جديد
            </button>
          </div>
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <Edit3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>اختر قسم للتحرير</p>
          </div>
        );
    }
  };

  const renderPreview = () => {
    if (!isPreviewVisible) return null;

    const previewClass = {
      desktop: 'w-full',
      tablet: 'w-3/4 mx-auto',
      mobile: 'w-1/3 mx-auto'
    };

    return (
      <div className="bg-white border-l">
        <div className="bg-gray-50 border-b px-4 py-3 flex items-center justify-between">
          <h3 className="font-medium text-gray-800">معاينة مباشرة</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPreviewVisible(false)}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
          <div className={`transition-all duration-300 ${previewClass[previewMode]}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {activeSection === 'intro' && currentEditData && (
                <div className="p-6 text-center">
                  {currentEditData.data?.image && (
                    <img 
                      src={currentEditData.data.image} 
                      alt={currentEditData.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
                    />
                  )}
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentEditData.name}</h1>
                  <h2 className="text-xl text-blue-600 mb-4">{currentEditData.data?.subtitle}</h2>
                  <p className="text-gray-600 mb-4">{currentEditData.content}</p>
                  {currentEditData.data?.highlight && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <p className="text-blue-800 font-medium">{currentEditData.data.highlight}</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeSection === 'skills' && currentEditData?.data?.skillsList && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">المهارات</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(currentEditData.data.skillsList).map(([category, skills]) => (
                      <div key={category} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-3">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeSection === 'projects' && currentEditData?.data?.projects && (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">المشاريع</h2>
                  <div className="grid grid-cols-1 gap-6">
                    {currentEditData.data.projects.map((project, index) => (
                      <div key={project.id} className="bg-white border rounded-lg p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{project.name}</h3>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        {project.images && project.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                            {project.images.slice(0, 4).map((img, imgIndex) => (
                              <img 
                                key={imgIndex}
                                src={img} 
                                alt={`${project.name} - Image ${imgIndex + 1}`}
                                className="w-full h-24 object-cover rounded border"
                              />
                            ))}
                          </div>
                        )}
                        
                        {project.link && project.link[0] && (
                          <a 
                            href={project.link[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                          >
                            عرض المشروع
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
          <p className="text-gray-600">إدارة محتوى البورتفوليو</p>
        </div>
        
        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setCurrentEditData(section);
                }}
                className={`w-full text-right px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {section.title || section.id}
              </button>
            ))}
          </nav>
        </div>

        {/* Upload Progress */}
        {Object.keys(uploadProgress).length > 0 && (
          <div className="p-4 border-t">
            <h4 className="font-medium text-gray-700 mb-2">جاري الرفع...</h4>
            {Object.entries(uploadProgress).map(([id, progress]) => (
              <div key={id} className="mb-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600">{progress}%</span>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="p-4 border-t">
          <div className="space-y-3">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
                saveStatus === 'saving'
                  ? 'bg-gray-400 text-white'
                  : saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : saveStatus === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Save className="w-4 h-4 mr-2" />
              {saveStatus === 'saving' ? 'جاري الحفظ...' : 
               saveStatus === 'saved' ? 'تم الحفظ!' :
               saveStatus === 'error' ? 'خطأ في الحفظ!' : 'حفظ التغييرات'}
            </button>
            
            {!isPreviewVisible && (
              <button
                onClick={() => setIsPreviewVisible(true)}
                className="w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                عرض المعاينة
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 flex ${isPreviewVisible ? '' : 'justify-center'}`}>
        {/* Editor Panel */}
        <div className={`${isPreviewVisible ? 'w-1/2' : 'w-full max-w-4xl'} bg-white`}>
          <div className="h-full overflow-auto p-6">
            {renderSectionEditor()}
          </div>
        </div>

        {/* Preview Panel */}
        {isPreviewVisible && (
          <div className="w-1/2">
            {renderPreview()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalSplitAdmin;