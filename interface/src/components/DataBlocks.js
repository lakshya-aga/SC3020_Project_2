import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataBlockModal = ({ show, onHide, blockInfo, tuplesql }) => {
  const { tablename, aliasname, blockNum } = blockInfo;
  const [tupleData, setTupleData] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call to fetch tuple information
        const response = await axios.post('http://127.0.0.1:5000/getBlockTuples', {
          tableName: tablename,
          aliasName: aliasname,
          blockNum: blockNum,
          sql: tuplesql,
        });

        if (response.statusText === 'OK') {
        
          setTupleData(response.data);
          console.log(response.data)
        } else {
          console.error('Failed to fetch tuple data');
        }
      } catch (error) {
        console.error('Error:', error);
      }finally {
        setLoading(false);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, [tablename, aliasname, blockNum, tuplesql]); 
  const modalDisplay = show ? 'block' : 'none';
  
  return (
    <div className="modal" style={{ display: modalDisplay }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center">Tuples in {aliasname}.{tablename}: Block {blockNum}</h5>
          </div>
          <div className="modal-body">
          {loading ? (
              <p>Loading...</p>
            ) : (
            <>
            <h5 className="modal-title text-center">List of Tuples</h5>
            <ul>
            {tupleData.flatMap((tupleArray) => (
                
                tupleArray.map((tuple) => (
                  <li key={tuple.tupleid} className="list-group-item">
                  {Object.keys(tuple)[1]} : {tuple[Object.keys(tuple)[1]]} 
                  </li>
                ))
              ))}
            </ul>
            </>
          )}
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-outline-info" onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Datablocks = ({ data }) => {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [displayedBlocks, setDisplayedBlocks] = useState({
    start: 0,
    end: 100, // Initially display the first 100 blocks
  });


  const tupleSQL = data.tupleSQL;

  const blocksAccessed = data.blocksAccessed[0];

  const maxColumns = 3; // Maximum number of columns
  const columnWidth = 12 / maxColumns; // column width calculation

  const [resetKey, setResetKey] = useState(0); 

  useEffect(() => {
  
    setDisplayedBlocks({
      start: 0,
      end: 100,
    });
    // Increment the reset key to trigger a re-render
    setResetKey((prevKey) => prevKey + 1);
  }, [tupleSQL]);

  const handleBlockClick = (tablename, aliasname, blockNum) => {
    // Set selected block and show modal
    console.log('Block Clicked:', tablename, aliasname, blockNum);
    setSelectedBlock({ tablename, aliasname, blockNum });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal and reset selected block
    setShowModal(false);
    setSelectedBlock(null);
  };

  const maxBlocksToRender = 100; // Maximum number of blocks to render
  
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
  
  
  var maxTuples = JSON.parse(sessionStorage.getItem('maxTuples'));
  
  return (
    <div key={resetKey} className={'container mt-4'}>
    <div className="d-flex justify-content-start" style={{ width: '40vw', height: '50vh', overflowY: 'auto' }}>
      <div className={`row row-cols-1 row-cols-md-${maxColumns} g-2`}>
        {blocksAccessed.map((tableBlock, index) => {
          const { tablename, blockaccessed,aliasname } = tableBlock;
          return blockaccessed.slice(displayedBlocks.start, displayedBlocks.end).map((blockInfo) => {
            const { blocks, tuples } = blockInfo;
            

            const fillPercentage = (tuples/ maxTuples[tablename]) * 100; // Calculate fill percentage
            return (
              <div className={`col-md-${columnWidth}`} key={`${tablename}-${blocks}`} style={{ width: '180px' }}>
                <div className="card">
                  <div className="card-body">
                    <div className="text-center">
                      <h5 className="card-title">Table: {tablename}</h5>
                      <h7 className="card-title">Block Number: {blocks}</h7>
                    </div>
                    <div className="progress" style={{ height: '20px', marginBottom: '10px' }}>
                      <div
                        className="progress-bar bg-info"
                        role="progressbar"
                        style={{ width: `${fillPercentage}%` }}
                        aria-valuenow={fillPercentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <div style={{ fontSize: 12.5}}>Block Capacity: {maxTuples[tablename]} Tuples</div>
                    <div className="text-center">
                    <button
                      type="button"
                      className="btn btn-outline-info"
                      onClick={() => handleBlockClick(tablename, aliasname, blocks)}
                      >
                        {tuples} Tuple{tuples !== '1' ? 's' : ''}
                      </button>
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
      {selectedBlock && (<DataBlockModal show={showModal} onHide={handleCloseModal} blockInfo={selectedBlock} tuplesql={tupleSQL}/>)}
    </div>
  );
};

export default Datablocks;

