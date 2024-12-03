import React, { useState } from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import PortfolioPreview from './PortfolioPreview'; // Import the preview component

const CreatePortfolio = () => {
  // Add state to hold the preview data
  const [previewData, setPreviewData] = useState(null);

  const initialValues = {
    title: '',
    description: '',
    projects: [{ title: '', description: '', url: '' }],
  };

  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    projects: Yup.array()
      .of(
        Yup.object({
          title: Yup.string().required('Project title is required'),
          description: Yup.string().required('Project description is required'),
          url: Yup.string().url('Must be a valid URL').required('Project URL is required'),
        })
      )
      .required('At least one project is required'),
  });

  const handleSubmit = (values) => {
    console.log('Portfolio Submitted:', values);
    // Store submitted portfolio data in the state
    setPreviewData(values);
  };

  return (
    <div>
      <h1>Create Portfolio</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <div>
              <label>Title:</label>
              <Field name="title" type="text" />
            </div>
            <div>
              <label>Description:</label>
              <Field name="description" as="textarea" />
            </div>
            <FieldArray name="projects">
              {({ insert, remove, push }) => (
                <div>
                  <h3>Projects</h3>
                  {values.projects.length > 0 &&
                    values.projects.map((project, index) => (
                      <div key={index}>
                        <div>
                          <label>Project Title:</label>
                          <Field name={`projects.${index}.title`} type="text" />
                        </div>
                        <div>
                          <label>Project Description:</label>
                          <Field name={`projects.${index}.description`} as="textarea" />
                        </div>
                        <div>
                          <label>Project URL:</label>
                          <Field name={`projects.${index}.url`} type="url" />
                        </div>
                        <button type="button" onClick={() => remove(index)}>
                          Remove Project
                        </button>
                      </div>
                    ))}
                  <button type="button" onClick={() => push({ title: '', description: '', url: '' })}>
                    Add Project
                  </button>
                </div>
              )}
            </FieldArray>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>

      {/* Display the preview component if the form has been submitted */}
      {previewData && <PortfolioPreview portfolio={previewData} />}
    </div>
  );
};

export default CreatePortfolio;
