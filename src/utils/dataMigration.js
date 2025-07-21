// Quick Data Migration Utility
import { auth } from '../firebase/config';
import { updateSection } from '../firebase/firestore';

export const migrateLocalDataToFirebase = async () => {
  try {
    // Wait for auth state to be ready
    if (!auth.currentUser) {
      console.log('❌ Authentication required for migration');
      // Try to wait a moment for auth to initialize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!auth.currentUser) {
        return { success: false, error: 'Please login first to migrate data' };
      }
    }

    console.log('✅ User authenticated:', auth.currentUser.email);

    // Fetch the local JSON data
    console.log('📥 Loading local data...');
    const response = await fetch('/data/sectionsData.json');
    const localData = await response.json();

    console.log('🔍 Found sections:', localData.map(s => s.id || s.type));

    // Migrate each section with proper data structure
    const results = [];
    for (const section of localData) {
      console.log(`📤 Migrating ${section.id || section.type}...`);
      
      // Fix data structures for specific sections
      let processedSection = { ...section };
      
      // Ensure data property exists
      if (!processedSection.data) {
        processedSection.data = {};
      }
      
      // Fix specific section types
      switch (processedSection.type) {
        case 'capabilities':
          if (!processedSection.data.capabilities) {
            processedSection.data.capabilities = [
              {
                title: 'Build Robust Applications',
                description: 'I develop stable and efficient services and applications, including JavaFX-based desktop apps and Python apps—scripts for data extraction and classification.'
              },
              {
                title: 'Create Web Services & APIs',
                description: 'I design reliable and scalable RESTful and SOAP-based APIs using frameworks like Spring Boot, Javalin, .NET Core, and PHP.'
              },
              {
                title: 'Develop Mobile Experiences',
                description: 'I deliver smooth, intuitive, and responsive mobile solutions with Flutter, hands-on React Native, and native Android (Java).'
              },
              {
                title: 'Work with Databases & Cloud Services',
                description: 'I manage and secure data using MySQL, PostgreSQL, Microsoft SQL Server, and Firebase (real-time DB, Firestore, and cloud functions).'
              },
              {
                title: 'Front-End Development',
                description: 'I craft clean, responsive, and user-friendly interfaces using HTML5, CSS3, HTMX, JavaScript, React.js, and Bootstrap.'
              },
              {
                title: 'Optimize with Git & DevOps Tools',
                description: 'I streamline deployment and collaboration using Git, Docker, Linux environments, and hosting platforms such as IIS on Windows.'
              }
            ];
          }
          break;
        case 'projects':
          if (!processedSection.data.projects) {
            processedSection.data.projects = [];
          } else {
            // Ensure all projects have active state
            processedSection.data.projects = processedSection.data.projects.map(project => ({
              ...project,
              active: project.active !== undefined ? project.active : true
            }));
          }
          break;
        case 'experience':
          // Handle legacy data structure
          if (processedSection.experience) {
            processedSection.data = processedSection.data || {};
            processedSection.data.experiences = processedSection.experience.map(exp => ({
              ...exp,
              active: exp.active !== undefined ? exp.active : true
            }));
            delete processedSection.experience; // Remove legacy field
          } else if (!processedSection.data.experiences) {
            processedSection.data.experiences = [];
          } else {
            // Ensure all experiences have active state  
            processedSection.data.experiences = processedSection.data.experiences.map(exp => ({
              ...exp,
              active: exp.active !== undefined ? exp.active : true
            }));
          }
          break;
        case 'education':
          // Handle legacy data structure
          if (processedSection.data?.educationList) {
            processedSection.data.educations = processedSection.data.educationList.map(edu => ({
              ...edu,
              active: edu.active !== undefined ? edu.active : true
            }));
            delete processedSection.data.educationList; // Remove legacy field
          } else if (!processedSection.data.educations) {
            processedSection.data.educations = [];
          } else {
            // Ensure all education entries have active state
            processedSection.data.educations = processedSection.data.educations.map(edu => ({
              ...edu,
              active: edu.active !== undefined ? edu.active : true
            }));
          }
          break;
        case 'contact':
          if (!processedSection.data.email) {
            processedSection.data = {
              email: '',
              phone: '',
              location: '',
              linkedin: '',
              github: '',
              website: '',
              ...processedSection.data
            };
          }
          break;
        case 'footerAndLinks':
          if (!processedSection.data.contactInfo) {
            processedSection.data = {
              contactInfo: {
                phone: '+970 0598-682-679',
                email: 'ahmadl.qatu@gmail.com',
                location: 'Ramallah, Palestine'
              },
              socialLinks: {
                github: 'https://github.com/Ahmad-Alqattu',
                linkedin: 'https://www.linkedin.com/in/ahmad-al-qattu-987587201/',
                facebook: 'https://www.facebook.com/ahmadluay.alqatu.5',
                email: 'mailto:ahmadl.qatu@gmail.com'
              },
              welcomeMessage: {
                title: 'Welcome to My Portfolio',
                description: 'Thank you for visiting my personal portfolio website.\nConnect with me on email or drop me a message!'
              },
              cvLink: '/assets/AhmadQattu_resume.pdf',
              copyrightText: 'Ahmad AL-Qatu',
              ...processedSection.data
            };
          }
          break;
      }
      
      // Always use default-user collection for consistency
      const result = await updateSection(processedSection.id || processedSection.type, processedSection, 'default-user');
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${processedSection.id || processedSection.type} migrated successfully`);
      } else {
        console.log(`❌ ${processedSection.id || processedSection.type} failed:`, result.error);
      }
    }

    const successful = results.filter(r => r.success).length;
    const total = results.length;

    console.log(`🎉 Migration complete: ${successful}/${total} sections migrated`);
    
    return {
      success: successful === total,
      migrated: successful,
      total: total,
      results: results
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    return { success: false, error: error.message };
  }
};

// Quick function to run migration from browser console
window.migrateData = migrateLocalDataToFirebase;
