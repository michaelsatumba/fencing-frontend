import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, client_name, contact_info, job_address, job_scope } = location.state || {}; // Retrieve the result from the location state

  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/'); 
  };

  const formatLabel = (key) => {
    // Replace underscores with spaces, then capitalize the first letter
    const label = key.replace(/_/g, ' ');
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      
      <div className="flex flex-col space-y-4 mb-4">
      <h1 className="text-3xl font-bold">Results Page</h1>
        <div>
          <h2 className="text-xl">Client Information:</h2>
          <p>Client Name: {client_name}</p>
          <p>Contact Info: {contact_info}</p>
          <p>Job Address: {job_address}</p>
          <p>Job Scope: {job_scope}</p>
        </div>
        
        {result?.materials_needed && (
          <div>
            <h2 className="text-xl">Materials Needed:</h2>
            {Object.entries(result.materials_needed).map(([key, value]) => (
              <p key={key}>
                {formatLabel(key)}: {value}
              </p>
            ))}
          </div>
        )}

        <div>
          <h2 className="text-xl mb-2">Additional Notes:</h2>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes here..."
            className="bg-gray-800 text-white px-4 py-2 rounded"
          />
        </div>
      </div>
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Back to Home</button>
    </div>
  );
}

export default Results;