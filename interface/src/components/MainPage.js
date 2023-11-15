import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SqlQueryInput from './QueryInput';
import DataBlocks from './DataBlocks';
import OrgChartTree from '../QepVisualization';

function MainPage() {
  const [jsonData, setJsonData] = useState('');
  const [blockData, setblockData] = useState(null);

  const handleReceiveJsonData = (data) => {
    setJsonData(data);
  };
  const handleClick = (data) => {
    console.log("RecievedOnMainPage");
    console.log(data);
    setblockData(data);
  };

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column flex-md-row">
        <div className="col-6 text-center">
          <h4 className="mb-2">SQL Query Input</h4>
          <SqlQueryInput onReceiveJsonData={handleReceiveJsonData} />
          <h4 className="mb-2 mt-4">Blocks Accessed</h4>
          <DataBlocks passedData={blockData} onClick={handleClick}/>
        </div>
        <div className="col-7 mt-4 text-center" style={{ width: '50%' }}>
          <h4 className="mb-2">QEP Tree</h4>
          {jsonData && <OrgChartTree data={jsonData} onClick={handleClick}/>}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
