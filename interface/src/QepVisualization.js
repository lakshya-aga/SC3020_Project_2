import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const OrgChart = ({ data, onClick }) => {
  
function renameKeys(json) {
  if (Array.isArray(json)) {
    return json.map(item => renameKeys(item));
  } else if (typeof json === 'object') {
    const renamedObject = {};
    for (const key in json) {
      if (key === 'Plans') {
        renamedObject['children'] = renameKeys(json[key]);
      } else if (key === 'Node Type') {
        renamedObject['name'] = json[key];
      } else {
        renamedObject[key] = renameKeys(json[key]);
      }
    }
    return renamedObject;
  } else {
    return json;
  }
}
  const dataChart = renameKeys(data);

  useEffect(() => {
    const chartDom = document.getElementById('orgChart');
    var blockAccessed;
    const myChart = echarts.init(chartDom);

    //Added onclick event listener
    myChart.on('click', (params) => {
      var clickedData = params.data;
      console.log(params.data);
      console.log("clicked");
      onClick(clickedData);
    }, [data]);

    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params) => {
          const data = params.data;
          if(data.blocksAccessed[0] && data.blocksAccessed[0][0])
          {blockAccessed = data.blocksAccessed ;}
          // if (blockAccessed) {
          //   return `Startup Cost: ${data['Startup Cost']} 
          //     <br> Total Cost: ${data['Total Cost']}
          //     <br> Table Name: ${blockAccessed[0][0].tablename}
          //     <br> No. of Blocks: ${(blockAccessed[0][0].blockaccessed.length)}`;
          // } else {
          //   return `Startup Cost: ${data['Startup Cost']} 
          //     <br> Total Cost: ${data['Total Cost']}`;
          // }
          var str = ""
          //Can Add a manual list of things to skip
          //notToInclude = ["Thing1", "Thing2"];
          for (var key in data)
          {
            var value = data[key];
            if(value.length>15 || (typeof value)==="object" /** || (notToInclude.includes(key)) */)
            continue;
            str = str + key + ": " + value + "<br>";
          }
          return str;
        },
      },
      series: [
        {
          type: 'tree',
          id: 0,
          name: 'tree1',
          data: [dataChart],
          top: '5%',
          left: '2%',
          bottom: '2%',
          right: '2%',
          symbol: 'rect',
          symbolSize: 60,
          orient: 'vertical',
          zoom: 1,
          edgeShape: 'polyline',
          edgeForkPosition: '100%',
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
            width: 60,
            fontSize: 12,
            overflow:'break'
          },
          leaves: {
            label: {
              position: 'inside',
              verticalAlign: 'middle',
              width: 100,
              align: 'center',
              fontSize: 12,
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
