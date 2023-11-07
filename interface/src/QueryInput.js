import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SqlQueryInput from './components/QueryInput'; // Import the SqlQueryInput component
import OrgChartTree from './QepVisualization';
function Box() {

  const [sqlQueryResponse, setSqlQueryResponse] = useState(null);

  // A function to update the state with the response data
  const handleSqlQueryResponse = (response) => {
    setSqlQueryResponse(response);
  };
  return (
    <div className="container mt-5">
      <h4 className="mb-2">SQL Query Input</h4>
      <SqlQueryInput onSqlQueryResponse={handleSqlQueryResponse}/> 
      <OrgChartTree sample={sqlQueryResponse} /> 
    </div>
    
  );
}

export default Box;
