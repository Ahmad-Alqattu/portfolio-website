// Live Preview Components for Split-Screen Interface
import React from 'react';
import { ExternalLink, Github, Download, Mail, Linkedin, Twitter } from 'lucide-react';

// Intro Section Preview
export const IntroPreview = ({ section }) => {
  const data = section.data || {};
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {data.profilePicture ? (
              <img 
                src={data.profilePicture} 
                alt={data.name} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-white"
              />
            ) : (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-300 flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-gray-500 text-4xl">👤</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {data.name || 'Your Name'}
            </h1>
            <h2 className="text-xl md:text-2xl text-blue-600 font-semibold mb-2">
              {data.title || 'Your Title'}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              {data.subtitle || 'Your Subtitle'}
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              {data.description || 'Tell the world about yourself...'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
              {data.cvLink && (
                <a 
                  href={data.cvLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download size={20} />
                  <span>Download CV</span>
                </a>
              )}
              <button className="flex items-center space-x-2 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                <Mail size={20} />
                <span>Get In Touch</span>
              </button>
            </div>

            {/* Social Links */}
            {data.socialLinks && (
              <div className="flex justify-center md:justify-start space-x-4">
                {data.socialLinks.linkedin && (
                  <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-700 transition-colors">
                    <Linkedin size={24} />
                  </a>
                )}
                {data.socialLinks.github && (
                  <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer"
                     className="text-gray-700 hover:text-gray-900 transition-colors">
                    <Github size={24} />
                  </a>
                )}
                {data.socialLinks.twitter && (
                  <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                     className="text-blue-400 hover:text-blue-500 transition-colors">
                    <Twitter size={24} />
                  </a>
                )}
                {data.socialLinks.email && (
                  <a href={`mailto:${data.socialLinks.email}`}
                     className="text-red-500 hover:text-red-600 transition-colors">
                    <Mail size={24} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Skills Section Preview
export const SkillsPreview = ({ section }) => {
  const skills = section.data?.skillsList || {};
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
          <p className="text-lg text-gray-600">{section.content || 'My technical skills and expertise'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(skills).map(([category, skillList]) => (
            <div key={category} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {category}
              </h3>
              <div className="space-y-3">
                {skillList.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{skill}</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div 
                          key={star}
                          className={`w-3 h-3 rounded-full ${
                            star <= 4 ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Projects Section Preview
export const ProjectsPreview = ({ section }) => {
  const projects = section.data?.projects || [];
  const featuredProjects = projects.filter(p => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);
  
  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
          <p className="text-lg text-gray-600">{section.content || 'Featured projects and work'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Project Image */}
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-4xl">🚀</span>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {/* Action Links */}
                <div className="flex space-x-3">
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink size={16} />
                      <span>Live Demo</span>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Github size={16} />
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600">Add your first project to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Experience Section Preview
export const ExperiencePreview = ({ section }) => {
  const experiences = section.experience || [];
  const sortedExperiences = experiences.sort((a, b) => {
    // Sort by start date (most recent first)
    return new Date(b.startDate) - new Date(a.startDate);
  });
  
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Work Experience</h2>
          <p className="text-lg text-gray-600">{section.content || 'Professional experience'}</p>
        </div>

        <div className="space-y-8">
          {sortedExperiences.map((exp, index) => (
            <div key={exp.id} className="relative">
              {/* Timeline Line */}
              {index !== sortedExperiences.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-full bg-blue-200 -z-10"></div>
              )}
              
              <div className="flex items-start space-x-6">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  {exp.company ? exp.company.charAt(0) : '💼'}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                      <p className="text-gray-600">{exp.location}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-sm text-gray-500 md:text-right">
                      <div className="flex items-center space-x-2">
                        <span>{exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                        <span>—</span>
                        <span>
                          {exp.current 
                            ? 'Present' 
                            : exp.endDate 
                              ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                              : 'Present'
                          }
                        </span>
                      </div>
                      {exp.current && (
                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-2">Key Responsibilities:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.responsibilities.map((resp, respIndex) => (
                          <li key={respIndex}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {experiences.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Experience Added</h3>
            <p className="text-gray-600">Add your work experience to showcase your career journey!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Education Section Preview
export const EducationPreview = ({ section }) => {
  const educations = section.data?.educationList || [];
  const sortedEducations = educations.sort((a, b) => {
    // Sort by start date (most recent first)
    return new Date(b.startDate) - new Date(a.startDate);
  });
  
  return (
    <div className="p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Education</h2>
          <p className="text-lg text-gray-600">{section.content || 'Educational background'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedEducations.map((edu) => (
            <div key={edu.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{edu.degree}</h3>
                  <p className="text-blue-600 font-medium mb-1">{edu.field}</p>
                  <p className="text-gray-700 font-medium mb-2">{edu.institution}</p>
                  <p className="text-gray-600 text-sm mb-2">{edu.location}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>
                      {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' — '}
                      {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    {edu.gpa && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        GPA: {edu.gpa}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{edu.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {educations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Education Added</h3>
            <p className="text-gray-600">Add your educational background to complete your profile!</p>
          </div>
        )}
      </div>
    </div>
  );
};
