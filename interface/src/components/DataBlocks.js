import React, { useState } from 'react';

const DataBlockModal = ({ show, onHide, blockId }) => {
  const modalDisplay = show ? 'block' : 'none';

  return (
    <div className="modal" style={{ display: modalDisplay }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center">Tuples in Block {blockId}</h5>
          </div>
          <div className="modal-body">
            <h5 className="modal-title">List of Tuple IDs</h5>
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
  // Set up state hooks outside any condition or loop
  const [showModal, setShowModal] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const blocksAccessed = data.blocksAccessed[0];
  console.log(blocksAccessed)

  const maxColumns = 3; // Maximum number of columns
  const columnWidth = 18 / maxColumns; // Bootstrap column width calculation

  const handleBlockClick = (blockId) => {
    // Set selected block and show modal
    console.log('Block Clicked:', blockId);
    setSelectedBlock(blockId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal and reset selected block
    setShowModal(false);
    setSelectedBlock(null);
  };

  return (
    <div className="d-flex justify-content-start" style={{ width: '40vw', height: '50vh', overflowY: 'auto' }}>
      <div className={`row row-cols-1 row-cols-md-${maxColumns} g-2`}>
        {blocksAccessed.map((tableBlock, index) => {
          const { tablename, blockaccessed } = tableBlock;
          console.log(blockaccessed)
          return blockaccessed.map((blockInfo) => {
            const { blocks, tuples } = blockInfo;
            console.log(blocks)
            console.log(tuples)
            const fillPercentage = (tuples/ 50) * 100; // Calculate fill percentage
            return (
              <div className={`col-md-${columnWidth}`} key={`${tablename}-${blocks}`}>
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
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-info"
                        onClick={() => handleBlockClick(blocks)}
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
      {selectedBlock && <DataBlockModal show={showModal} onHide={handleCloseModal} blockId={selectedBlock} />}
    </div>
  );
};

export default Datablocks;

