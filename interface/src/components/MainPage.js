import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SqlQueryInput from './QueryInput';
import DataBlocks from './DataBlocks';
import OrgChartTree from '../QepVisualization';

function MainPage() {
  const [jsonData, setJsonData] = useState('');

  const handleReceiveJsonData = (data) => {
    setJsonData(data);
  };

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column flex-md-row">
        <div className="col-md-7">
          <h4 className="mb-2">SQL Query Input</h4>
          <SqlQueryInput onReceiveJsonData={handleReceiveJsonData} />
          <h4 className="mb-2 mt-4">Blocks Accessed</h4>
          <DataBlocks />
        </div>
        <div className="col-md-4 mt-4 mt-md-0">
          <h4 className="mb-2">QEP Tree</h4>
          {<OrgChartTree data={jsonData} />}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
