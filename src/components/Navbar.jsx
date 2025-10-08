import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartLine, FaHistory, FaRobot, FaBell, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <FaChartLine className="me-2 text-primary" />
          <span className="text-white">DICE</span>
          <span className="text-primary ms-1">Finance</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link d-flex align-items-center ${isActive('/')}`} 
                to="/"
              >
                <FaChartLine className="me-2" />
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link d-flex align-items-center ${isActive('/transactions')}`} 
                to="/transactions"
              >
                <FaHistory className="me-2" />
                Transactions
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link d-flex align-items-center ${isActive('/assistant')}`} 
                to="/assistant"
              >
                <FaRobot className="me-2" />
                AI Assistant
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <button 
                className="btn btn-outline-light btn-sm position-relative me-3" 
                data-bs-toggle="dropdown"
              >
                <FaBell />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  3
                </span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><h6 className="dropdown-header">Notifications</h6></li>
                <li><a className="dropdown-item" href="#"><small>Budget alert: 75% of travel budget used</small></a></li>
                <li><a className="dropdown-item" href="#"><small>New policy update available</small></a></li>
                <li><a className="dropdown-item" href="#"><small>Expense approved</small></a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-center" href="#">View all notifications</a></li>
              </ul>
            </li>
            <li className="nav-item">
              <span className="navbar-text d-flex align-items-center">
                <FaUser className="me-2" />
                <span>Welcome, <strong>Finance Manager</strong></span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
