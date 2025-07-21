// Public Portfolio Component for Dynamic User Routes
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllSections } from '../../firebase/firestore';
import { getUserConfig } from '../../firebase/userConfig';
import { IntroPreview, SkillsPreview, ProjectsPreview, ExperiencePreview, EducationPreview } from '../admin/SectionPreviews';
import { motion } from 'framer-motion';
import { ArrowUp, ExternalLink, Github, Linkedin, Mail, Download } from 'lucide-react';

const PublicPortfolio = () => {
  const { userSlug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadPortfolio();
    
    // Handle scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [userSlug]);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      
      // For MVP: Simple slug lookup (in production, you'd have proper slug indexing)
      // For now, we'll simulate finding the user by slug
      const mockUserId = userSlug; // Simplified for MVP
      
      // Load user config
      const userConfig = await getUserConfig(mockUserId);
      if (!userConfig || !userConfig.isPublic) {
        setError('Portfolio not found or not public');
        setLoading(false);
        return;
      }
      
      // Load portfolio sections
      const sectionTypes = ['intro', 'skills', 'projects', 'experience', 'education'];
      const sections = {};
      
      for (const type of sectionTypes) {
        try {
          const sectionData = await getAllSections(type, mockUserId);
          if (sectionData && sectionData.length > 0) {
            sections[type] = sectionData[0]; // Take first section of each type
          }
        } catch (err) {
          console.warn(`Could not load ${type} section:`, err);
        }
      }
      
      setPortfolio(sections);
      setConfig(userConfig);
      
      // Update page title
      document.title = userConfig.portfolioTitle || `${userConfig.userSlug}'s Portfolio`;
      
    } catch (err) {
      console.error('Error loading portfolio:', err);
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>Go Home</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-bold text-xl text-gray-900">
              {config?.portfolioTitle || `${userSlug}'s Portfolio`}
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#intro" className="text-gray-700 hover:text-blue-600 transition-colors">About</a>
              <a href="#skills" className="text-gray-700 hover:text-blue-600 transition-colors">Skills</a>
              <a href="#projects" className="text-gray-700 hover:text-blue-600 transition-colors">Projects</a>
              <a href="#experience" className="text-gray-700 hover:text-blue-600 transition-colors">Experience</a>
              <a href="#education" className="text-gray-700 hover:text-blue-600 transition-colors">Education</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {/* Introduction Section */}
        {portfolio?.intro && (
          <section id="intro" className="min-h-screen flex items-center">
            <div className="w-full">
              <IntroPreview section={portfolio.intro} />
            </div>
          </section>
        )}

        {/* Skills Section */}
        {portfolio?.skills && (
          <section id="skills" className="py-20 bg-gray-50">
            <SkillsPreview section={portfolio.skills} />
          </section>
        )}

        {/* Projects Section */}
        {portfolio?.projects && (
          <section id="projects" className="py-20">
            <ProjectsPreview section={portfolio.projects} />
          </section>
        )}

        {/* Experience Section */}
        {portfolio?.experience && (
          <section id="experience" className="py-20 bg-gray-50">
            <ExperiencePreview section={portfolio.experience} />
          </section>
        )}

        {/* Education Section */}
        {portfolio?.education && (
          <section id="education" className="py-20">
            <EducationPreview section={portfolio.education} />
          </section>
        )}

        {/* Contact Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can work together
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {config?.socialLinks?.email && (
                <a 
                  href={`mailto:${config.socialLinks.email}`}
                  className="flex items-center space-x-2 bg-white/20 px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Mail size={20} />
                  <span>Email</span>
                </a>
              )}
              {config?.socialLinks?.linkedin && (
                <a 
                  href={config.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                </a>
              )}
              {config?.socialLinks?.github && (
                <a 
                  href={config.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {config?.portfolioTitle || `${userSlug}'s Portfolio`}. 
            Built with the Dynamic Portfolio Platform.
          </p>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </div>
  );
};

export default PublicPortfolio;
