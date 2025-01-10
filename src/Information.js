import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Information() {
  const [formData, setFormData] = useState({
    client_name: '',
    contact_info: '',
    job_address: '',
    job_scope: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('http://flaskexample-env.eba-aemar3mp.us-west-1.elasticbeanstalk.com/new_bid/job_details', {
  //       method: 'POST',
  //       body: new URLSearchParams(formData)
  //     });
  //     const result = await response.json();
  //     console.log(result);
  //     navigate('/new-bid');
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/new-bid'); 
  };

  return (
    <div className="bg-black text-white flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Information Page</h1>
        <input
          type="text"
          name="client_name"
          value={formData.client_name}
          onChange={handleChange}
          placeholder="Client Name"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
          placeholder="Contact Info"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="job_address"
          value={formData.job_address}
          onChange={handleChange}
          placeholder="Job Address"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <input
          type="text"
          name="job_scope"
          value={formData.job_scope}
          onChange={handleChange}
          placeholder="Job Scope"
          className="bg-gray-800 text-white px-4 py-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Information;