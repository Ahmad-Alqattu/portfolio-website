import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { PictureAsPdf, Image as ImageIcon, Error as ErrorIcon } from '@mui/icons-material';

const ThumbnailGenerator = ({ 
  src, 
  alt, 
  width = 200, 
  height = 150, 
  className = '',
  onClick,
  showType = true 
}) => {
  const [thumbnailSrc, setThumbnailSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fileType, setFileType] = useState(null);
  const [pdfThumbnail, setPdfThumbnail] = useState(null);

  useEffect(() => {
    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    const generateThumbnail = async () => {
      try {
        setLoading(true);
        setError(false);

        // Determine file type
        const isPdf = src.toLowerCase().includes('.pdf') || src.toLowerCase().includes('pdf');
        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(src);
        
        if (isPdf) {
          setFileType('pdf');
          // For PDFs, we'll try to generate a thumbnail using PDF.js
          const pdfUrl = src.startsWith('http') ? src : `/${src}`;
          generatePdfThumbnail(pdfUrl);
        } else if (isImage) {
          setFileType('image');
          // For images, use the image directly as thumbnail
          setThumbnailSrc(src.startsWith('http') ? src : `/${src}`);
        } else {
          // Try to load as image first
          const img = new Image();
          img.onload = () => {
            setFileType('image');
            setThumbnailSrc(src.startsWith('http') ? src : `/${src}`);
            setLoading(false);
          };
          img.onerror = () => {
            setFileType('unknown');
            setError(true);
            setLoading(false);
          };
          img.src = src.startsWith('http') ? src : `/${src}`;
          return;
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error generating thumbnail:', err);
        setError(true);
        setLoading(false);
      }
    };

    generateThumbnail();
  }, [src]);

  const generatePdfThumbnail = async (pdfUrl) => {
    try {
      // Use PDF.js from CDN to avoid build issues
      if (!window.pdfjsLib) {
        // Load PDF.js from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          renderPdfThumbnail(pdfUrl);
        };
        script.onerror = () => {
          console.error('Failed to load PDF.js');
          setError(true);
          setLoading(false);
        };
        document.head.appendChild(script);
      } else {
        renderPdfThumbnail(pdfUrl);
      }
    } catch (error) {
      console.error('Error setting up PDF thumbnail:', error);
      setError(true);
      setLoading(false);
    }
  };

  const renderPdfThumbnail = async (pdfUrl) => {
    try {
      const pdf = await window.pdfjsLib.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1);
      
      const scale = 1.5;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert canvas to data URL
      const thumbnailDataUrl = canvas.toDataURL('image/png');
      setPdfThumbnail(thumbnailDataUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error rendering PDF thumbnail:', error);
      setError(true);
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setError(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.300'
        }}
        className={className}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !src) {
    return (
      <Box
        sx={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'grey.300',
          cursor: onClick ? 'pointer' : 'default'
        }}
        className={className}
        onClick={onClick}
      >
        <ErrorIcon sx={{ fontSize: 32, color: 'grey.500', mb: 1 }} />
        <Typography variant="caption" color="text.secondary" textAlign="center">
          No preview
        </Typography>
      </Box>
    );
  }

  if (fileType === 'pdf') {
    return (
      <Box
        sx={{
          width,
          height,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'grey.300',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s ease',
          '&:hover': onClick ? {
            transform: 'scale(1.05)',
            boxShadow: 3
          } : {},
          position: 'relative',
          backgroundColor: 'grey.50'
        }}
        className={className}
        onClick={onClick}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.8)',
              zIndex: 2
            }}
          >
            <CircularProgress size={24} />
          </Box>
        )}
        
        {error || !pdfThumbnail ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'error.light',
              color: 'white'
            }}
          >
            <PictureAsPdf sx={{ fontSize: 48, mb: 1 }} />
            {showType && (
              <Typography variant="caption" fontWeight="bold" textAlign="center">
                PDF Certificate
              </Typography>
            )}
          </Box>
        ) : (
          <>
            <img
              src={pdfThumbnail}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {showType && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(244, 67, 54, 0.9)',
                  borderRadius: 1,
                  p: 0.5
                }}
              >
                <PictureAsPdf sx={{ fontSize: 16, color: 'white' }} />
              </Box>
            )}
          </>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width,
        height,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'grey.300',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
          boxShadow: 3
        } : {},
        position: 'relative'
      }}
      className={className}
      onClick={onClick}
    >
      <img
        src={thumbnailSrc}
        alt={alt}
        onError={handleImageError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
      {showType && fileType === 'image' && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: 1,
            p: 0.5
          }}
        >
          <ImageIcon sx={{ fontSize: 16, color: 'white' }} />
        </Box>
      )}
    </Box>
  );
};

export default ThumbnailGenerator;