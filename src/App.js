import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

function Navigator() {
  return (
    <Router>
      <div className='navigator'>
        <Link to="/">Last Block</Link>
        <Link to="/blocks">Blocks</Link>
        <Link to="/addresses">Addresses</Link>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/blocks">
            <Blocks />
          </Route>
          <Route path="/addresses">
            <Addresses />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}



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
      <h2>Last Block: {blockNumber}</h2>
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

function Blocks() {
  return (
    <div>
      <h2>Blocks</h2>
    </div>
  );
}

function Addresses() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  async function onChange(value) {
    console.log('VALUE =>', value);
    setAddress(value);
    let b = await alchemy.core.getBalance(value, 'latest');
    console.log('BALANCE =>', b);
    let n = Utils.formatEther(b);
    setBalance(n);  
    console.log('ETH =>', n);
  }

  return (
    <div className='addresses'>
      <h2>Addresses</h2>
      <form>
        <label>Enter the address:
          <input
            type="text" 
            value={address}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      </form>
      <span>{balance} eth</span>
    </div>
  )
}

export default Navigator;