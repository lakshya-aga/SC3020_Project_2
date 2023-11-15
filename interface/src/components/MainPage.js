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
        <div className="col-6 text-center">
          <h4 className="mb-2">SQL Query Input</h4>
          <SqlQueryInput onReceiveJsonData={handleReceiveJsonData} />
          <h4 className="mb-2 mt-4">Blocks Accessed</h4>
          {jsonData && <DataBlocks data={jsonData} />}
        </div>
        <div className="col-md-7">
          <h4 className="mb-2 text-center">QEP Tree</h4>
          <div style={{ height: '500px', overflowY: 'auto' }}>
            {jsonData && <OrgChartTree data={jsonData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
