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
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error executing SQL query:", error);
  
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };


  return (
    <div className="mb-3">
      <textarea
        className="form-control w-25"
        rows="5"
        placeholder="Enter your SQL query here..."
        value={sqlQuery}
        onChange={handleQueryChange}
      ></textarea>
      <button className="btn btn-info mt-2" onClick={handleExecuteQuery}>
        Execute Query
      </button>
    </div>
  );
};

export default SqlQueryInput;
