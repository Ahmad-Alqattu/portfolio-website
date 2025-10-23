import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase/config';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { X, Image, FileText, Film, File, Search, Folder, Check } from 'lucide-react';

const StorageBrowser = ({ isOpen, onClose, onSelect, fileType = 'all', multiSelect = false }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentFolder, setCurrentFolder] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen, currentFolder]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const storageRef = ref(storage, currentFolder || '/');
      const result = await listAll(storageRef);

      // Get all files with metadata
      const filePromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url: url,
          size: metadata.size,
          contentType: metadata.contentType,
          timeCreated: metadata.timeCreated,
          type: getFileType(metadata.contentType, itemRef.name)
        };
      });

      // Get all folders
      const folders = result.prefixes.map(folderRef => ({
        name: folderRef.name,
        fullPath: folderRef.fullPath,
        isFolder: true
      }));

      const fileList = await Promise.all(filePromises);

      // Filter by file type if specified
      let filteredFiles = fileList;
      if (fileType !== 'all') {
        filteredFiles = fileList.filter(file => file.type === fileType);
      }

      setFiles([...folders, ...filteredFiles]);
    } catch (error) {
      console.error('Error loading files:', error);
    }
    setLoading(false);
  };

  const getFileType = (contentType, fileName) => {
    if (!contentType) {
      // Fallback to extension
      const ext = fileName.split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
      if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video';
      if (['pdf', 'doc', 'docx'].includes(ext)) return 'document';
      return 'other';
    }

    if (contentType.startsWith('image/')) return 'image';
    if (contentType.startsWith('video/')) return 'video';
    if (contentType.includes('pdf') || contentType.includes('document')) return 'document';
    return 'other';
  };

  const getFileIcon = (file) => {
    if (file.isFolder) return <Folder size={20} className="text-yellow-600" />;

    switch (file.type) {
      case 'image':
        return <Image size={20} className="text-blue-600" />;
      case 'video':
        return <Film size={20} className="text-purple-600" />;
      case 'document':
        return <FileText size={20} className="text-red-600" />;
      default:
        return <File size={20} className="text-gray-600" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const handleFileClick = (file) => {
    if (file.isFolder) {
      setCurrentFolder(file.fullPath);
      if (multiSelect) {
        setSelectedFiles([]);
      } else {
        setSelectedFile(null);
      }
    } else {
      if (multiSelect) {
        // Toggle selection for multi-select mode
        const isSelected = selectedFiles.some(f => f.fullPath === file.fullPath);
        if (isSelected) {
          setSelectedFiles(selectedFiles.filter(f => f.fullPath !== file.fullPath));
        } else {
          setSelectedFiles([...selectedFiles, file]);
        }
      } else {
        setSelectedFile(file);
      }
    }
  };

  const handleSelect = () => {
    if (multiSelect && selectedFiles.length > 0) {
      const urls = selectedFiles.map(f => f.url);
      onSelect(urls, selectedFiles);
      onClose();
      setSelectedFiles([]);
    } else if (!multiSelect && selectedFile) {
      onSelect(selectedFile.url, selectedFile);
      onClose();
      setSelectedFile(null);
    }
  };

  const isFileSelected = (file) => {
    if (multiSelect) {
      return selectedFiles.some(f => f.fullPath === file.fullPath);
    } else {
      return selectedFile?.fullPath === file.fullPath;
    }
  };

  const goBack = () => {
    const parts = currentFolder.split('/').filter(p => p);
    parts.pop();
    setCurrentFolder(parts.join('/'));
    setSelectedFile(null);
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Firebase Storage Browser</h2>
            <p className="text-sm text-gray-600">
              {multiSelect ? 'Select multiple files (click to toggle)' : 'Select a file from your storage'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
          <button
            onClick={() => setCurrentFolder('')}
            className="text-sm text-blue-600 hover:underline"
          >
            Root
          </button>
          {currentFolder.split('/').filter(p => p).map((part, idx, arr) => (
            <React.Fragment key={idx}>
              <span className="text-gray-400">/</span>
              <button
                onClick={() => {
                  const path = arr.slice(0, idx + 1).join('/');
                  setCurrentFolder(path);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                {part}
              </button>
            </React.Fragment>
          ))}
          {currentFolder && (
            <button
              onClick={goBack}
              className="ml-auto text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Search and Stats */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {!loading && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>
                <strong>{filteredFiles.filter(f => !f.isFolder).length}</strong> file{filteredFiles.filter(f => !f.isFolder).length !== 1 ? 's' : ''}
              </span>
              {files.some(f => f.isFolder) && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>
                    <strong>{filteredFiles.filter(f => f.isFolder).length}</strong> folder{filteredFiles.filter(f => f.isFolder).length !== 1 ? 's' : ''}
                  </span>
                </>
              )}
              {searchTerm && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600">Searching: "{searchTerm}"</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* File List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading files...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No files found' : 'No files in this folder'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file, idx) => {
                const isSelected = isFileSelected(file);
                return (
                  <div
                    key={idx}
                    onClick={() => handleFileClick(file)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          {isSelected && (
                            <div className="flex-shrink-0 ml-2">
                              <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                                <Check size={14} />
                              </div>
                            </div>
                          )}
                        </div>
                      {!file.isFolder && (
                        <>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">
                              {formatDate(file.timeCreated)}
                            </p>
                          </div>
                          {file.contentType && (
                            <p className="text-xs text-gray-400 mt-1">
                              {file.contentType}
                            </p>
                          )}
                          {file.type === 'image' && (
                            <div className="mt-2">
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-32 object-cover rounded border"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                          {file.type === 'video' && (
                            <div className="mt-2">
                              <video
                                src={file.url}
                                className="w-full h-32 object-cover rounded border"
                                controls={false}
                              />
                            </div>
                          )}
                          {file.type === 'document' && (
                            <div className="mt-2 p-3 bg-red-50 rounded border border-red-200 flex items-center justify-center">
                              <FileText size={32} className="text-red-600" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {multiSelect ? (
              selectedFiles.length > 0 ? (
                <span>Selected: <strong>{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}</strong></span>
              ) : (
                <span>Click files to select multiple</span>
              )
            ) : (
              selectedFile ? (
                <span>Selected: <strong>{selectedFile.name}</strong></span>
              ) : (
                <span>Select a file to continue</span>
              )
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={multiSelect ? selectedFiles.length === 0 : !selectedFile}
              className={`px-4 py-2 rounded-lg ${
                (multiSelect ? selectedFiles.length > 0 : selectedFile)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {multiSelect && selectedFiles.length > 0
                ? `Select ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`
                : 'Select File'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageBrowser;
