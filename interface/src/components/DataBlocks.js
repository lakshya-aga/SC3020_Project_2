import React from 'react';

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


const Datablocks = () => {
    const maxColumns = 3; // Maximum number of columns
    const columnWidth = 12 / maxColumns; // Bootstrap column width calculation
  
    return (
      <div className="container mt-4" style={{ width: '40vw',height: '50vh', overflowY: 'auto'}}>
        <div className={`row row-cols-1 row-cols-md-${maxColumns} g-2`}>
          {Object.keys(data).map((blockId) => {
            const tuples = data[blockId];
            const fillPercentage = (tuples.length / 5) * 100; // Calculate fill percentage
            return (
              <div className={`col-md-${columnWidth}`} key={blockId}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Block {blockId}</h5>
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
                    <p className="card-text">
                      {tuples.length} Tuple{tuples.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default Datablocks;
