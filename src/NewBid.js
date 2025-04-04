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
    option_d: '',
    price_per_square_foot: '', // New field
    pricing_strategy: '', // New field
    material_prices: '', // New field
    daily_rate: '', // New field
    num_days: '', // New field
    num_employees: '' // New field
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
      // First POST request
      const response1 = await fetch('https://afc-proposal.onrender.com/new_bid/fence_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: formData.job_id,
          fence_type: formData.fence_type,
          linear_feet: formData.linear_feet,
          corner_posts: formData.corner_posts,
          end_posts: formData.end_posts,
          height: formData.height,
          option_d: formData.option_d,
        }),
      });

      const result1 = await response1.json();
      console.log("First POST result:", result1);

            // Second POST request
            const secondPostPayload = {
              job_id: formData.job_id,
              price_per_square_foot: parseFloat(formData.price_per_square_foot),
              pricing_strategy: formData.pricing_strategy,
              material_prices: formData.material_prices ? JSON.parse(formData.material_prices) : {},
              daily_rate: parseFloat(formData.daily_rate),
              num_days: parseInt(formData.num_days, 10),
              num_employees: parseInt(formData.num_employees, 10),
            };
      
            // console.log("Second POST payload:", secondPostPayload);
      
            const response2 = await fetch('https://afc-proposal.onrender.com/new_bid/cost_estimation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(secondPostPayload),
            });
      
            const result2 = await response2.json();
            console.log("Second POST result:", result2);

            console.log("formData:", formData);

      // Navigate to results page with both results
      navigate('/results', { state: { result1, result2, formData, client_name, contact_info, job_address, job_scope } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white text-black flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <img src="/logo512x512.png" alt="Logo" className="mb-4" />
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

        {/* New Inputs */}
        <input
          type="number"
          name="price_per_square_foot"
          value={formData.price_per_square_foot}
          onChange={handleChange}
          placeholder="Price Per Square Foot"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <select
          name="pricing_strategy"
          value={formData.pricing_strategy}
          onChange={handleChange}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          <option value="">Select Pricing Strategy</option>
          <option value="Master Halo Pricing">Master Halo Pricing</option>
          <option value="Fence Specialties Pricing">Fence Specialties Pricing</option>
        </select>
        <textarea
          name="material_prices"
          value={formData.material_prices}
          onChange={handleChange}
          placeholder="Material Prices (JSON format)"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        ></textarea>

        <input
          type="number"
          name="daily_rate"
          value={formData.daily_rate}
          onChange={handleChange}
          placeholder="Daily Rate"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
         <input
          type="number"
          name="num_days"
          value={formData.num_days}
          onChange={handleChange}
          placeholder="Number of Days"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
         <input
          type="number"
          name="num_employees"
          value={formData.num_employees}
          onChange={handleChange}
          placeholder="Number of Employees"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />

        <button type="submit" className="bg-blue-500 text-black px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewBid;