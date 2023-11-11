import React, { useState } from 'react';
import axios from 'axios';

const SqlQueryInput = () => {
  const [sqlQuery, setSqlQuery] = useState('');

  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };

  const handleExecuteQuery = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/explain", {
      sql: sqlQuery
      });
      setSqlQueryResponse(response["data"][0][0]["Plan"])
    } catch (error) {
      console.error("Error executing SQL query:", error);
  
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  return (
    <div class="d-flex flex-column" style={{ width: '40vw'}}>
      <textarea
        class="form-control" 
        rows="5"
        placeholder="Enter your SQL query here..."
        value={sqlQuery}
        onChange={handleQueryChange}
      ></textarea>
      <div className="d-flex justify-content-end align-items-end">
        <button className="btn btn-info mt-2" onClick={handleExecuteQuery}>
          Execute Query
        </button>
      </div>
    </div>
  );
};

export default SqlQueryInput;
