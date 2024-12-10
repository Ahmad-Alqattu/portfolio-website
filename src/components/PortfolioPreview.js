import React from 'react';

const PortfolioPreview = ({ portfolio }) => {
  return (
    <div>
      <h1>{portfolio.title}</h1>
      <p>{portfolio.description}</p>
      <h2>Projects</h2>
      <ul>
        {portfolio.projects.map((project, index) => (
          <li key={index}>
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              {project.title}
            </a>
            <p>{project.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioPreview;
