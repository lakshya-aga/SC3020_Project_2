import React, { useState } from 'react';
import axios from 'axios';

const SqlQueryInput = ({ onReceiveJsonData }) => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [token, setToken] = useState(null);

  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };
  

  //
  const handleExecuteQuery = async (event) => {
    event.preventDefault();
    // TODO: Add backend credentials check and fetch profile info logic here
    try {
      const response = await axios.post("http://127.0.0.1:5000/explain", {
        sql: sqlQuery
      });





      if (response.statusText == "OK") {
        const data = await response.data;
        console.log('Token:', data.token);
        const jsonData = response.data[0][0].Plan;
        console.log(jsonData);
        onReceiveJsonData(jsonData);
      } else {
        // Handle login failure here (display error message, etc.)
        console.error('Failed');
      }
    } catch (error) {
      // Handle network errors or other exceptions here
      console.error('Error:', error);
    }
  };

  //
  // const handleExecuteQuery = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://127.0.0.1:5000/explain", {
  //       sql: sqlQuery
  //     });

  //     const jsonData = response.data[0][0].Plan;
  //     console.log(jsonData);
  //     onReceiveJsonData(jsonData);
  //   } catch (error) {
  //     console.error("Error executing SQL query:", error);

  //     if (error.response) {
  //       console.error("Error response:", error.response.data);
  //     }
  //   }
  // };

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
