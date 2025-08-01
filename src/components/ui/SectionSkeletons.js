import React from 'react';
import { Box } from '@mui/material';
import { Skeleton } from './SkeletonLoader';

// Intro Section Skeleton
export const IntroSectionSkeleton = () => (
  <Box id="intro" className="min-h-screen flex items-center justify-center p-8">
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Profile Image Skeleton */}
        <div className="w-64 h-64 lg:w-80 lg:h-80 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
        
        {/* Content Skeleton */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <Skeleton width="w-3/4" height="h-12" className="mx-auto lg:mx-0" />
          <Skeleton width="w-1/2" height="h-8" className="mx-auto lg:mx-0" />
          <div className="space-y-3">
            <Skeleton width="w-full" height="h-6" />
            <Skeleton width="w-5/6" height="h-6" />
            <Skeleton width="w-4/5" height="h-6" />
          </div>
          <div className="flex gap-4 justify-center lg:justify-start">
            <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </Box>
);

// Skills/Capabilities Section Skeleton
export const SkillsSectionSkeleton = () => (
  <Box id="skills" className="py-20 px-8">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <Skeleton width="w-1/3" height="h-12" className="mx-auto mb-4" />
        <Skeleton width="w-2/3" height="h-6" className="mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 space-y-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <Skeleton width="w-3/4" height="h-6" />
            <div className="space-y-2">
              <Skeleton width="w-full" height="h-4" />
              <Skeleton width="w-5/6" height="h-4" />
              <Skeleton width="w-4/5" height="h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </Box>
);

// Projects Section Skeleton
export const ProjectsSectionSkeleton = () => (
  <Box id="projects" className="py-20 px-8">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <Skeleton width="w-1/4" height="h-12" className="mx-auto mb-4" />
        <Skeleton width="w-1/2" height="h-6" className="mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <Skeleton width="w-3/4" height="h-6" />
              <div className="space-y-2">
                <Skeleton width="w-full" height="h-4" />
                <Skeleton width="w-5/6" height="h-4" />
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-14 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="flex gap-3">
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Box>
);

// Experience Section Skeleton
export const ExperienceSectionSkeleton = () => (
  <Box id="experience" className="py-20 px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <Skeleton width="w-1/3" height="h-12" className="mx-auto mb-4" />
        <Skeleton width="w-1/2" height="h-6" className="mx-auto" />
      </div>
      
      <div className="space-y-12">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-4">
              <Skeleton width="w-1/2" height="h-7" />
              <Skeleton width="w-1/3" height="h-6" />
              <Skeleton width="w-1/4" height="h-5" />
              <div className="space-y-2">
                <Skeleton width="w-full" height="h-4" />
                <Skeleton width="w-5/6" height="h-4" />
                <Skeleton width="w-4/5" height="h-4" />
              </div>
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-18 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Box>
);

// Education Section Skeleton
export const EducationSectionSkeleton = () => (
  <Box id="education" className="py-20 px-8">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <Skeleton width="w-1/4" height="h-12" className="mx-auto mb-4" />
        <Skeleton width="w-1/2" height="h-6" className="mx-auto" />
      </div>
      
      <div className="space-y-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-6">
            <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <Skeleton width="w-2/3" height="h-7" />
              <Skeleton width="w-1/2" height="h-6" />
              <Skeleton width="w-1/3" height="h-5" />
              <div className="space-y-2">
                <Skeleton width="w-full" height="h-4" />
                <Skeleton width="w-3/4" height="h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Box>
);

// Certificates Section Skeleton
export const CertificatesSectionSkeleton = () => (
  <Box id="certificates" className="py-20 px-8">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <Skeleton width="w-1/3" height="h-12" className="mx-auto mb-4" />
        <Skeleton width="w-1/2" height="h-6" className="mx-auto" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
            <Skeleton width="w-3/4" height="h-6" />
            <Skeleton width="w-1/2" height="h-5" />
            <Skeleton width="w-1/3" height="h-4" />
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </Box>
);