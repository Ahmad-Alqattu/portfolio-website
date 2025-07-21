// Individual Section Editors for Split-Screen Interface
import React, { useState } from 'react';
import { Upload, Plus, Trash2, Copy, ExternalLink } from 'lucide-react';

// Intro Section Editor
export const IntroEditor = ({ section, onUpdate, onFileUpload }) => {
  const [data, setData] = useState(section.data || {});

  const handleChange = (field, value) => {
    const updatedData = { ...data, [field]: value };
    setData(updatedData);
    onUpdate('intro', { ...section, data: updatedData });
  };

  const handleSocialChange = (platform, value) => {
    const updatedSocials = { ...data.socialLinks, [platform]: value };
    const updatedData = { ...data, socialLinks: updatedSocials };
    setData(updatedData);
    onUpdate('intro', { ...section, data: updatedData });
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
        <div className="flex items-center space-x-4">
          {data.profilePicture && (
            <img src={data.profilePicture} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0], 'intro', 'data.profilePicture')}
            className="hidden"
            id="profile-upload"
          />
          <label
            htmlFor="profile-upload"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700"
          >
            <Upload size={16} />
            <span>Upload Photo</span>
          </label>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Full Stack Developer"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <input
          type="text"
          value={data.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Brief tagline or specialty"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">About Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Tell visitors about yourself, your passion, and what makes you unique..."
        />
      </div>

      {/* CV Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV</label>
        <div className="flex items-center space-x-4">
          {data.cvLink && (
            <a href={data.cvLink} target="_blank" rel="noopener noreferrer" 
               className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ExternalLink size={16} />
              <span>View Current CV</span>
            </a>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0], 'intro', 'data.cvLink')}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700"
          >
            <Upload size={16} />
            <span>Upload CV</span>
          </label>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Social Links</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
            { key: 'github', label: 'GitHub', placeholder: 'https://github.com/yourusername' },
            { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/yourusername' },
            { key: 'email', label: 'Email', placeholder: 'your@email.com' }
          ].map(social => (
            <div key={social.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{social.label}</label>
              <input
                type="text"
                value={data.socialLinks?.[social.key] || ''}
                onChange={(e) => handleSocialChange(social.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={social.placeholder}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Skills Section Editor
export const SkillsEditor = ({ section, onUpdate }) => {
  const [skills, setSkills] = useState(section.data?.skillsList || {});

  const addSkillCategory = () => {
    const categoryName = prompt('Enter category name:');
    if (categoryName) {
      const updatedSkills = { ...skills, [categoryName]: [] };
      setSkills(updatedSkills);
      onUpdate('skills', { ...section, data: { skillsList: updatedSkills } });
    }
  };

  const addSkillToCategory = (category) => {
    const skillName = prompt('Enter skill name:');
    if (skillName) {
      const updatedSkills = {
        ...skills,
        [category]: [...(skills[category] || []), skillName]
      };
      setSkills(updatedSkills);
      onUpdate('skills', { ...section, data: { skillsList: updatedSkills } });
    }
  };

  const removeSkill = (category, skillIndex) => {
    const updatedSkills = {
      ...skills,
      [category]: skills[category].filter((_, index) => index !== skillIndex)
    };
    setSkills(updatedSkills);
    onUpdate('skills', { ...section, data: { skillsList: updatedSkills } });
  };

  const removeCategory = (category) => {
    if (confirm(`Remove entire ${category} category?`)) {
      const updatedSkills = { ...skills };
      delete updatedSkills[category];
      setSkills(updatedSkills);
      onUpdate('skills', { ...section, data: { skillsList: updatedSkills } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills Categories</h3>
        <button
          onClick={addSkillCategory}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {Object.entries(skills).map(([category, skillList]) => (
        <div key={category} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">{category}</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => addSkillToCategory(category)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
              <button
                onClick={() => removeCategory(category)}
                className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {skillList.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(category, index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Projects Section Editor
export const ProjectsEditor = ({ section, onUpdate, onFileUpload }) => {
  const [projects, setProjects] = useState(section.data?.projects || []);

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Project description...',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      image: '',
      featured: false
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    onUpdate('projects', { ...section, data: { projects: updatedProjects } });
  };

  const updateProject = (projectId, field, value) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, [field]: value } : project
    );
    setProjects(updatedProjects);
    onUpdate('projects', { ...section, data: { projects: updatedProjects } });
  };

  const removeProject = (projectId) => {
    if (confirm('Remove this project?')) {
      const updatedProjects = projects.filter(project => project.id !== projectId);
      setProjects(updatedProjects);
      onUpdate('projects', { ...section, data: { projects: updatedProjects } });
    }
  };

  const addTechnology = (projectId) => {
    const tech = prompt('Enter technology name:');
    if (tech) {
      const project = projects.find(p => p.id === projectId);
      const updatedTechs = [...(project.technologies || []), tech];
      updateProject(projectId, 'technologies', updatedTechs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects</h3>
        <button
          onClick={addProject}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Project</span>
        </button>
      </div>

      {projects.map((project) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={project.title}
                onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={project.featured}
                  onChange={(e) => updateProject(project.id, 'featured', e.target.checked)}
                />
                <span className="text-sm text-gray-600">Featured</span>
              </label>
            </div>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Image</label>
              <div className="space-y-2">
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-full h-32 object-cover rounded-lg" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && onFileUpload(e.target.files[0], 'projects', `project-${project.id}-image`)}
                  className="hidden"
                  id={`project-image-${project.id}`}
                />
                <label
                  htmlFor={`project-image-${project.id}`}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded cursor-pointer hover:bg-gray-700"
                >
                  <Upload size={14} />
                  <span>Upload Image</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Live URL</label>
                <input
                  type="url"
                  value={project.liveUrl}
                  onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://your-project.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={project.githubUrl}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => updateProject(project.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Technologies</label>
              <button
                onClick={() => addTechnology(project.id)}
                className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
              >
                <Plus size={12} />
                <span>Add Tech</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((tech, techIndex) => (
                <div key={techIndex} className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <span>{tech}</span>
                  <button
                    onClick={() => {
                      const updatedTechs = project.technologies.filter((_, i) => i !== techIndex);
                      updateProject(project.id, 'technologies', updatedTechs);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Experience Section Editor
export const ExperienceEditor = ({ section, onUpdate }) => {
  const [experiences, setExperiences] = useState(section.experience || []);

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: 'Job Title',
      company: 'Company Name',
      location: 'Location',
      startDate: '',
      endDate: '',
      current: false,
      description: 'Job description and achievements...',
      responsibilities: []
    };
    const updatedExps = [...experiences, newExp];
    setExperiences(updatedExps);
    onUpdate('experience', { ...section, experience: updatedExps });
  };

  const updateExperience = (expId, field, value) => {
    const updatedExps = experiences.map(exp =>
      exp.id === expId ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExps);
    onUpdate('experience', { ...section, experience: updatedExps });
  };

  const removeExperience = (expId) => {
    if (confirm('Remove this experience?')) {
      const updatedExps = experiences.filter(exp => exp.id !== expId);
      setExperiences(updatedExps);
      onUpdate('experience', { ...section, experience: updatedExps });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Work Experience</h3>
        <button
          onClick={addExperience}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Experience</span>
        </button>
      </div>

      {experiences.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold">Experience Entry</h4>
            <button
              onClick={() => removeExperience(exp.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                value={exp.title}
                onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <div className="space-y-2">
                <input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">Current Position</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your role, achievements, and key responsibilities..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Education Section Editor  
export const EducationEditor = ({ section, onUpdate }) => {
  const [educations, setEducations] = useState(section.data?.educationList || []);

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: 'Degree',
      field: 'Field of Study',
      institution: 'Institution Name',
      location: 'Location',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    };
    const updatedEdus = [...educations, newEdu];
    setEducations(updatedEdus);
    onUpdate('education', { ...section, data: { educationList: updatedEdus } });
  };

  const updateEducation = (eduId, field, value) => {
    const updatedEdus = educations.map(edu =>
      edu.id === eduId ? { ...edu, [field]: value } : edu
    );
    setEducations(updatedEdus);
    onUpdate('education', { ...section, data: { educationList: updatedEdus } });
  };

  const removeEducation = (eduId) => {
    if (confirm('Remove this education entry?')) {
      const updatedEdus = educations.filter(edu => edu.id !== eduId);
      setEducations(updatedEdus);
      onUpdate('education', { ...section, data: { educationList: updatedEdus } });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        <button
          onClick={addEducation}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Education</span>
        </button>
      </div>

      {educations.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold">Education Entry</h4>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="University or School Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3.8/4.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
            <textarea
              value={edu.description}
              onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Relevant coursework, achievements, honors..."
            />
          </div>
        </div>
      ))}
    </div>
  );
};
