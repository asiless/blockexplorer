import { useEffect, useState } from 'react';
import './App.css';
import {getBalance, getBlock} from './blocks';
import {Transaction} from './Transaction';

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

export function Navigator() {
  return (
    <Router>
      <div className='navigator'>
        <Link to="/">Last Block</Link>
        <Link to="/addresses">Addresses</Link>
        <Switch>
          <Route exact path="/">
            <LastBlock />
          </Route>
          <Route path="/addresses">
            <Addresses />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export function LastBlock() {
  const [block, setBlock] = useState({ transactions:[]});
  const replacer = (k) => k!=='transactions';
  

  useEffect(() => {
    getBlock(null).then( last => {
      setBlock(last);
  })}, []);

  const navigateBlock = function(event) {
    getBlock(event.currentTarget.id).then(b=>setBlock(b));
  }

  return (
    <div>
      <h2>Last Block: {block.number}</h2>
      <div className='block'>
        <h3>block:</h3>
        <div className="entries">
        {
          Object.keys(block).filter(replacer).map((key, i) => 
          (
          <p key={i}>
            <span className='key'>{key}:</span>
            {
              key==='parentHash'?(<a className='value' href='#' onClick={navigateBlock} id={block[key]}>{JSON.stringify(block[key], null, 4)}</a>):(<span className='value'>{JSON.stringify(block[key], null, 4)}</span>)
            }
          </p>
          ))
        }
        </div>
      </div>     
      <div className='transactions'>
        <h3>transactions:</h3>
          <ul>
        {
          block.transactions.map((t,i) => (<Transaction transaction={t} key={i}/>))
        }
          </ul>
      </div>      
    </div>
  );
}

export function Addresses() {

  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);

  async function onChange(value) {
    setAddress(value);
    let b = await getBalance(value);
    setBalance(b);  
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