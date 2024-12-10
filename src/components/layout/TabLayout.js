import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const sections = [
  { id: 'about', label: 'About Me' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const TabLayout = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        textColor="primary"
        indicatorColor="primary"
        centered
        sx={{ backgroundColor: '#f5f5f5' }}
      >
        {sections.map((section, index) => (
          <Tab key={section.id} label={section.label} />
        ))}
      </Tabs>

      {sections.map((section, index) => (
        <Box
          key={section.id}
          hidden={activeTab !== index}
          sx={{ padding: '50px', minHeight: '90vh', backgroundColor: '#e3f2fd', margin: '20px 0' }}
        >
          <h2>{section.label}</h2>
          <p>This is the {section.label} section.</p>
        </Box>
      ))}
    </Box>
  );
};

export default TabLayout;
