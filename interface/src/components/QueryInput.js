// SqlQueryInput.js
import React, { useState } from 'react';
import axios from 'axios';
import './LoadingScreen.css';

const SqlQueryInput = ({ onReceiveJsonData }) => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };

  const handleExecuteQuery = async (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when starting the query

    try {
      const response = await axios.post("http://127.0.0.1:5000/explain", {
        sql: sqlQuery
      });

      if (response.statusText === "OK") {
        const data = await response.data;
        const jsonData = response.data[0][0].Plan;
        console.log(jsonData)
        onReceiveJsonData(jsonData);
      } else {
        alert("Enter a valid query")
        console.error('Failed');
      }
    } catch (error) {
      alert("Enter a valid query")
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false when the query is complete
    }
  };

  return (
    <div className={`d-flex flex-column ${loading ? 'loading' : ''}`} style={{ width: '40vw' }}>
      <textarea
        className="form-control"
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
