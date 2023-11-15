import React, { useState } from 'react';

const data = [
    {'blocks': 1, 'tuples':43},
    {'blocks': 2, 'tuples':53},
    {'blocks': 3, 'tuples':53},
    {'blocks': 4, 'tuples':53},
    {'blocks': 5, 'tuples':53},
    {'blocks': 6, 'tuples':53},
];


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

const Datablocks = (passedData) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);  
  try{
    var data = passedData.passedData.blocksAccessed[0][0].blockaccessed;
    var sliceStart=0;
    var sliceEnd=100;
    data = data.slice(sliceStart, sliceEnd);

    const maxColumns = 56; // Maximum number of columns
    const columnWidth = 12 / maxColumns; // Bootstrap column width calculation
    

    const HandleBlockClick = (blockId) => {
      //set selected block and show modal
      console.log("Block Clicked:",blockId)
      setSelectedBlock(blockId);
      setShowModal(true);
    }

    const HandleCloseModal = () => {
      //close the modal and reset select block
      setShowModal('false');
      setSelectedBlock(null);
    }
  
    return (
      <div className="d-flex justify-content-start" style={{ width: '40vw', height: '50vh', overflowY: 'auto' }}>
        <div className={`row row-cols-1 row-cols-md-${maxColumns} g-2`}>
          {data.map((blockData) => {
            const tuples = blockData["tuples"];
            const blockId = blockData["blocks"];
            const fillPercentage = (tuples / 56) * 100; // Calculate fill percentage
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
                        {tuples} Tuple{tuples !== 1 ? 's' : ''}
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
    
   
    
}
catch (error){
  console.log(error);
}};
  
  export default Datablocks;
