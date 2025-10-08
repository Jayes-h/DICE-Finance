import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionHistory from './components/TransactionHistory';
import AIAssistant from './components/AIAssistant';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container-fluid py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/assistant" element={<AIAssistant />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
