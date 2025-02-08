import './App.css'
import Navbar from './components/Navbar';
import DetectionSection from './components/DetectionSection';
import InfoSection from './components/InfoSection';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ReportPage from './pages/ReportPage.tsx'; // Make sure this file exists

function App() {
  return (
    <Router> 
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <div id="about">
              <InfoSection />
            </div>
            <DetectionSection />
          </>
        } />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </Router>
  );
}

export default App;
