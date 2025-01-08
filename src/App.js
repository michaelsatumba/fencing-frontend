import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Hello World!</h1>
      <Link to="/new-bid">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">New Bid</button>
      </Link>
    </div>
  );
}

export default App;