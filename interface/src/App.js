import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SqlQueryInput from './components/QueryInput'; // Import the SqlQueryInput component

function App() {
  return (
    <div className="container mt-5">
      <h4 className="mb-2">SQL Query Input</h4>
      <SqlQueryInput /> 
    </div>
  );
}

export default App;
