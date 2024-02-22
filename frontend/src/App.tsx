import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MyComponent from './apiCall'; // Import your MyComponent

function App() {
  // State to control the visibility of MyComponent
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Edit <code>src/App.tsx</code> and save to reload.</p>
        <button onClick={() => setShowComponent(!showComponent)}>
          {/* This button toggles the display of MyComponent */}
          {showComponent ? 'Hide' : 'Show'} Message from Backend
        </button>
        {showComponent && <MyComponent />} {/* Conditionally render MyComponent */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
