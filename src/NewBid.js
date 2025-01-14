import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


function NewBid() {
  const location = useLocation();
  const { job_id } = location.state || {}; // Retrieve the job_id from the location state

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
    try {
      const response = await fetch('https://d183qnk2al6bfi.cloudfront.net/new_bid/fence_details', {
        method: 'POST',
        body: new URLSearchParams(formData)
      });
      const result = await response.json();
      console.log(result);
      navigate('/results', { state: { result } });
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
        <input
          type="text"
          name="fence_type"
          value={formData.fence_type}
          onChange={handleChange}
          placeholder="Fence Type"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="linear_feet"
          value={formData.linear_feet}
          onChange={handleChange}
          placeholder="Linear Feet"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="corner_posts"
          value={formData.corner_posts}
          onChange={handleChange}
          placeholder="Corner Post"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="end_posts"
          value={formData.end_posts}
          onChange={handleChange}
          placeholder="End Post"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="height"
          value={formData.height}
          onChange={handleChange}
          placeholder="Height"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="option_d"
          value={formData.option_d}
          onChange={handleChange}
          placeholder="Yes or No"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewBid;