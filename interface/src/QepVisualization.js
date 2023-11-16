import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import Modal from 'react-modal';

const OrgChart = ({ data }) => {
  const [generalContent, setGeneralContent] = useState(null);
  const [intermediateContent, setIntermediateContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
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
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params) => {
          const data = params.data;
          const blockAccessed = data.blocksAccessed && data.blocksAccessed[0] && data.blocksAccessed[0][0];

          if (blockAccessed) {
            return `Startup Cost: ${data['Startup Cost']} 
              <br> Total Cost: ${data['Total Cost']} 
              <br> Table Name: ${blockAccessed.tablename}
              <br> No. of Tuples: ${blockAccessed.blockaccessed && blockAccessed.blockaccessed[0] ? blockAccessed.blockaccessed[0].tuplecount : 'N/A'}`;
          } else {
            return `Startup Cost: ${data['Startup Cost']} 
              <br> Total Cost: ${data['Total Cost']}`;
          }
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
          edgeForkPosition: '20%',
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

    // Event listener for click on a node
    myChart.on('click', (params) => {
      const data = params.data;
      const blockAccessed = data.blocksAccessed && data.blocksAccessed[0] && data.blocksAccessed[0][0];

      const generalContent = (
        <div>
          <p>Startup Cost: {data['Startup Cost']}</p>
          <p>Total Cost: {data['Total Cost']}</p>
        </div>
      );

      const intermediateContent = (
        <div>
          <p>Table Name: {blockAccessed.tablename}</p>
          <p>No. of Tuples: {blockAccessed.blockaccessed && blockAccessed.blockaccessed[0] ? blockAccessed.blockaccessed[0].tuplecount : 'N/A'}</p>
        </div>
      );

      setGeneralContent(generalContent);
      setIntermediateContent(intermediateContent);
      setShowModal(true);
    });

    // Clean up when component unmounts
    return () => {
      myChart.dispose();
    };
  }, [dataChart, activeTab]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div id="orgChart" style={{ width: '100%', height: '200vh' }} />
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Node Information"
        style={{
          content: {
            width: '50%', // Adjust the width as needed
            height: '50%', // Adjust the height as needed
            margin: 'auto', // Center the modal horizontally
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the overlay background color and transparency
          },
        }}
      >
        <div>
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
                role="button"
              >
                General Statistics
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'intermediate' ? 'active' : ''}`}
                onClick={() => setActiveTab('intermediate')}
                role="button"
              >
                Intermediate Results
              </a>
            </li>
          </ul>
          <div className="tab-content mt-2">
            <div className={`tab-pane ${activeTab === 'general' ? 'active' : ''}`}>
              {generalContent}
            </div>
            <div className={`tab-pane ${activeTab === 'intermediate' ? 'active' : ''}`}>
              {intermediateContent}
            </div>
          </div>
          <button type="button" className="btn btn-info mx-2" onClick={closeModal}>
            Close Modal
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OrgChart;
