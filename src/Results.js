import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, client_name, contact_info, job_address, job_scope } = location.state || {}; // Retrieve the result from the location state

  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/'); 
  };

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    try {
      const job_id = result.job_id;
      const response = await fetch('https://d183qnk2al6bfi.cloudfront.net/new_bid/add_notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ job_id, notes })
      });
      const newResult = await response.json();
      console.log("new result", newResult);
      alert('Notes submitted successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit notes');
    }
  };

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    
    // Add Client Information
    doc.text('Client Information:', 10, 10);
    doc.text(`Client Name: ${client_name}`, 10, 20);
    doc.text(`Contact Info: ${contact_info}`, 10, 30);
    doc.text(`Job Address: ${job_address}`, 10, 40);
    doc.text(`Job Scope: ${job_scope}`, 10, 50);
    
    // Add Materials Needed
    doc.text('Materials Needed:', 10, 60);
    Object.entries(result.materials_needed).forEach(([key, value], index) => {
      doc.text(`${formatLabel(key)}: ${value}`, 10, 70 + (index * 10));
    });
    
    // Add Additional Notes
    doc.text('Additional Notes:', 10, 80 + (Object.entries(result.materials_needed).length * 10));
    doc.text(notes, 10, 90 + (Object.entries(result.materials_needed).length * 10));
    
    doc.save('results.pdf');
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

      <div className="flex flex-col space-y-4">
        <h2 className="text-xl mb-2">Additional Notes:</h2>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes here..."
          className="bg-gray-800 text-white px-4 py-2 rounded mb-2"
        />
      </div>

      </div>

      <div className="flex flex-col space-y-4 mb-4">
      <button onClick={handleNotesSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Notes
        </button>
      <button onClick={handleSaveAsPDF} className="bg-blue-500 text-white px-4 py-2 rounded">Save as PDF</button>
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Back to Home</button>
      </div>

    </div>
  );
}

export default Results;