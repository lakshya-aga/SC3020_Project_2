import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SqlQueryInput from './QueryInput';
import DataBlocks from './DataBlocks';
import OrgChartTree from './QepVisualization';

function MainPage() {
  const [jsonData, setJsonData] = useState('');
 
  const handleReceiveJsonData = (data) => {
    setJsonData(data);
    scrollToTop();
  };

  const treeContainerRef = useRef(null);

  function scrollToTop() {
    if (treeContainerRef.current) {
      treeContainerRef.current.scrollTop = 0;
    }
  }

  return (
    <div className="container mt-3">
      <div className="d-flex flex-column flex-md-row">
        <div className="col-6 text-center">
          <h4 className="mb-2">SQL Query Input</h4>
          <SqlQueryInput onReceiveJsonData={handleReceiveJsonData} />
          <h4 className="mb-2 mt-2">Blocks Accessed</h4>
          {jsonData && <DataBlocks data={jsonData}/>}
        </div>
        <div className="col-md-7">
          <h4 className="mb-2 text-center">Query Execution Plan Tree</h4>
          <div ref={treeContainerRef} style={{ height: '620px', overflowY: 'auto', border: '1px solid #e9e9e9', borderRadius: '5px', padding: '10px' }}>
            {jsonData && <OrgChartTree data={jsonData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
