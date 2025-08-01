import React from 'react';

// Base skeleton component
export const Skeleton = ({ className = '', width = 'w-full', height = 'h-4' }) => (
  <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
);

// Profile skeleton for intro section
export const ProfileSkeleton = () => (
  <div className="flex flex-col md:flex-row items-center gap-8 p-8">
    <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-full animate-pulse"></div>
    <div className="flex-1 space-y-4">
      <Skeleton width="w-3/4" height="h-8" />
      <Skeleton width="w-1/2" height="h-6" />
      <div className="space-y-2">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-5/6" height="h-4" />
        <Skeleton width="w-4/5" height="h-4" />
      </div>
    </div>
  </div>
);

// Skills skeleton
export const SkillsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton width="w-3/4" height="h-6" />
        <div className="space-y-2">
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-5/6" height="h-4" />
        </div>
      </div>
    ))}
  </div>
);

// Projects skeleton
export const ProjectsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="space-y-4">
        <div className="w-full h-48 bg-gray-200 rounded-lg animate-pulse"></div>
        <Skeleton width="w-3/4" height="h-6" />
        <div className="space-y-2">
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-4/5" height="h-4" />
        </div>
        <div className="flex gap-2">
          <Skeleton width="w-16" height="h-6" className="rounded-full" />
          <Skeleton width="w-20" height="h-6" className="rounded-full" />
          <Skeleton width="w-14" height="h-6" className="rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

// Experience skeleton
export const ExperienceSkeleton = () => (
  <div className="space-y-8 p-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex gap-6">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <Skeleton width="w-1/2" height="h-6" />
          <Skeleton width="w-1/3" height="h-5" />
          <Skeleton width="w-1/4" height="h-4" />
          <div className="space-y-2">
            <Skeleton width="w-full" height="h-4" />
            <Skeleton width="w-5/6" height="h-4" />
            <Skeleton width="w-4/5" height="h-4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Education skeleton
export const EducationSkeleton = () => (
  <div className="space-y-6 p-8">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="flex gap-6">
        <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <Skeleton width="w-2/3" height="h-6" />
          <Skeleton width="w-1/2" height="h-5" />
          <Skeleton width="w-1/3" height="h-4" />
          <div className="space-y-2">
            <Skeleton width="w-full" height="h-4" />
            <Skeleton width="w-3/4" height="h-4" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Generic section skeleton
export const SectionSkeleton = ({ title = true, items = 3 }) => (
  <div className="p-8 space-y-6">
    {title && <Skeleton width="w-1/3" height="h-8" />}
    <div className="space-y-4">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton width="w-3/4" height="h-6" />
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-5/6" height="h-4" />
        </div>
      ))}
    </div>
  </div>
);

// Page loading skeleton
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header skeleton */}
    <div className="bg-white shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Skeleton width="w-32" height="h-8" />
        <div className="flex gap-4">
          <Skeleton width="w-16" height="h-6" />
          <Skeleton width="w-16" height="h-6" />
          <Skeleton width="w-16" height="h-6" />
        </div>
      </div>
    </div>
    
    {/* Main content skeleton */}
    <div className="max-w-7xl mx-auto py-8">
      <ProfileSkeleton />
      <div className="mt-12">
        <SkillsSkeleton />
      </div>
      <div className="mt-12">
        <ProjectsSkeleton />
      </div>
    </div>
  </div>
);