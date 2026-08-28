import React from 'react';
import { Box } from '@mui/material';
import { Skeleton } from './SkeletonLoader';

// Enhanced Page Skeleton with Better Colors and No Navigation
export const EnhancedPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50">


    {/* Main Content Area */}
    <div className="flex-1">
      {/* Hero/Intro Section Skeleton */}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Large Profile Image */}
           <div className="w-48 h-48 lg:w-64 lg:h-64 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
          
          {/* Main Info */}
           <div className="space-y-4">
             <div className="w-3/4 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
             <div className="w-1/2 h-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
             <div className="space-y-3 max-w-2xl mx-auto">
               <div className="w-full h-6 bg-gray-200 rounded-sm animate-pulse"></div>
               <div className="w-5/6 h-6 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
               <div className="w-4/5 h-6 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
             </div>
           </div>

          {/* Action Buttons */}
           <div className="flex gap-4 justify-center">
             <div className="w-36 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
             <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
           </div>

          {/* Stats or Highlights */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
             {[...Array(4)].map((_, i) => (
               <div key={i} className="text-center space-y-2">
                 <div className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
                 <div className="w-20 h-5 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Skills Section Preview */}
       <div className="py-20 px-8 bg-white">
         <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
             <div className="w-1/3 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4"></div>
             <div className="w-2/3 h-6 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="p-6 bg-gray-50 rounded-lg space-y-4">
                 <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                 <div className="w-3/4 h-6 bg-gray-200 rounded-sm animate-pulse"></div>
                 <div className="space-y-2">
                   <div className="w-full h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                   <div className="w-5/6 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>

      {/* Projects Section Preview */}
       <div className="py-20 px-8 bg-gray-50">
         <div className="max-w-6xl mx-auto">
           <div className="text-center mb-16">
             <div className="w-1/4 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4"></div>
             <div className="w-1/2 h-6 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[...Array(6)].map((_, i) => (
               <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
                 <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
                 <div className="p-6 space-y-4">
                   <div className="w-3/4 h-6 bg-gray-200 rounded-sm animate-pulse"></div>
                   <div className="space-y-2">
                     <div className="w-full h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                     <div className="w-5/6 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                   </div>
                   <div className="flex gap-2">
                     <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                     <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                     <div className="w-14 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                   </div>
                   <div className="flex gap-3">
                     <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                     <div className="w-20 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>

      {/* Experience Section */}
       <div className="py-20 px-8 bg-white">
         <div className="max-w-4xl mx-auto">
           <div className="text-center mb-16">
             <div className="w-1/3 h-12 bg-gray-200 rounded-lg animate-pulse mx-auto mb-4"></div>
             <div className="w-1/2 h-6 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
           </div>
           
           <div className="space-y-12">
             {[...Array(3)].map((_, i) => (
               <div key={i} className="flex gap-6">
                 <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
                 <div className="flex-1 space-y-4">
                   <div className="w-1/2 h-7 bg-gray-200 rounded-sm animate-pulse"></div>
                   <div className="w-1/3 h-6 bg-gray-200 rounded-sm animate-pulse"></div>
                   <div className="w-1/4 h-5 bg-gray-200 rounded-sm animate-pulse"></div>
                   <div className="space-y-2">
                     <div className="w-full h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                     <div className="w-5/6 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
                     <div className="w-4/5 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
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
       </div>
    </div>

    {/* Mobile Navigation Skeleton */}
     <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
       <div className="flex justify-around">
         {[...Array(5)].map((_, i) => (
           <div key={i} className="flex flex-col items-center gap-1">
             <div className="w-6 h-6 bg-gray-200 rounded-sm animate-pulse"></div>
             <div className="w-12 h-3 bg-gray-200 rounded-sm animate-pulse"></div>
           </div>
         ))}
       </div>
     </div>
  </div>
);

// Sidebar-only skeleton for partial loading (if needed elsewhere)
export const SidebarSkeleton = () => (
  <div className="w-64 h-screen bg-white shadow-lg">
    <div className="p-6 space-y-6">
      {/* Profile Section */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mx-auto"></div>
        <div className="space-y-2">
          <div className="w-3/4 h-6 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
          <div className="w-1/2 h-4 bg-gray-200 rounded-sm animate-pulse mx-auto"></div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-3 pt-6 border-t border-gray-200">
        <div className="w-16 h-5 bg-gray-200 rounded-sm animate-pulse"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
            <div className="w-28 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-3 justify-center pt-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
);

export default EnhancedPageSkeleton;