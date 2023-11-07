import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import 'bootstrap/dist/css/bootstrap.min.css';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const sample = {
      "Node Type": "Aggregate",
      
      "Plans": [
          {
              "Node Type": "Gather Merge",
              "Parent Relationship": "Outer",
              
              "Output": [
                  "l_returnflag",
                  "l_linestatus",
                  "(PARTIAL sum(l_quantity))",
                  "(PARTIAL sum(l_extendedprice))",
                  "(PARTIAL sum((l_extendedprice * ('1'::numeric - l_discount))))",
                  "(PARTIAL sum(((l_extendedprice * ('1'::numeric - l_discount)) * ('1'::numeric + l_tax))))",
                  "(PARTIAL avg(l_quantity))",
                  "(PARTIAL avg(l_extendedprice))",
                  "(PARTIAL avg(l_discount))",
                  "(PARTIAL count(*))"
              ],
              
              "Plans": [
                  {
                      "Node Type": "Sort",
                      "Parent Relationship": "Outer",
                      
                      "Output": [
                          "l_returnflag",
                          "l_linestatus",
                          "(PARTIAL sum(l_quantity))",
                          "(PARTIAL sum(l_extendedprice))",
                          "(PARTIAL sum((l_extendedprice * ('1'::numeric - l_discount))))",
                          "(PARTIAL sum(((l_extendedprice * ('1'::numeric - l_discount)) * ('1'::numeric + l_tax))))",
                          "(PARTIAL avg(l_quantity))",
                          "(PARTIAL avg(l_extendedprice))",
                          "(PARTIAL avg(l_discount))",
                          "(PARTIAL count(*))"
                      ],
                      "Sort Key": [
                          "lineitem.l_returnflag",
                          "lineitem.l_linestatus"
                      ],
                      "Sort Method": "quicksort",
                      
                      
                      "Plans": [
                          {
                              "Node Type": "Aggregate",
                              "Strategy": "Hashed",
                              
                              "Output": [
                                  "l_returnflag",
                                  "l_linestatus",
                                  "PARTIAL sum(l_quantity)",
                                  "PARTIAL sum(l_extendedprice)",
                                  "PARTIAL sum((l_extendedprice * ('1'::numeric - l_discount)))",
                                  "PARTIAL sum(((l_extendedprice * ('1'::numeric - l_discount)) * ('1'::numeric + l_tax)))",
                                  "PARTIAL avg(l_quantity)",
                                  "PARTIAL avg(l_extendedprice)",
                                  "PARTIAL avg(l_discount)",
                                  "PARTIAL count(*)"
                              ],
                              "Group Key": [
                                  "lineitem.l_returnflag",
                                  "lineitem.l_linestatus"
                              ],
                              
                              "Plans": [
                                  {
                                      "Node Type": "Seq Scan",
                                      "Parent Relationship": "Outer",
                                      
                                      "Output": [
                                          "l_orderkey",
                                          "l_partkey",
                                          "l_suppkey",
                                          "l_linenumber",
                                          "l_quantity",
                                          "l_extendedprice",
                                          "l_discount",
                                          "l_tax",
                                          "l_returnflag",
                                          "l_linestatus",
                                          "l_shipdate",
                                          "l_commitdate",
                                          "l_receiptdate",
                                          "l_shipinstruct",
                                          "l_shipmode",
                                          "l_comment"
                                      ],
                                      "Filter": "(lineitem.l_shipdate <= '1997-10-14'::date)"
                                      
                                  }
                              ]
                          }
                      ]
                  }
              ]
          }
      ]
  }
  



function renameKeys(json) {
  if (Array.isArray(json)) {
    return json.map(item => renameKeys(item));
  } else if (typeof json === 'object') {
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
  } else {
    return json;
  }
}
var dataChart = renameKeys(sample);

export default function OrgChartTree() {
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
