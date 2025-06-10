import React, { useState } from 'react';
import api from '../api';
import '../styles/ResumeParser.css';
import config from '../config';
import Navbar from './Navbar';

const ResumeParser = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const maxFileSize = 5 * 1024 * 1024; // 5MB file size limit

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file);

    // Check file size
    if (file.size > maxFileSize) {
      setError(`File size exceeds the maximum limit of ${maxFileSize / (1024 * 1024)}MB.`);
      return;
    }

    // Check file type
    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      setError('Only PDF and DOC/DOCX files are allowed.');
      return;
    }

    setResumeFile(file);
    setError(null);
    console.log('Resume file set:', file);
  };

  const handleJdTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 1000) {
      setJdText(text);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);
    setProgress(0);

    try {
      // Validation
      if (!resumeFile) {
        throw new Error('Please upload a resume file.');
      }
      if (!jdText.trim()) {
        throw new Error('Please enter a job description.');
      }
      if (jdText.trim().length < 10) {
        throw new Error('Job description must be at least 10 characters long.');
      }

      // Prepare form data
      const formData = new FormData();
      if (Array.isArray(resumeFile)) {
        resumeFile.forEach(file => formData.append('resumes', file));
      } else if (resumeFile) {
        formData.append('resumes', resumeFile);
      }
      formData.append('jd_text', jdText.trim());

      console.log('Submitting data:', {
        resume: resumeFile.name,
        jd_text_length: jdText.trim().length
      });

      // Send to backend
      const response = await api.post(
        config.API_ENDPOINTS.RESUME_PARSE,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          },
        }
      );

      setResult(response.data);
      console.log('Parsing result:', response.data);
      
    } catch (err) {
      console.error('Parsing error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to parse resume. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const removeFile = () => {
    setResumeFile(null);
    setError(null);
  };

  const clearForm = () => {
    setResumeFile(null);
    setJdText('');
    setResult(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="resume-parser">
      <Navbar />
      <div className="resume-parser-container">
        <div className="header">
          <h2>📄 Resume & Job Description Matching</h2>
          <p>Upload your resume and paste the job description to get a detailed match analysis</p>
        </div>
        
        <form onSubmit={handleSubmit} className="parser-form">
          {/* Resume File Upload Section */}
          <div className="file-upload-section">
            <label htmlFor="resume-upload">
              <strong>Upload Resume</strong>
              <span className="file-info">(PDF, DOC, DOCX - Max 5MB)</span>
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="file-input"
            />
            
            {resumeFile && (
              <div className="file-preview">
                <div className="file-item">
                  <span className="file-name">{resumeFile.name}</span>
                  <span className="file-size">
                    ({(resumeFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={removeFile}
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Job Description Text Section */}
          <div className="jd-section">
            <label htmlFor="jd-text">
              <strong>Job Description</strong>
              <span className="char-limit">(Required - Max 1000 characters)</span>
            </label>
            <textarea
              id="jd-text"
              placeholder="Paste the job description here. Include key requirements, skills, qualifications, and responsibilities..."
              value={jdText}
              onChange={handleJdTextChange}
              maxLength={1000}
              rows={8}
              className="jd-textarea"
              required
            />
            <div className="char-count">
              <span className={jdText.length > 900 ? 'warning' : ''}>
                {jdText.length}/1000 characters
              </span>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Progress Bar */}
          {loading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">Processing... {progress}%</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !resumeFile || !jdText.trim()}
              className="submit-btn"
            >
              {loading ? 'Analyzing...' : 'Analyze Match'}
            </button>
            
            {(resumeFile || jdText || result) && (
              <button 
                type="button" 
                onClick={clearForm}
                className="clear-btn"
                disabled={loading}
              >
                Clear All
              </button>
            )}
          </div>
        </form>

        {/* Results Section */}
        {result && (
          <div className="results-container">
            <h3>📊 Analysis Results</h3>
            
            {result.error ? (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {result.error}
              </div>
            ) : (
              <div className="result-content">
                {/* Match Score */}
                <div className="match-score-container">
                  <div className="match-score">
                    <span className="score-label">Overall Match Score</span>
                    <span className="score-value">{result.match_score || 0}%</span>
                  </div>
                  <div className="score-bar">
                    <div 
                      className="score-fill"
                      style={{ width: `${result.match_score || 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="result-grid">
                  {/* Matched Skills */}
                  <div className="result-card">
                    <h4>✅ Matched Skills</h4>
                    <div className="skills-list">
                      {result.matched_skills && result.matched_skills.length > 0 ? (
                        result.matched_skills.map((skill, i) => (
                          <span key={i} className="skill-tag matched">{skill}</span>
                        ))
                      ) : (
                        <p className="no-items">No matching skills found</p>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="result-card">
                    <h4>❌ Missing Skills</h4>
                    <div className="skills-list">
                      {result.missing_skills && result.missing_skills.length > 0 ? (
                        result.missing_skills.map((skill, i) => (
                          <span key={i} className="skill-tag missing">{skill}</span>
                        ))
                      ) : (
                        <p className="no-items">No missing skills identified</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="additional-details">
                  <details className="details-section">
                    <summary>📝 All Resume Skills</summary>
                    <div className="skills-content">
                      {result.resume_skills && result.resume_skills.length > 0 ? (
                        result.resume_skills.map((skill, i) => (
                          <span key={i} className="skill-tag neutral">{skill}</span>
                        ))
                      ) : (
                        <p>No skills extracted from resume</p>
                      )}
                    </div>
                  </details>

                  <details className="details-section">
                    <summary>🎯 All Job Description Skills</summary>
                    <div className="skills-content">
                      {result.jd_skills && result.jd_skills.length > 0 ? (
                        result.jd_skills.map((skill, i) => (
                          <span key={i} className="skill-tag neutral">{skill}</span>
                        ))
                      ) : (
                        <p>No skills extracted from job description</p>
                      )}
                    </div>
                  </details>

                  {result.resume_text && (
                    <details className="details-section">
                      <summary>📄 Extracted Resume Text</summary>
                      <div className="text-content">
                        <pre>{result.resume_text}</pre>
                      </div>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeParser;