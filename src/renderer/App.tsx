import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import "tailwindcss/tailwind.css";
import './App.scss';
import { DownloadForm } from './components/DownloadForm';

const Main = () => {
  return (
    <div className="w-screen h-screen flex">
      {/* <div className="bg-gray-500 p-5 text-sm">Tailwind</div> */}
      <div className="m-auto">
        <DownloadForm classes="grow-1"/>
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
