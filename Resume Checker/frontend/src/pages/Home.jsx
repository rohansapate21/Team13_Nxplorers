import React, { useState, useRef } from 'react';
import "../styles/home.css"
import { Upload, FileText, Users, TrendingUp, Briefcase, ExternalLink, Download, CheckCircle, XCircle, AlertCircle, Eye, BarChart3, Clock, MapPin, Building } from 'lucide-react';

const ResumePortal = () => {
  const [activeTab, setActiveTab] = useState('checker');
  const [userType, setUserType] = useState('normal');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  // Mock job news data
  const jobNews = [
    {
      title: "Tech Industry Hiring Surge in Q2 2025",
      summary: "Major tech companies are ramping up recruitment with over 50,000 new positions expected.",
      source: "TechCrunch",
      time: "2 hours ago",
      trend: "up"
    },
    {
      title: "Remote Work Policies Shape New Hiring Trends",
      summary: "Companies adapting flexible work models are seeing 40% more applications.",
      source: "Forbes",
      time: "5 hours ago",
      trend: "up"
    },
    {
      title: "AI Skills in High Demand Across Industries",
      summary: "Machine learning and AI expertise now required in 60% of tech job postings.",
      source: "LinkedIn News",
      time: "1 day ago",
      trend: "up"
    },
    {
      title: "Entry-Level Positions See Competitive Market",
      summary: "Fresh graduates facing increased competition as companies become more selective.",
      source: "Economic Times",
      time: "2 days ago",
      trend: "down"
    }
  ];

  // Mock job openings data
  const jobOpenings = [
    {
      title: "Senior Frontend Developer",
      company: "Google",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹25-35 LPA",
      posted: "2 days ago",
      source: "LinkedIn",
      skills: ["React", "TypeScript", "Node.js"]
    },
    {
      title: "Data Scientist Intern",
      company: "Microsoft",
      location: "Hyderabad, India",
      type: "Internship",
      salary: "₹50K/month",
      posted: "1 day ago",
      source: "Internshala",
      skills: ["Python", "ML", "Statistics"]
    },
    {
      title: "Product Manager",
      company: "Flipkart",
      location: "Mumbai, India",
      type: "Full-time",
      salary: "₹20-28 LPA",
      posted: "3 days ago",
      source: "Naukri",
      skills: ["Strategy", "Analytics", "Leadership"]
    },
    {
      title: "DevOps Engineer",
      company: "Amazon",
      location: "Chennai, India",
      type: "Full-time",
      salary: "₹18-25 LPA",
      posted: "4 days ago",
      source: "Career360",
      skills: ["AWS", "Docker", "Kubernetes"]
    },
    {
      title: "UI/UX Designer",
      company: "Zomato",
      location: "Delhi, India",
      type: "Full-time",
      salary: "₹12-18 LPA",
      posted: "1 week ago",
      source: "LinkedIn",
      skills: ["Figma", "Prototyping", "User Research"]
    },
    {
      title: "Backend Developer Intern",
      company: "Paytm",
      location: "Noida, India",
      type: "Internship",
      salary: "₹35K/month",
      posted: "5 days ago",
      source: "Internshala",
      skills: ["Java", "Spring", "MySQL"]
    }
  ];

  // Resume analysis criteria
  const analysisChecklist = [
    { id: 'contact', label: 'Contact Information', weight: 10 },
    { id: 'summary', label: 'Professional Summary', weight: 15 },
    { id: 'experience', label: 'Work Experience', weight: 25 },
    { id: 'education', label: 'Education Details', weight: 15 },
    { id: 'skills', label: 'Technical Skills', weight: 20 },
    { id: 'formatting', label: 'Formatting & Layout', weight: 10 },
    { id: 'keywords', label: 'Industry Keywords', weight: 5 }
  ];

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
    
    if (files.length > 0) {
      analyzeResumes(files);
    }
  };

  const analyzeResumes = async (files) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = files.map((file, index) => {
      const scores = analysisChecklist.map(item => ({
        ...item,
        score: Math.floor(Math.random() * 41) + 60, // Random score between 60-100
        status: Math.random() > 0.3 ? 'pass' : 'fail'
      }));
      
      const totalScore = scores.reduce((acc, item) => acc + (item.score * item.weight / 100), 0);
      
      return {
        fileName: file.name,
        fileSize: file.size,
        totalScore: Math.round(totalScore),
        scores,
        suggestions: generateSuggestions(scores)
      };
    });
    
    setAnalysisResults(results);
    setIsAnalyzing(false);
  };

  const generateSuggestions = (scores) => {
    const suggestions = [];
    scores.forEach(item => {
      if (item.score < 75) {
        suggestions.push(`Improve ${item.label.toLowerCase()}`);
      }
    });
    return suggestions;
  };

  const generateReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalFiles: analysisResults.length,
      averageScore: Math.round(analysisResults.reduce((acc, result) => acc + result.totalScore, 0) / analysisResults.length),
      results: analysisResults
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-analysis-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score) => {
    if (score >= 85) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 70) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Resume Portal</h1>
            </div>
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('checker')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'checker' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Resume Checker
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'news' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Job News
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'jobs' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Job Openings
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'checker' && (
          <div className="space-y-8">
            {/* User Type Selection */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select User Type</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setUserType('normal')}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all ${
                    userType === 'normal'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">Normal User</div>
                    <div className="text-sm text-gray-600">Upload single resume</div>
                  </div>
                </button>
                <button
                  onClick={() => setUserType('hr')}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all ${
                    userType === 'hr'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-medium">HR User</div>
                    <div className="text-sm text-gray-600">Upload ZIP batch files</div>
                  </div>
                </button>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Resumes</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {userType === 'hr' ? 'Upload ZIP file with multiple resumes' : 'Upload your resume'}
                </p>
                <p className="text-gray-600 mb-4">
                  Supported formats: PDF, DOC, DOCX {userType === 'hr' && ', ZIP'}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  accept={userType === 'hr' ? '.pdf,.doc,.docx,.zip' : '.pdf,.doc,.docx'}
                  multiple={userType === 'hr'}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose Files
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {isAnalyzing && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="text-lg text-gray-700">Analyzing resumes...</p>
                </div>
              </div>
            )}

            {analysisResults.length > 0 && !isAnalyzing && (
              <div className="space-y-6">
                {/* Summary */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Analysis Summary</h2>
                    <button
                      onClick={generateReport}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Generate Report</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Total Files</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-900">{analysisResults.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Average Score</span>
                      </div>
                      <p className="text-2xl font-bold text-green-900">
                        {Math.round(analysisResults.reduce((acc, result) => acc + result.totalScore, 0) / analysisResults.length)}%
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Pass Rate</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-900">
                        {Math.round((analysisResults.filter(r => r.totalScore >= 70).length / analysisResults.length) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Individual Results */}
                {analysisResults.map((result, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{result.fileName}</h3>
                        <p className="text-sm text-gray-600">{(result.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getScoreIcon(result.totalScore)}
                        <span className={`text-2xl font-bold ${getScoreColor(result.totalScore)}`}>
                          {result.totalScore}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Detailed Scores</h4>
                        <div className="space-y-2">
                          {result.scores.map((score, scoreIndex) => (
                            <div key={scoreIndex} className="flex justify-between items-center">
                              <span className="text-sm text-gray-700">{score.label}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      score.score >= 85 ? 'bg-green-500' :
                                      score.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${score.score}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900">{score.score}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Improvement Suggestions</h4>
                        <ul className="space-y-1">
                          {result.suggestions.map((suggestion, suggestionIndex) => (
                            <li key={suggestionIndex} className="flex items-center space-x-2 text-sm text-gray-700">
                              <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Market News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobNews.map((news, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className={`w-5 h-5 ${news.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                      <span className="text-sm text-gray-600">{news.source}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{news.time}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{news.title}</h3>
                  <p className="text-gray-700 mb-4">{news.summary}</p>
                  <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    <span>Read more</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Job Openings</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobOpenings.map((job, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                      <div className="flex items-center space-x-2 text-gray-600 mt-1">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {job.source}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium text-green-600">{job.salary}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{job.posted}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Apply Now
                    </button>
                    <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePortal;