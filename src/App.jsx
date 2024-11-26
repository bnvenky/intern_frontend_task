import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Positions from './components/Positions/Positions';
import Interviews from './components/Interviews';
import Assignments from './components/Assignments';
import Analytics from './components/Analytics';
import PositionDetails from './components/Positions/PositionDetails'; // Add this for the position details page
import Candidates from './components/Candidates/Candidates';


function NavbarWrapper() {
  const location = useLocation();
  return <Navbar currentView={location.pathname} />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavbarWrapper />
        <Routes>
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/analytics" element={<Analytics />} />
          {/*Candidates Routes*/}
          <Route path="/candidates" element={<Candidates />} />
          {/*Positons Routes*/}
          <Route path="/positions" element={<Positions />} />
          <Route path="/positions/:id" element={<PositionDetails />} /> {/* For position details */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;