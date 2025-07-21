import React, { useState, useRef } from 'react';
import { Upload, X, Eye, FileText, Film, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ 
  onFileUpload, 
  uploading = false, 
  accept = "image/*", 
  maxSizeKB = 5120, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  currentFile = null,
  label = "Upload File",
  preview = true,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentFile || null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return <ImageIcon size={20} />;
    if (type?.startsWith('video/')) return <Film size={20} />;
    if (type?.includes('pdf') || type?.includes('document')) return <FileText size={20} />;
    return <FileText size={20} />;
  };

  // Get file size in human readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    setError('');
    
    // Check file size
    if (file.size > maxSizeKB * 1024) {
      setError(`File size must be less than ${formatFileSize(maxSizeKB * 1024)}`);
      return false;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      setError(`File type not allowed. Accepted: ${allowedTypes.join(', ')}`);
      return false;
    }

    return true;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!validateFile(file)) return;

    // Create preview URL for images
    if (file.type.startsWith('image/') && preview) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    // Call the upload handler
    if (onFileUpload) {
      onFileUpload(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Clear preview
  const clearPreview = () => {
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : error 
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="text-center">
          {uploading ? (
            <div className="animate-spin mx-auto mb-3 w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          ) : (
            <Upload className="mx-auto mb-3 w-8 h-8 text-gray-400" />
          )}
          
          <p className="text-sm text-gray-600 mb-2">
            {uploading ? 'Uploading...' : `Drag & drop files here, or click to select`}
          </p>
          
          <button
            type="button"
            disabled={uploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            <Upload size={16} />
            {label}
          </button>
          
          <p className="text-xs text-gray-500 mt-2">
            Max size: {formatFileSize(maxSizeKB * 1024)}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Preview */}
      {previewUrl && preview && (
        <div className="relative bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Preview</h4>
            <button
              onClick={clearPreview}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <X size={16} />
            </button>
          </div>
          
          {previewUrl.startsWith('data:') || previewUrl.includes('blob:') || previewUrl.startsWith('http') ? (
            <div className="space-y-3">
              {/* Image Preview */}
              {(previewUrl.includes('image') || accept.includes('image')) && (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-full h-auto max-h-48 object-contain rounded border mx-auto"
                  />
                </div>
              )}
              
              {/* File Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                {getFileIcon(accept)}
                <span>File uploaded successfully</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-white rounded border">
              {getFileIcon()}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">File ready</p>
                <p className="text-xs text-gray-500">Click upload to proceed</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
