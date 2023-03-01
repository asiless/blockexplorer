import React from 'react';
import {getReceipt} from './blocks';
import { useState } from 'react';


export const Transaction = ( props ) => {

    const [t, setTransaction] = useState(props.transaction);
    const [visible, setVisible] = useState(false);

    const handleClick = function() {
        setVisible(!visible);
    }  
    
    const retieveReceipt = function() {
        getReceipt(t.hash)
          .then(r => {
                t.receipt = r;
                setTransaction(t);
                setVisible(visible);
          });
      }

    const Details = () => (
        <div className="entries">
        {
            Object.keys(t).filter( k => t[k] && k != 'wait').map((key, i) => (
            <p key={i}>
                <span className='key'>{key}:</span>
                <span className='value'>{JSON.stringify(t[key], null, 4)}</span>
            </p>
            ))
        }
        {!t.receipt?(<a className='value' href='#' onClick={retieveReceipt} id={t.hash}>see receipt</a>):null}
            
        </div>
    );

    return (
        <li className="transaction" onClick={handleClick}>
            {t.hash}
            {visible?<Details />:null}
        </li>
    )
 };
