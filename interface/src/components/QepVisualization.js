import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import Modal from 'react-modal';

const OrgChart = ({ data }) => {
  const [generalContent, setGeneralContent] = useState(null);
  const [intermediateContent, setIntermediateContent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [displayedBlocks, setDisplayedBlocks] = useState({
    start: 0,
    end: 100, // Initially display the first 100 blocks
  });

  const maxBlocksToRender = 100; // Maximum number of blocks to render
  
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
          const isScan = data.name.includes('Scan');
          if (blockAccessed && isScan) {
            return `Table Name: ${blockAccessed.tablename}
              <br> No. of Blocks Accessed: ${blockAccessed.blockaccessed.length}`;
          } 
          else if (isScan) {
            return `Table Name: ${data['Relation Name']}`;
          }
          else {
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
      const blockAccessed = data.blocksAccessed[0];
      console.log(blockAccessed)

      const handleLoadMore = () => {
        setDisplayedBlocks((prev) => ({
          start: prev.start + maxBlocksToRender,
          end: prev.end + maxBlocksToRender,
        }));
      };
    
      const handleLoadPrevious = () => {
        setDisplayedBlocks((prev) => ({
          start: Math.max(0, prev.start - maxBlocksToRender),
          end: Math.max(maxBlocksToRender, prev.end - maxBlocksToRender),
        }));
      };
    
      const handleJumpToStart = () => {
        setDisplayedBlocks({
          start: 0,
          end: maxBlocksToRender,
        });
      };

      var generalContent;

      const isScan = data.name.includes('Scan');
      const isJoin = data.name.includes('Join');
      const isSort = data.name.includes('Sort');
      
      if (isScan) {
        generalContent = (
          <div>
          <p>Relation Name: {data['Relation Name']}</p>
          {data['Index Name'] ? <p>Index Name: {data['Index Name']}</p> : null}
          {data['Index Cond'] ? <p>Index Condition: {data['Index Cond']}</p> : null}
          {data['Filter'] ? <p>Filter: {data['Filter']}</p> : null}
          <p>Startup Cost: {data['Startup Cost']}</p>
          <p>Total Cost: {data['Total Cost']}</p>
          <p>Startup Time: {data['Actual Startup Time']}</p>
          <p>Total Time: {data['Actual Total Time']}</p>
          <p>No. of Buffers: {data['Shared Hit Blocks']}</p>
          <p>Buffer Size: {data['Shared Hit Blocks']*8}</p>
          <p>Actual Rows: {data['Actual Rows']*8}</p>
          </div>);
      } else if(blockAccessed && isJoin) {
        generalContent = (
          <div>
          {data['Join Type'] ? <p>Join Type: {data['Join Type']}</p> : null}
          {data['Merge Cond'] ? <p>Join Cond: {data['Merge Cond']}</p> : null}
          {data['Hash Cond'] ? <p>Join Cond: {data['Hash Cond']}</p> : null}
          <p>Startup Cost: {data['Startup Cost']}</p>
          <p>Total Cost: {data['Total Cost']}</p>
          <p>Startup Time: {data['Actual Startup Time']}</p>
          <p>Total Time: {data['Actual Total Time']}</p>
          <p>No. of Buffers: {data['Shared Hit Blocks']}</p>
          <p>Buffer Size: {data['Shared Hit Blocks']*8}</p>
          <p>Actual Rows: {data['Actual Rows']*8}</p>
          </div>);
      } else if(blockAccessed && isSort) {
        generalContent = (
          <div>
          {data['Sort Key'] ? <p>Sort Key: {data['Sort Key']}</p> : null}
          {data['Sort Method'] ? <p>Sort Method: {data['Sort Method']}</p> : null}
          <p>Startup Cost: {data['Startup Cost']}</p>
          <p>Total Cost: {data['Total Cost']}</p>
          <p>Startup Time: {data['Actual Startup Time']}</p>
          <p>Total Time: {data['Actual Total Time']}</p>
          <p>No. of Buffers: {data['Shared Hit Blocks']}</p>
          <p>Buffer Size: {data['Shared Hit Blocks']*8}</p>
          <p>Actual Rows: {data['Actual Rows']*8}</p>
          </div>);
      } else if(data.name == 'Hash') {
        generalContent = (
          <div>
          {data['Hash Buckets'] ? <p>Hash Buckets: {data['Hash Buckets']}</p> : null}
          <p>Startup Cost: {data['Startup Cost']}</p>
          <p>Total Cost: {data['Total Cost']}</p>
          <p>Startup Time: {data['Actual Startup Time']}</p>
          <p>Total Time: {data['Actual Total Time']}</p>
          <p>No. of Buffers: {data['Shared Hit Blocks']}</p>
          <p>Buffer Size: {data['Shared Hit Blocks']*8}</p>
          <p>Actual Rows: {data['Actual Rows']*8}</p>
          </div>);
      } else {
        generalContent = (
          <div>
          <p>Startup Cost: {data['Startup Cost']}</p>
          <p>Total Cost: {data['Total Cost']}</p>
          <p>Startup Time: {data['Actual Startup Time']}</p>
          <p>Total Time: {data['Actual Total Time']}</p>
          <p>No. of Buffers: {data['Shared Hit Blocks']}</p>
          <p>Buffer Size: {data['Shared Hit Blocks']*8}</p>
          <p>Actual Rows: {data['Actual Rows']*8}</p>
          </div>);
      }

      const maxColumns = 3; // Maximum number of columns
      const columnWidth = 9 / maxColumns; // Column width calculation

      const intermediateResultsAvailable = data.blocksAccessed && data.blocksAccessed[0];
  
      const intermediateContent = intermediateResultsAvailable && (
        <div className={'container mt-4'}>
          <div className="d-flex justify-content-start" style={{ width: '45vw', height: '50vh', overflowY: 'auto' }}>
            <div className={`row row-cols-1 row-cols-md-${maxColumns} g-2`}>
              {blockAccessed.map((tableBlock) => {
                const { tablename, blockaccessed} = tableBlock;
                console.log(tablename)
                console.log("Check:",displayedBlocks.start)
                return blockaccessed.slice(displayedBlocks.start, displayedBlocks.end).map((blockInfo) => {
                  const { blocks, tuples } = blockInfo;
                  console.log("Blocks:",blocks)
                  console.log("Tuples:",tuples)
                  return (
                    <div className={`col-md-${columnWidth}`} key={`${tablename}-${blocks}`} style={{ width: '180px' }}>
                      <div className="card">
                        <div className="card-body">
                          <div className="text-center">
                            <h5 className="card-title">Table: {tablename}</h5>
                            <h7 className="card-title">Block Number: {blocks}</h7>
                          <div className="text-center">
                          <button
                            type="button"
                            className="btn btn-outline-info"
                            disabled ='true'
                            >
                              {tuples} Tuple{tuples !== '1' ? 's' : ''}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div>
                  );
                });
              })}
            </div>
            </div>
            <div className="text-center mt-3">
            <button
                type="button"
                className="btn btn-info mx-2"
                onClick={handleJumpToStart}
                disabled={displayedBlocks.start === 0}
              >
                Jump to Start
              </button>
              <button
                type="button"
                className="btn btn-info mx-2"
                onClick={handleLoadPrevious}
                disabled={displayedBlocks.start === 0}
              >
                Load Previous
              </button>
              <button
                type="button"
                className="btn btn-info mx-2"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
            </div>
      );

      setActiveTab('general');
      setGeneralContent(generalContent);
      setIntermediateContent(intermediateContent);
      setShowModal(true);
    });

    // Clean up when component unmounts
    return () => {
      myChart.dispose();
    };
  }, [dataChart,activeTab,displayedBlocks,displayedBlocks.start, displayedBlocks.end, maxBlocksToRender]);

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
            width: '45%', 
            height: '50%', 
            margin: 'auto', 
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', 
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
            {intermediateContent && (
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'intermediate' ? 'active' : ''}`}
                onClick={() => setActiveTab('intermediate')}
                role="button"
              >
                Blocks Accessed
              </a>
            </li>
          )}
          </ul>
          <div className="tab-content mt-2">
            <div className={`tab-pane ${activeTab === 'general' ? 'active' : ''}`}>
              {generalContent}
            </div>
            {intermediateContent && (
            <div className={`tab-pane ${activeTab === 'intermediate' ? 'active' : ''}`}>
              {intermediateContent}
            </div>
          )}
          </div>
          <button type="button" className="btn btn-outline-info mx-2" onClick={closeModal}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default OrgChart;
