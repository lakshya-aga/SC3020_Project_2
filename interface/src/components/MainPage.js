import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SqlQueryInput from './QueryInput'; // Import the SqlQueryInput component
import DataBlocks from './DataBlocks';
import OrgChartTree from '../QepVisualization';


function MainPage() {
  const [jsonData, setJsonData] = useState('');

  const handleReceiveJsonData = (data) => {
    setJsonData(data);
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-2">SQL Query Input</h4>
      <SqlQueryInput onReceiveJsonData={handleReceiveJsonData} /> 
      <h4 className="mb-2">Blocks Accessed</h4>
      <DataBlocks />
    </div>
    
  );
}

export default MainPage