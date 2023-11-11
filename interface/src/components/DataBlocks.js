import React, { useState } from 'react';

const data = {
    20: [1, 2, 3],
	21: [4, 5, 6],
	22: [7, 8, 9],
	23: [10, 11, 12],
	24: [13, 14],
	25: [15, 16, 17, 18],
	26: [19],
	27: [20, 21, 22, 23, 24],
	28: [25, 26],
	29: [27, 28, 29],
	30: [30, 31, 32],
	31: [33, 34, 35, 36],
	32: [37],
	33: [38, 39, 40, 41],
	34: [42, 43],
	35: [44, 45, 46],
	36: [47, 48, 49, 50],
	37: [51, 52, 53],
	38: [54, 55, 56],
	39: [57, 58],
	40: [59, 60, 61, 62]
};


const DataBlockModal = ({show,onHide,blockId}) => {
  const modalDisplay = show ? 'block' : 'none';

  return (
    <div class='modal' style={{display:modalDisplay}}>
      <div class="modal-dialog modal-dialog-centered">
        <div class='modal-content'>
          <div class='modal-header border-0'>
            <h5 className="modal-title w-100 text-center">Tuples in Block {blockId}</h5>
          </div>
          <div class='modal-body'>
            <h5 class='modal-title'>List of Tuple IDs</h5>
          </div>
          <div class='modal-footer border-0'>
            <button type='button' class='btn btn-outline-info' onClick={onHide}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Datablocks = () => {
    const maxColumns = 3; // Maximum number of columns
    const columnWidth = 12 / maxColumns; // Bootstrap column width calculation

    const [showModal,setShowModal] = useState(false);
    const [selectedBlock,setSelectedBlock] = useState(null);

    const HandleBlockClick = (blockId) => {
      //set selected block and show modal
      console.log("Block Clicked:",blockId)
      setSelectedBlock(blockId);
      setShowModal(true);
    }

    const HandleCloseModal = () => {
      //close the modal and reset select block
      setShowModal(false);
      setSelectedBlock(null);
    }
  
    return (
      <div className="d-flex justify-content-start" style={{ width: '40vw', height: '50vh', overflowY: 'auto' }}>
        <div className={`row row-cols-1 row-cols-md-${maxColumns} g-2`}>
          {Object.keys(data).map((blockId) => {
            const tuples = data[blockId];
            const fillPercentage = (tuples.length / 5) * 100; // Calculate fill percentage
            return (
              <div className={`col-md-${columnWidth}`} key={blockId}>
                <div className="card">
                  <div className="card-body">
                    <div className="text-center">
                      <h5 className="card-title">Block {blockId}</h5>
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
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={() => HandleBlockClick(blockId)} // Pass the blockId to HandleBlockClick
                      >
                        {tuples.length} Tuple{tuples.length !== 1 ? 's' : ''}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {selectedBlock && (
          <DataBlockModal show={showModal} onHide={HandleCloseModal} blockId={selectedBlock} />
        )}
      </div>
    );
  };
  
  export default Datablocks;
