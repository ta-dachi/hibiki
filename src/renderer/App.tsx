import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import "tailwindcss/tailwind.css";
import './App.scss';
import { DownloadForm } from './components/DownloadForm';
import { useState } from 'react';


const Main = () => {
  return (
    <div>
      {/* <div className="bg-gray-500 p-5 text-sm">Tailwind</div> */}
      <DownloadForm />
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
