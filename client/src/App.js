//import React
import React from 'react';
//routing done in MasterPage.js
import { BrowserRouter as Router } from 'react-router-dom';


//load the logo image into a variable
//import logo from './logo.svg';
//load the css here
import './App.css';

//import components
import { MasterPage } from './components/MasterPage';


function App() {
  return (
    <div className="App">
      <Router>
        <MasterPage />
      </Router>
    </div>
  );

}

export default App;
