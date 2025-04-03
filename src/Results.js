import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

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
      const requestBody = { job_id, notes };
      console.log("Posting data:", requestBody); // Log the data being posted
  
      const response = await fetch('https://d183qnk2al6bfi.cloudfront.net/new_bid/add_notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(requestBody)
      });
  
      const newResult = await response.json();
      console.log("new result", newResult);
      alert('Notes submitted successfully');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit notes');
    }
  };

  const handleSaveAsWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("Client Information:"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Client Name: " + client_name),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Contact Info: " + contact_info),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Job Address: " + job_address),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Job Scope: " + job_scope),
              ],
            }),
            new Paragraph({ // Empty paragraph for line break
              children: [],
            }),
            new Paragraph({
              children: [
                new TextRun("Materials Needed:"),
              ],
            }),
            ...Object.entries(result.materials_needed).map(([key, value]) => 
              new Paragraph({
                children: [
                  new TextRun(`${formatLabel(key)}: ${value}`),
                ],
              })
            ),
            new Paragraph({ // Empty paragraph for line break
              children: [],
            }),
            new Paragraph({
              children: [
                new TextRun("Additional Notes:"),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun(notes),
              ],
            }),
          ],
        },
      ],
    });
  
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "result.docx");
    });
  };

  const handleSaveAsPDF = () => {
    const doc = new jsPDF();
    
    // Add Client Information
    doc.text('Client Information:', 10, 10);
    doc.text(`Client Name: ${client_name}`, 10, 20);
    doc.text(`Contact Info: ${contact_info}`, 10, 30);
    doc.text(`Job Address: ${job_address}`, 10, 40);
    doc.text(`Job Scope: ${job_scope}`, 10, 50);
  
    // Add a space before Materials Needed
    const materialsStartY = 70; // Adjusted y-coordinate for Materials Needed
    
    // Add Materials Needed
    doc.text('Materials Needed:', 10, materialsStartY);
    Object.entries(result.materials_needed).forEach(([key, value], index) => {
      doc.text(`${formatLabel(key)}: ${value}`, 10, materialsStartY + 10 + (index * 10));
    });
    
    // Add Additional Notes
    const materialsLength = Object.entries(result.materials_needed).length;
    const additionalNotesStartY = materialsStartY + 20 + (materialsLength * 10); // Adjusted y-coordinate for Additional Notes
    doc.text('Additional Notes:', 10, additionalNotesStartY);
    doc.text(notes, 10, additionalNotesStartY + 10);
    
    doc.save('results.pdf');
  };
  
  const formatLabel = (key) => {
    // Replace underscores with spaces, then capitalize the first letter
    const label = key.replace(/_/g, ' ');
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="bg-white text-black flex flex-col items-center justify-center min-h-screen">
      <img src="/logo512x512.png" alt="Logo" className="mb-4" />
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
          className="bg-gray-800 text-black px-4 py-2 rounded mb-2"
        />
      </div>

      </div>

      <div className="flex flex-col space-y-4 mb-4">
      <button onClick={handleNotesSubmit} className="bg-blue-500 text-black px-4 py-2 rounded">
          Submit Notes
        </button>
      <button onClick={handleSaveAsWord} className="bg-blue-500 text-black px-4 py-2 rounded">Save Job Spec as Word Doc</button>
      <button onClick={handleSaveAsPDF} className="bg-blue-500 text-black px-4 py-2 rounded">Save Job Spec as PDF</button>
      <button onClick={handleSubmit} className="bg-blue-500 text-black px-4 py-2 rounded">Back to Home</button>
      </div>

    </div>
  );
}

export default Results;