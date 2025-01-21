import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


function NewBid() {
  const location = useLocation();
  const { job_id, client_name, contact_info, job_address, job_scope } = location.state || {}; // Retrieve the job_id from the location state

  const [formData, setFormData] = useState({
    job_id: job_id,
    fence_type: '',
    linear_feet: '',
    corner_posts: '',
    end_posts: '',
    height: '',
    option_d: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    try {
      const response = await fetch('https://d183qnk2al6bfi.cloudfront.net/new_bid/fence_details', {
        method: 'POST',
        body: new URLSearchParams(formData)
      });
      const result = await response.json();
      console.log("result", result);
      navigate('/results', { state: { result, client_name, contact_info, job_address, job_scope } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

// const handleSubmit = (e) => {
//     e.preventDefault();
//     navigate('/results'); 
//   };

  return (
    <div className="bg-black text-white flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">New Bid Page</h1>
        <select
          name="fence_type"
          value={formData.fence_type}
          onChange={handleChange}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          <option value="">Select Fence Type</option>
          <option value="chain link">Chain Link</option>
          <option value="wood">Wood</option>
          <option value="vinyl">Vinyl</option>
          <option value="sp wrought iron">SP Wrought Iron</option>
        </select>
        <input
          type="number"
          name="linear_feet"
          value={formData.linear_feet}
          onChange={handleChange}
          placeholder="Linear Feet"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="number"
          name="corner_posts"
          value={formData.corner_posts}
          onChange={handleChange}
          placeholder="Corner Post"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="number"
          name="end_posts"
          value={formData.end_posts}
          onChange={handleChange}
          placeholder="End Post"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Height"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <select
        name="option_d"
        value={formData.option_d}
        onChange={handleChange}
        className="bg-gray-800 text-white px-4 py-2 rounded"
      >
        <option value="">Top Rail?</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewBid;