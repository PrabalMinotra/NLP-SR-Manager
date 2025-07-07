import React, { useState } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctedPriority, setCorrectedPriority] = useState('');
  const [correctedTeam, setCorrectedTeam] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const priorityOptions = [
    'HIGH PRIORITY URGENT TECHNICAL',
    'HIGH PRIORITY LONG TERM TECHNICAL',
    'LOW PRIORITY TECHNICAL',
    'AWARENESS',
  ];
  const teamOptions = [
    'TECH',
    'PRODUCT',
    'policy',
    ''
  ];

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('employeeId', employeeId);
      formData.append('query', query);
      files.forEach((file) => {
        formData.append('files', file);
      });
      const response = await fetch('http://127.0.0.1:5000/classify', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to classify SR.');
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://127.0.0.1:5000/correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          employeeId,
          query: result.query,
          predictedPriority: result.priority,
          predictedTeam: result.team || '',
          correctedPriority,
          correctedTeam,
        }),
      });
      alert('Thank you for your feedback!');
    } catch (err) {
      alert('Failed to submit correction.');
    }
    setShowCorrection(false);
    setCorrectedPriority('');
    setCorrectedTeam('');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    background: isDarkMode ? '#181A1B' : '#f5f5f5',
    cardBackground: isDarkMode ? '#23272A' : '#ffffff',
    text: isDarkMode ? '#F5F6FA' : '#333333',
    inputBackground: isDarkMode ? '#181A1B' : '#ffffff',
    border: isDarkMode ? '#444' : '#ddd',
    description: isDarkMode ? '#ccc' : '#666',
    copyright: isDarkMode ? '#888' : '#999',
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.background, 
      color: theme.text, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column', 
      padding: '20px',
      position: 'relative'
    }}>
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: '#EF7F1A',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: 14
        }}
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      
      <h1 style={{ fontSize: 30, fontWeight: 700, marginTop: 32, marginBottom: 8, color: '#EF7F1A', textAlign: 'center', letterSpacing: 1 }}>ICICI SR Classifier Portal</h1>
      <div style={{ maxWidth: 800, margin: '0 auto', marginBottom: 50 }}>
        <p style={{ color: theme.description, fontSize: 15, textAlign: 'left', lineHeight: 1.4 }}>
          This portal allows you to submit Service Request (SR) data, along with your name, employee ID, and supporting files (PDFs or images). The system will automatically classify the SR's priority and assign it to the appropriate team using advanced NLP models. All submissions are securely logged for further review and action.
        </p>
      </div>
      <div style={{ 
        width: '90%', 
        maxWidth: 640, 
        background: theme.cardBackground, 
        padding: 24, 
        borderRadius: 13, 
        boxShadow: '0 4px 18px rgba(0,0,0,0.4)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 400 
      }}>
        <h2 style={{ textAlign: 'left', marginBottom: 18, color: '#EF7F1A', letterSpacing: 1, fontSize: 22 }}>SR Team & Priority Classifier</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, textAlign: 'left', width: '100%', fontSize: 15 }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 5, border: `1px solid ${theme.border}`, background: theme.inputBackground, color: theme.text, textAlign: 'left', fontSize: 15 }}
            required
          />
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, textAlign: 'left', width: '100%', fontSize: 15 }}>Employee ID</label>
          <input
            type="text"
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 5, border: `1px solid ${theme.border}`, background: theme.inputBackground, color: theme.text, textAlign: 'left', fontSize: 15 }}
            required
          />
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, textAlign: 'left', width: '100%', fontSize: 15 }}>SR Data</label>
          <textarea
            value={query}
            onChange={e => setQuery(e.target.value)}
            rows={3}
            style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 5, border: `1px solid ${theme.border}`, background: theme.inputBackground, color: theme.text, resize: 'vertical', textAlign: 'left', fontSize: 15 }}
            placeholder="Enter SR data here..."
            required
          />
          <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, textAlign: 'left', width: '100%', fontSize: 15 }}>Upload Files (PDFs/Images)</label>
          <input
            type="file"
            accept=".pdf,image/*"
            multiple
            onChange={handleFileChange}
            style={{ marginBottom: 16, color: theme.text, width: '100%', textAlign: 'center', fontSize: 15 }}
          />
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#EF7F1A', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 600, fontSize: 16, letterSpacing: 1, boxShadow: '0 2px 8px rgba(239,127,26,0.15)', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', marginTop: 6 }}>
            {loading ? 'Classifying...' : 'Classify'}
          </button>
        </form>
        {error && <div style={{ color: '#FF6B6B', marginTop: 12, textAlign: 'center', fontSize: 15 }}>{error}</div>}
        {result && (
          <div style={{ width: '96%', marginTop: 20, background: theme.inputBackground, borderRadius: 8, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', fontSize: 15 }}>
            <div style={{ marginBottom: 6 }}><strong>Query:</strong> {result.query}</div>
            <div style={{ marginBottom: 6 }}><strong>Predicted Priority:</strong> {result.priority}</div>
            {result.priority.toLowerCase() !== 'awareness' && (
              <div style={{ marginBottom: 6 }}><strong>Assigned Team:</strong> {result.team}</div>
            )}
            {result.priority.toLowerCase() === 'awareness' && (
              <div><em>Team assignment skipped (awareness query)</em></div>
            )}
            <div style={{ marginTop: 18, marginBottom: 8, fontWeight: 500 }}>
              Is there any discrepancy in the results?
            </div>
            <button
              style={{ background: '#EF7F1A', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, marginRight: 10, cursor: 'pointer' }}
              onClick={() => setShowCorrection(true)}
            >
              Yes
            </button>
            <button
              style={{ background: theme.border, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 18px', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => setShowCorrection(false)}
            >
              No
            </button>
            {showCorrection && (
              <form onSubmit={handleCorrectionSubmit} style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label style={{ fontWeight: 500 }}>Corrected Priority</label>
                <select
                  value={correctedPriority}
                  onChange={e => setCorrectedPriority(e.target.value)}
                  style={{ padding: 7, borderRadius: 5, border: `1px solid ${theme.border}`, background: theme.cardBackground, color: theme.text }}
                  required
                >
                  <option value="" disabled>Select corrected priority</option>
                  {priorityOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <label style={{ fontWeight: 500 }}>Corrected Team</label>
                <select
                  value={correctedTeam}
                  onChange={e => setCorrectedTeam(e.target.value)}
                  style={{ padding: 7, borderRadius: 5, border: `1px solid ${theme.border}`, background: theme.cardBackground, color: theme.text }}
                  required
                >
                  <option value="" disabled>Select corrected team</option>
                  {teamOptions.map(opt => (
                    <option key={opt} value={opt}>{opt || 'None'}</option>
                  ))}
                </select>
                <button type="submit" style={{ background: '#EF7F1A', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, marginTop: 6, cursor: 'pointer' }}>
                  Submit Correction
                </button>
              </form>
            )}
          </div>
        )}
      </div>
      <div style={{ marginTop: 18, color: theme.copyright, fontSize: 12, textAlign: 'center', width: '100%' }}>
        &copy; {new Date().getFullYear()} ICICI Internship Project. All rights reserved.
      </div>
    </div>
  );
}

export default App;