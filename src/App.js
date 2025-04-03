import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="bg-white text-black flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome Page!</h1>
      <Link to="/information">
        <button className="bg-blue-500 text-black px-4 py-2 rounded">Enter Info</button>
      </Link>
    </div>
  );
}

export default App;