import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Dashboard from './components/Dashboard';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [monitoring, setMonitoring] = useState(false);
  const [preferences, setPreferences] = useState({
    selectedCountry: 'netherlands',
    selectedOffices: [],
    scanInterval: 300,
    notifications: {
      telegram: true,
      email: false,
      sound: true,
      volume: 80,
      emailAddress: ''
    }
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                monitoring={monitoring}
                setMonitoring={setMonitoring}
                preferences={preferences}
                setPreferences={setPreferences}
              />
            } 
          />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;