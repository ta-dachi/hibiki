import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import "tailwindcss/tailwind.css";
import './App.scss';
import { DownloadForm } from './components/DownloadForm';


const Main = () => {
  return (
    <div>
      <div className="bg-gray-500 p-5 text-center text-sm">Tailwind</div>
      <div className="text-3xl font-bold underline">Test</div>
      <DownloadForm />
      <div>
        <button onClick={() => window.electron.ipcRenderer.myTest('Test')}>Test</button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
