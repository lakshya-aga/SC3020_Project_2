import React, { useState } from 'react';

const SqlQueryInput = () => {
  const [sqlQuery, setSqlQuery] = useState('');

  const handleQueryChange = (event) => {
    setSqlQuery(event.target.value);
  };

  const handleExecuteQuery = () => {
    console.log('Executing SQL query:', sqlQuery);
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
