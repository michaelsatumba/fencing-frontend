import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result1, result2, formData, client_name, contact_info, job_address, job_scope } = location.state || {}; // Retrieve the result from the location state

  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/'); 
  };

  const handleNotesSubmit = async (e) => {
    e.preventDefault();
    try {
      const job_id = result1.job_id;
      const requestBody = { job_id, notes };
      console.log("Posting data:", requestBody); // Log the data being posted
  
      const response = await fetch('https://afc-proposal.onrender.com/new_bid/add_notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify(requestBody), // Convert requestBody to JSON string
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
            ...Object.entries(result1.materials_needed).map(([key, value]) => 
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
    const pageHeight = doc.internal.pageSize.height; // Get the page height
    let currentY = 10; // Start Y position for content

    // Add Client Information
    doc.text('Client Information:', 10, currentY);
    currentY += 10;
    doc.text(`Client Name: ${client_name}`, 10, currentY);
    currentY += 10;
    doc.text(`Contact Info: ${contact_info}`, 10, currentY);
    currentY += 10;
    doc.text(`Job Address: ${job_address}`, 10, currentY);
    currentY += 10;
    doc.text(`Job Scope: ${job_scope}`, 10, currentY);
    currentY += 20;

    // Add Detail Material Breakdown
    if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 10;
    }
    doc.text('Detail Material Breakdown:', 10, currentY);
    currentY += 10;

    // Add table headers with borders
    const startX = 5;
    const colWidths = [53, 30, 30, 30, 30, 30]; // Column widths
    const headers = ['Material', 'Quantity', 'Unit Size', 'Order Size', 'Unit Price', 'Total Cost'];

    let currentX = startX;
    headers.forEach((header, index) => {
        doc.text(header, currentX + 2, currentY); // Add some padding
        doc.rect(currentX, currentY - 8, colWidths[index], 10); // Draw header cell
        currentX += colWidths[index];
    });
    currentY += 10;

    // Add table rows with borders, alternating row colors, and pagination
    Object.entries(result2.costs.detailed_costs).forEach(([key, value], index) => {
        if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 10;

            // Re-add table headers on the new page
            currentX = startX;
            headers.forEach((header, index) => {
                doc.text(header, currentX + 2, currentY); // Add some padding
                doc.rect(currentX, currentY - 8, colWidths[index], 10); // Draw header cell
                currentX += colWidths[index];
            });
            currentY += 10;
        }

        currentX = startX;

        // Set alternating row background color
        if (index % 2 === 0) {
            doc.setFillColor(220, 220, 220); // Light gray color
            doc.rect(currentX, currentY - 8, colWidths.reduce((a, b) => a + b, 0), 10, 'F'); // Fill the row
        }

        const rowData = [
            formatLabel(key),
            value.quantity,
            value.unit_size,
            value.order_size,
            value.unit_price,
            value.total_cost,
        ];

        rowData.forEach((data, colIndex) => {
            doc.text(`${data}`, currentX + 2, currentY); // Add some padding
            doc.rect(currentX, currentY - 8, colWidths[colIndex], 10); // Draw cell border
            currentX += colWidths[colIndex];
        });
        currentY += 10;
    });

    // Add Material Total with borders
    if (currentY > pageHeight - 20) {
        doc.addPage();
        currentY = 10;
    }
    currentX = startX;
    const totalRow = ['Total Material Cost', '', '', '', '', `$${result2.costs.material_total.toFixed(2)}`];
    totalRow.forEach((data, colIndex) => {
        doc.text(`${data}`, currentX + 2, currentY); // Add some padding
        doc.rect(currentX, currentY - 8, colWidths[colIndex], 10); // Draw cell border
        currentX += colWidths[colIndex];
    });
    currentY += 10;

        // Add Labor Costs
        if (result2?.costs.labor_costs) {
          if (currentY > pageHeight - 20) {
              doc.addPage();
              currentY = 10;
          }
          doc.text('Labor Costs:', 10, currentY);
          currentY += 10;
  
          // Add labor costs table headers
          const laborHeaders = ['Labor Cost Per Day', 'Total Labor Cost'];
          const laborColWidths = [90, 90];
          currentX = startX;
          laborHeaders.forEach((header, index) => {
              doc.text(header, currentX + 2, currentY); // Add some padding
              doc.rect(currentX, currentY - 8, laborColWidths[index], 10); // Draw header cell
              currentX += laborColWidths[index];
          });
          currentY += 10;
  
          // Add labor costs row
          currentX = startX;
          const laborRow = [
              `$${result2.costs.labor_costs.labor_cost_per_day}`,
              `$${result2.costs.labor_costs.total_labor_cost}`,
          ];
          laborRow.forEach((data, colIndex) => {
              doc.text(data, currentX + 2, currentY); // Add some padding
              doc.rect(currentX, currentY - 8, laborColWidths[colIndex], 10); // Draw cell border
              currentX += laborColWidths[colIndex];
          });
          currentY += 20;
      }

// Add Grand Total
if (currentY > pageHeight - 20) {
  doc.addPage();
  currentY = 10;
}
doc.text('Grand Total:', 10, currentY); // Label at x = 10
doc.text(`$${result2.costs.total_cost.toFixed(2)}`, 70, currentY); // Value at x = 70
currentY += 20; // Add spacing after Grand Total

// Add Additional Notes
if (currentY > pageHeight - 20) {
  doc.addPage();
  currentY = 10;
}
doc.text('Additional Notes:', 10, currentY);
currentY += 10; // Move down for the notes content
doc.text(notes, 10, currentY);

    // Save the PDF
    doc.save('results.pdf');
};

const handleSaveAsPDFJobBid = () => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height; // Get the page height
  let currentY = 10; // Start Y position for content
  // Add Client Information
  doc.text('Client Information:', 10, currentY);
  currentY += 10;
  doc.text(`Proposal To: ${client_name}`, 10, currentY);
  currentY += 10;
  doc.text(`Contact Info: ${contact_info}`, 10, currentY);
  currentY += 10;
  doc.text(`Job Address: ${job_address}`, 10, currentY);
  currentY += 10;
  doc.text(`Job Scope: ${job_scope}`, 10, currentY);
  currentY += 20;
  
// Add Proposal Text
const proposalText = `${client_name}, American Fence Concepts appreciates the opportunity to offer the following proposal. We agree to perform the below stated work and hereby agree to fabricate, furnish, and install the described work in a professional and timely work-like manner. We look forward to doing business with you.`;

// Wrap the text to fit within the page width
const wrappedText = doc.splitTextToSize(proposalText, 180); // 180 is the width of the text area
doc.text(wrappedText, 10, currentY); // Add the wrapped text
currentY += wrappedText.length * 10; // Adjust Y position based on the number of lines


doc.text(`1. ${job_scope}`, 10, currentY);
currentY += 10;
// Wrap the long text to fit within the page width
const longText = `Furnish and install approximately ${formData.linear_feet} linear ft +/- of ${formData.height}' high galvanized chain-link fencing. All posts set in concrete footings 28" deep in mixed concrete. Includes ${result2.costs.materials_needed.terminal_posts} terminal posts, ${result2.costs.materials_needed.line_posts} line posts, with ${result2.costs.materials_needed.top_rail} top rail. All posts, rails, and fittings to be galvanized.`;
const wrappedLongText = doc.splitTextToSize(longText, 180); // 180 is the width of the text area
doc.text(wrappedLongText, 10, currentY); // Add the wrapped text
currentY += wrappedLongText.length * 10; // Adjust Y position based on the number of lines

doc.text(`Price per linear foot: $${result2.costs.square_footage_cost}`, 10, currentY);
currentY += 20;

doc.text(`Total Labor Cost: $${result2.costs.labor_costs.total_labor_cost}`, 10, currentY);
currentY += 20;

doc.text(`Total Cost: $${result2.costs.total_cost}`, 10, currentY);
currentY += 20;



  // Save the PDF
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
        
{result2?.costs.detailed_costs && (
  <div>
    <h2 className="text-xl mt-4">Detail Material Breakdown:</h2>
    <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Material</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Quantity</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Unit Size</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Order Size</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Unit Price</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Total Cost</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(result2.costs.detailed_costs).map(([key, value], index) => (
          <tr key={key} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
            <td className="border border-gray-400 px-4 py-2">{formatLabel(key)}</td>
            <td className="border border-gray-400 px-4 py-2">{value.quantity}</td>
            <td className="border border-gray-400 px-4 py-2">{value.unit_size}</td>
            <td className="border border-gray-400 px-4 py-2">{value.order_size}</td>
            <td className="border border-gray-400 px-4 py-2">{value.unit_price}</td>
            <td className="border border-gray-400 px-4 py-2">{value.total_cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="mt-4 text-right">
      <h3 className="text-lg font-bold">Total: ${result2.costs.material_total.toFixed(2)}</h3>
    </div>
  </div>
)}

{result2?.costs.labor_costs && (
  <div>
    <h2 className="text-xl mt-4">Labor Costs</h2>
    <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Labor Cost Per Day</th>
          <th className="border border-gray-400 px-4 py-2 text-left text-gray-700">Total Labor Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr className="bg-gray-100">
          <td className="border border-gray-400 px-4 py-2">${result2.costs.labor_costs.labor_cost_per_day}</td>
          <td className="border border-gray-400 px-4 py-2">${result2.costs.labor_costs.total_labor_cost}</td>
        </tr>
      </tbody>
    </table>
    <div className="mt-4 text-right">
      <h3 className="text-lg font-bold">Total: ${result2.costs.total_cost.toFixed(2)}</h3>
    </div>
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
      <button onClick={handleNotesSubmit} className="bg-blue-500 text-black px-4 py-2 rounded">
          Submit Notes
        </button>
      <button onClick={handleSaveAsWord} className="bg-blue-500 text-black px-4 py-2 rounded">Save Job Spec as Word Doc</button>
      <button onClick={handleSaveAsPDF} className="bg-blue-500 text-black px-4 py-2 rounded">Save Job Spec as PDF</button>
      <button onClick={handleSaveAsPDFJobBid} className="bg-blue-500 text-black px-4 py-2 rounded">Save Job Bid as PDF</button>
      <button onClick={handleSubmit} className="bg-blue-500 text-black px-4 py-2 rounded">Back to Home</button>
      </div>

    </div>
  );
}

export default Results;