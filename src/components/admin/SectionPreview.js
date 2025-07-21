import React from 'react';
import IntroSection from '../sections/IntroSection';
import SkillsSection from '../sections/SkillsSection';
import EducationSection from '../sections/EducationSection';
import ExperienceSection from '../sections/ExperienceSection';
import ProjectsSection from '../sections/ProjectsSection';
import CapabilitiesSection from '../sections/CapabilitiesSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../layout/Footer';

const SectionPreview = ({ sectionType, sectionData }) => {
  // Create a mock sections object with just this section for preview
  const mockSections = {
    [sectionType]: sectionData
  };

  const renderPreviewSection = () => {
    switch (sectionType) {
      case 'intro':
        return <IntroSection {...sectionData} />;
      case 'skills':
        return <SkillsSection {...sectionData} />;
      case 'education':
        return <EducationSection {...sectionData} educationList={sectionData.data?.educations} />;
      case 'experience':
        return <ExperienceSection {...sectionData} experiences={sectionData.data?.experiences} />;
      case 'projects':
        return <ProjectsSection {...sectionData} projects={sectionData.data?.projects} />;
      case 'capabilities':
        return <CapabilitiesSection {...sectionData} />;
      case 'contact':
        return <ContactSection {...sectionData} />;
      case 'footerAndLinks':
        return <Footer data={sectionData.data} />;
      default:
        return (
          <div className="p-8 text-center text-gray-500">
            <h3 className="text-lg font-medium mb-2">{sectionData.title}</h3>
            <p className="whitespace-pre-wrap">{sectionData.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
          Live Preview
        </h3>
      </div>
      <div className="min-h-[200px]">
        {renderPreviewSection()}
      </div>
    </div>
  );
};

export default SectionPreview;
