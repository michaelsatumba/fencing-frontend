import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {}; // Retrieve the result from the location state

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/'); 
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Results Page</h1>
      {result && (
        <div className="mb-4">
          <h2 className="text-xl">Materials Needed:</h2>
          <pre className="bg-gray-800 text-white p-4 rounded">{JSON.stringify(result.materials_needed, null, 2)}</pre>
        </div>
      )}
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Back to Home</button>
    </div>
  );
}

export default Results;