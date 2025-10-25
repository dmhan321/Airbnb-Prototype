import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';

function AgentPanel({onClose}) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [travelerID, setTravelerID] = useState(null);

  // Fetch traveler profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        console.log("Loaded profile response:", profile);
        setTravelerID(profile.user.id);
      } catch (err) {
        console.error('Error fetching traveler profile:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:5001/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(data.reply || 'No response from agent.');
    } catch (err) {
      console.error(err);
      setResponse('Error querying the agent.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (mode) => {
    if (!travelerID) {
      setResponse('Traveler ID not loaded yet.');
      return;
    }

    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:5005/agent-button', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ traveler_id: travelerID, mode })
      });
      const data = await res.json();
      if (data.success) {
        setResponse(data.reply);
      } else {
        setResponse('Agent failed to respond.');
      }
    } catch (err) {
      console.error(err);
      setResponse('Error connecting to FastAPI agent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agent-panel">
      <div className="agent-header">
        <strong>AI Concierge Agent</strong>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>
      <div className="agent-body">
        <div className="mb-3">
          <label htmlFor="query" className="form-label">Ask something:</label>
          <textarea
            className="form-control"
            id="query"
            rows="3"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          ></textarea>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Thinking...' : 'Ask Agent'}
        </button>

        <hr />

        <h6>Quick Actions:</h6>
        <div className="d-grid gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => handleQuickAction('itinerary')}>
            Create day-to-day plan
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => handleQuickAction('activity')}>
            Activity recommendation
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => handleQuickAction('restaurant')}>
            Restaurant recommendation
          </button>
          <button className="btn btn-outline-primary btn-sm" onClick={() => handleQuickAction('packing')}>
            Packing checklist
          </button>
        </div>

        {response && (
          <div className="alert alert-info mt-3" role="alert">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}

export default AgentPanel;