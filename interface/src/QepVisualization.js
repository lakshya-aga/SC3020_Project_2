import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import 'bootstrap/dist/css/bootstrap.min.css';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.

function renameKeys(json) {
  if (Array.isArray(json)) {
    return json.map(item => renameKeys(item));
  }
  else 
    if (typeof json === 'object') {
      const renamedObject = {};
      for (const key in json) {
        let newKey = key;
        if (key === 'Plan' || key === 'Plans') {
          newKey = 'children';
        } else if (key === 'Node Type') {
          newKey = 'name';
        }
        renamedObject[newKey] = renameKeys(json[key]);
      }
      return renamedObject;
  }
    else {
      return json;
  }
}

export default function OrgChartTree(sample) {

  var dataChart = renameKeys(sample);
  console.log(dataChart);
  const [clickedNode, setClickedNode] = useState(null);

  // Event handler for node click
  const handleNodeClick = (nodeData, evt) => {
    setClickedNode(nodeData);
    console.log('Clicked Node:', nodeData);
  };

  // Event handler for link click
  const handleLinkClick = (linkData, evt) => {
    console.log('Clicked Link:', linkData);
  };

  return (
    <div>
      <div id="treeWrapper" style={{
        alignItems: 'center',
        width: '1000vw',
        height: '1000vh',
      }}>
        <Tree 
          data={dataChart}
          orientation="vertical"
          translate={{ x: 100, y: 100 }}
          onClick={handleLinkClick} // Handle link clicks
          onNodeClick={handleNodeClick} // Handle node clicks
        />
      </div>
      <div>
        {clickedNode && (
          <pre>
            Clicked Node Data:
          </pre>
        )}
      </div>
    </div>
  );
}