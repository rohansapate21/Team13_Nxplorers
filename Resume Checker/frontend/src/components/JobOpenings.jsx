import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/JobOpenings.css';

const JobOpenings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/jobs/');
        setJobs(res.data.jobs || []);
      } catch (err) {
        setError('Failed to fetch job openings.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="job-openings">
      <div className="job-openings-container">
        <h2>💼 Job Openings</h2>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading jobs...</span>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">No job openings available at the moment.</div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job, idx) => (
              <div key={idx} className="job-card">
                <h3>{job.title}</h3>
                <div className="job-company">{job.company}</div>
                <div className="job-location">{job.location}</div>
                {job.apply_url && (
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="apply-button">Apply</a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobOpenings; 