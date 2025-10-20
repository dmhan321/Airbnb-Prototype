import React, { useState } from 'react';

const AgentButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Implement agent API call
      // For now, just simulate a response
      setTimeout(() => {
        setResponse('Agent service will be implemented with Python FastAPI and Langchain integration.');
        setLoading(false);
      }, 1000);
    } catch (error) {
      setResponse('Error: Agent service not available');
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Agent Button */}
      <button
        className="btn btn-primary position-fixed"
        style={{
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          zIndex: 1000
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        🤖
      </button>

      {/* Agent Panel */}
      {isOpen && (
        <div
          className="position-fixed"
          style={{
            bottom: '90px',
            right: '20px',
            width: '400px',
            height: '500px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1001,
            padding: '20px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>AI Concierge Agent</h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Ask me anything about your trip:</label>
              <textarea
                className="form-control"
                rows="3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'We're in NYC for 3 days, vegan, no long hikes, two kids'"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Thinking...' : 'Get Recommendations'}
            </button>
          </form>

          {response && (
            <div className="mt-3">
              <h6>Agent Response:</h6>
              <div className="alert alert-info">
                {response}
              </div>
            </div>
          )}

          <div className="mt-3">
            <h6>Quick Actions:</h6>
            <div className="d-grid gap-2">
              <button className="btn btn-outline-primary btn-sm">
                Weather Check
              </button>
              <button className="btn btn-outline-primary btn-sm">
                Restaurant Recommendations
              </button>
              <button className="btn btn-outline-primary btn-sm">
                Activity Suggestions
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgentButton;


