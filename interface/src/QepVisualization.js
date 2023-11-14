import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const OrgChart = ({ data }) => {
  const sampleData = {
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
};

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

  const dataChart = renameKeys(sampleData);

  useEffect(() => {
    const chartDom = document.getElementById('orgChart');
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params) => {
          const data = params.data;
          return `Node Type: ${data.name}`;
        },
      },
      series: [
        {
          type: 'tree',
          id: 0,
          name: 'tree1',
          data: [dataChart],
          top: '10%',
          left: '8%',
          bottom: '22%',
          right: '20%',
          symbol: 'rect',
          symbolSize: 80,
          orient: 'vertical',
          edgeShape: 'polyline',
          edgeForkPosition: '63%',
          initialTreeDepth: -1,
          itemStyle:{
            color: '#5bc8ec'
          },
          lineStyle: {
            width: 2,
          },
          label: {
            position: 'inside',
            verticalAlign: 'middle',
            align: 'center',
            width: 80,
            fontSize: 16,
            overflow:'break'
          },
          leaves: {
            label: {
              position: 'inside',
              verticalAlign: 'middle',
              width: 100,
              align: 'center',
              fontSize: 16,
            },
            itemStyle:{
              color: '#0d566e'
            },
          },
          emphasis: {
            focus: 'descendant',
          },
          expandAndCollapse: false,
          animationDuration: 550,
          animationDurationUpdate: 750,
        },
      ],
    };
    option.series[0].data = [dataChart];
    myChart.setOption(option);

    // Clean up when component unmounts
    return () => {
      myChart.dispose();
    };
  }, [dataChart]);

  return <div id="orgChart" style={{ width: '100%', height: '100vh' }} />;
};

export default OrgChart;
