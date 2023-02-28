import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);


function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState({ transactions:[]});
  const replacer = (k,v) => k=='transactions'?undefined:v;

  useEffect(() => {
    async function getBlockNumber() {
      let number = await alchemy.core.getBlockNumber()
      setBlockNumber(number);
      let last =await alchemy.core.getBlockWithTransactions(blockNumber);
      setBlock(last);
    }    

    getBlockNumber();
  });

  const handleClick = function(event) {
    event.currentTarget.classList.toggle('active');
  }  

  return (
    <div>
      <h2 className="App">Block Number: {blockNumber}</h2>
      <div className='block'>
        <h3>block:</h3>
        <div className="entries">
        {
          Object.keys(block).filter(replacer).map((key, i) => (
          <p key={i}>
            <span className='key'>{key}:</span>
            <span className='value'>{JSON.stringify(block[key], null, 4)}</span>
          </p>
          ))
        }
        </div>
      </div>     
      <div className='transactions'>
        <h3>transactions:</h3>
        {
          block.transactions.map((t, i) => (
          <div className="transaction" onClick={handleClick} key={i}>{t.hash}
            <div className="entries">
            {
              Object.keys(t).filter( k => t[k] && k != 'wait').map((key, i) => (
                <p key={i}>
                  <span className='key'>{key}:</span>
                  <span className='value'>{JSON.stringify(t[key], null, 4)}</span>
                </p>
              ))
            }
            </div>
          </div>
          ))
        }
      </div>      
    </div>
  );
}

export default App;