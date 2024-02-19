import React, { useState } from 'react';
import './App.css';
import MyComponent from './apiCall';

function App() {
  // State to manage the visibility of MyComponent
  const [showComponent, setShowComponent] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setShowComponent(true)}>Load Data</button>
      {showComponent && <MyComponent />}
    </div>
  );
}

export default App;
