import React, { useState } from 'react';
import AgentPanel from './AgentPanel';
import './AgentStyles.css';

function AgentButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="agent-floating-button" onClick={() => setIsOpen(!isOpen)}>
        🤖
      </div>

      {isOpen && <AgentPanel onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default AgentButton;