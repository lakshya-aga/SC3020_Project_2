import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import 'bootstrap/dist/css/bootstrap.min.css';

// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
const sample1 = 
      {
              "Actual Loops": 1,
              "Actual Rows": 4,
              "Actual Startup Time": 2410.046,
              "Actual Total Time": 2417.213,
              "Async Capable": false,
              "Group Key": [
                  "lineitem.l_returnflag",
                  "lineitem.l_linestatus"
              ],
              "Local Dirtied Blocks": 0,
              "Local Hit Blocks": 0,
              "Local Read Blocks": 0,
              "Local Written Blocks": 0,
              "Node Type": "Aggregate",
              "Output": [
                  "l_returnflag",
                  "l_linestatus",
                  "sum(l_quantity)",
                  "sum(l_extendedprice)",
                  "sum((l_extendedprice * ('1'::numeric - l_discount)))",
                  "sum(((l_extendedprice * ('1'::numeric - l_discount)) * ('1'::numeric + l_tax)))",
                  "avg(l_quantity)",
                  "avg(l_extendedprice)",
                  "avg(l_discount)",
                  "count(*)"
              ],
              "Parallel Aware": false,
              "Partial Mode": "Finalize",
              "Plan Rows": 6,
              "Plan Width": 236,
              "Plans": [
                  {
                      "Actual Loops": 1,
                      "Actual Rows": 12,
                      "Actual Startup Time": 2409.939,
                      "Actual Total Time": 2417.065,
                      "Async Capable": false,
                      "Local Dirtied Blocks": 0,
                      "Local Hit Blocks": 0,
                      "Local Read Blocks": 0,
                      "Local Written Blocks": 0,
                      "Node Type": "Gather Merge",
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
                      "Parallel Aware": false,
                      "Parent Relationship": "Outer",
                      "Plan Rows": 12,
                      "Plan Width": 236,
                      "Plans": [
                          {
                              "Actual Loops": 3,
                              "Actual Rows": 4,
                              "Actual Startup Time": 2382.156,
                              "Actual Total Time": 2382.158,
                              "Async Capable": false,
                              "Local Dirtied Blocks": 0,
                              "Local Hit Blocks": 0,
                              "Local Read Blocks": 0,
                              "Local Written Blocks": 0,
                              "Node Type": "Sort",
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
                              "Parallel Aware": false,
                              "Parent Relationship": "Outer",
                              "Plan Rows": 6,
                              "Plan Width": 236,
                              "Plans": [
                                  {
                                      "Actual Loops": 3,
                                      "Actual Rows": 4,
                                      "Actual Startup Time": 2382.087,
                                      "Actual Total Time": 2382.096,
                                      "Async Capable": false,
                                      "Disk Usage": 0,
                                      "Group Key": [
                                          "lineitem.l_returnflag",
                                          "lineitem.l_linestatus"
                                      ],
                                      "HashAgg Batches": 1,
                                      "Local Dirtied Blocks": 0,
                                      "Local Hit Blocks": 0,
                                      "Local Read Blocks": 0,
                                      "Local Written Blocks": 0,
                                      "Node Type": "Aggregate",
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
                                      "Parallel Aware": false,
                                      "Parent Relationship": "Outer",
                                      "Partial Mode": "Partial",
                                      "Peak Memory Usage": 24,
                                      "Plan Rows": 6,
                                      "Plan Width": 236,
                                      "Planned Partitions": 0,
                                      "Plans": [
                                          {
                                              "Actual Loops": 3,
                                              "Actual Rows": 1706870,
                                              "Actual Startup Time": 13.11,
                                              "Actual Total Time": 633.932,
                                              "Alias": "lineitem",
                                              "Async Capable": false,
                                              "Filter": "(lineitem.l_shipdate <= '1997-10-14'::date)",
                                              "Local Dirtied Blocks": 0,
                                              "Local Hit Blocks": 0,
                                              "Local Read Blocks": 0,
                                              "Local Written Blocks": 0,
                                              "Node Type": "Seq Scan",
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
                                              "Parallel Aware": true,
                                              "Parent Relationship": "Outer",
                                              "Plan Rows": 2130558,
                                              "Plan Width": 25,
                                              "Relation Name": "lineitem",
                                              "Rows Removed by Filter": 293535,
                                              "Schema": "tpch1g",
                                              "Shared Dirtied Blocks": 0,
                                              "Shared Hit Blocks": 5537,
                                              "Shared Read Blocks": 107063,
                                              "Shared Written Blocks": 0,
                                              "Startup Cost": 0.0,
                                              "Temp Read Blocks": 0,
                                              "Temp Written Blocks": 0,
                                              "Total Cost": 143852.05,
                                              "Workers": [
                                                  {
                                                      "Actual Loops": 1,
                                                      "Actual Rows": 1697801,
                                                      "Actual Startup Time": 9.969,
                                                      "Actual Total Time": 623.99,
                                                      "Local Dirtied Blocks": 0,
                                                      "Local Hit Blocks": 0,
                                                      "Local Read Blocks": 0,
                                                      "Local Written Blocks": 0,
                                                      "Shared Dirtied Blocks": 0,
                                                      "Shared Hit Blocks": 1828,
                                                      "Shared Read Blocks": 35500,
                                                      "Shared Written Blocks": 0,
                                                      "Temp Read Blocks": 0,
                                                      "Temp Written Blocks": 0,
                                                      "Worker Number": 0
                                                  },
                                                  {
                                                      "Actual Loops": 1,
                                                      "Actual Rows": 1699654,
                                                      "Actual Startup Time": 9.942,
                                                      "Actual Total Time": 630.024,
                                                      "Local Dirtied Blocks": 0,
                                                      "Local Hit Blocks": 0,
                                                      "Local Read Blocks": 0,
                                                      "Local Written Blocks": 0,
                                                      "Shared Dirtied Blocks": 0,
                                                      "Shared Hit Blocks": 1870,
                                                      "Shared Read Blocks": 35503,
                                                      "Shared Written Blocks": 0,
                                                      "Temp Read Blocks": 0,
                                                      "Temp Written Blocks": 0,
                                                      "Worker Number": 1
                                                  }
                                              ]
                                          }
                                      ],
                                      "Shared Dirtied Blocks": 0,
                                      "Shared Hit Blocks": 5537,
                                      "Shared Read Blocks": 107063,
                                      "Shared Written Blocks": 0,
                                      "Startup Cost": 218421.58,
                                      "Strategy": "Hashed",
                                      "Temp Read Blocks": 0,
                                      "Temp Written Blocks": 0,
                                      "Total Cost": 218421.72,
                                      "Workers": [
                                          {
                                              "Actual Loops": 1,
                                              "Actual Rows": 4,
                                              "Actual Startup Time": 2368.741,
                                              "Actual Total Time": 2368.75,
                                              "Disk Usage": 0,
                                              "HashAgg Batches": 1,
                                              "Local Dirtied Blocks": 0,
                                              "Local Hit Blocks": 0,
                                              "Local Read Blocks": 0,
                                              "Local Written Blocks": 0,
                                              "Peak Memory Usage": 24,
                                              "Shared Dirtied Blocks": 0,
                                              "Shared Hit Blocks": 1828,
                                              "Shared Read Blocks": 35500,
                                              "Shared Written Blocks": 0,
                                              "Temp Read Blocks": 0,
                                              "Temp Written Blocks": 0,
                                              "Worker Number": 0
                                          },
                                          {
                                              "Actual Loops": 1,
                                              "Actual Rows": 4,
                                              "Actual Startup Time": 2368.742,
                                              "Actual Total Time": 2368.753,
                                              "Disk Usage": 0,
                                              "HashAgg Batches": 1,
                                              "Local Dirtied Blocks": 0,
                                              "Local Hit Blocks": 0,
                                              "Local Read Blocks": 0,
                                              "Local Written Blocks": 0,
                                              "Peak Memory Usage": 24,
                                              "Shared Dirtied Blocks": 0,
                                              "Shared Hit Blocks": 1870,
                                              "Shared Read Blocks": 35503,
                                              "Shared Written Blocks": 0,
                                              "Temp Read Blocks": 0,
                                              "Temp Written Blocks": 0,
                                              "Worker Number": 1
                                          }
                                      ]
                                  }
                              ],
                              "Shared Dirtied Blocks": 0,
                              "Shared Hit Blocks": 5551,
                              "Shared Read Blocks": 107063,
                              "Shared Written Blocks": 0,
                              "Sort Key": [
                                  "lineitem.l_returnflag",
                                  "lineitem.l_linestatus"
                              ],
                              "Sort Method": "quicksort",
                              "Sort Space Type": "Memory",
                              "Sort Space Used": 27,
                              "Startup Cost": 218421.79,
                              "Temp Read Blocks": 0,
                              "Temp Written Blocks": 0,
                              "Total Cost": 218421.81,
                              "Workers": [
                                  {
                                      "Actual Loops": 1,
                                      "Actual Rows": 4,
                                      "Actual Startup Time": 2368.811,
                                      "Actual Total Time": 2368.813,
                                      "JIT": {
                                          "Functions": 9,
                                          "Options": {
                                              "Deforming": true,
                                              "Expressions": true,
                                              "Inlining": false,
                                              "Optimization": false
                                          },
                                          "Timing": {
                                              "Emission": 9.518,
                                              "Generation": 0.811,
                                              "Inlining": 0.0,
                                              "Optimization": 0.417,
                                              "Total": 10.745
                                          }
                                      },
                                      "Local Dirtied Blocks": 0,
                                      "Local Hit Blocks": 0,
                                      "Local Read Blocks": 0,
                                      "Local Written Blocks": 0,
                                      "Shared Dirtied Blocks": 0,
                                      "Shared Hit Blocks": 1835,
                                      "Shared Read Blocks": 35500,
                                      "Shared Written Blocks": 0,
                                      "Sort Method": "quicksort",
                                      "Sort Space Type": "Memory",
                                      "Sort Space Used": 27,
                                      "Temp Read Blocks": 0,
                                      "Temp Written Blocks": 0,
                                      "Worker Number": 0
                                  },
                                  {
                                      "Actual Loops": 1,
                                      "Actual Rows": 4,
                                      "Actual Startup Time": 2368.788,
                                      "Actual Total Time": 2368.789,
                                      "JIT": {
                                          "Functions": 9,
                                          "Options": {
                                              "Deforming": true,
                                              "Expressions": true,
                                              "Inlining": false,
                                              "Optimization": false
                                          },
                                          "Timing": {
                                              "Emission": 9.494,
                                              "Generation": 0.914,
                                              "Inlining": 0.0,
                                              "Optimization": 0.407,
                                              "Total": 10.815
                                          }
                                      },
                                      "Local Dirtied Blocks": 0,
                                      "Local Hit Blocks": 0,
                                      "Local Read Blocks": 0,
                                      "Local Written Blocks": 0,
                                      "Shared Dirtied Blocks": 0,
                                      "Shared Hit Blocks": 1877,
                                      "Shared Read Blocks": 35503,
                                      "Shared Written Blocks": 0,
                                      "Sort Method": "quicksort",
                                      "Sort Space Type": "Memory",
                                      "Sort Space Used": 27,
                                      "Temp Read Blocks": 0,
                                      "Temp Written Blocks": 0,
                                      "Worker Number": 1
                                  }
                              ]
                          }
                      ],
                      "Shared Dirtied Blocks": 0,
                      "Shared Hit Blocks": 5551,
                      "Shared Read Blocks": 107063,
                      "Shared Written Blocks": 0,
                      "Startup Cost": 219421.82,
                      "Temp Read Blocks": 0,
                      "Temp Written Blocks": 0,
                      "Total Cost": 219423.22,
                      "Workers Launched": 2,
                      "Workers Planned": 2
                  }
              ],
              "Shared Dirtied Blocks": 0,
              "Shared Hit Blocks": 5551,
              "Shared Read Blocks": 107063,
              "Shared Written Blocks": 0,
              "Startup Cost": 219421.82,
              "Strategy": "Sorted",
              "Temp Read Blocks": 0,
              "Temp Written Blocks": 0,
              "Total Cost": 219423.77
          },
          "Planning": {
              "Local Dirtied Blocks": 0,
              "Local Hit Blocks": 0,
              "Local Read Blocks": 0,
              "Local Written Blocks": 0,
              "Shared Dirtied Blocks": 0,
              "Shared Hit Blocks": 160,
              "Shared Read Blocks": 0,
              "Shared Written Blocks": 0,
              "Temp Read Blocks": 0,
              "Temp Written Blocks": 0
          
          
      }

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

  var dataChart = renameKeys(sample1);
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