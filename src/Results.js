
import { useNavigate } from 'react-router-dom';


function Results() {

  const navigate = useNavigate();


const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/'); 
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Results Page</h1>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Back to Home</button>
    </div>
  );
}

export default Results;