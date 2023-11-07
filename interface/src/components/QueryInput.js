import React, { useState } from 'react';
import axios from 'axios';
import OrgChartTree from '../QepVisualization';

const SqlQueryInput = () => {
  const [sqlQuery, setSqlQuery] = useState('');

  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };



  const handleExecuteQuery = async (e) => {
    e.preventDefault();
    var data={'sql':sqlQuery}
    console.log( data);

    try {
      const response = await axios.post('http://localhost:5000/explain', data,{
        headers: {
          Authorization: `Token `,
        },
      });
      console.log('POST request response:', response.data);
    } catch (error) {
      console.error('POST request error:', error);
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
      <button className="btn btn-primary mt-2" onClick={handleExecuteQuery}>
        Execute Query
      </button>
    </div>
  );
};

export default SqlQueryInput;
