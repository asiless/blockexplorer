import React from 'react';
import {getReceipt} from './blocks';
import { useState } from 'react';


export const Transaction = ( props ) => {

    const [t, setTransaction] = useState(props.transaction);
    const [r, setReceipt] = useState({});
    const [visible, setVisible] = useState(false);

    const handleClick = function() {

        if (Object.keys(r).length === 0) {
            getReceipt(t.hash)
            .then(r => {
              setReceipt(r);
            });  
        }

        setVisible(!visible);
    }  
    
    const Details = () => (
        <div>
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
            <div className='receipt'>
            {
                Object.keys(r).map((key, i) => (
                    <p key={i}>
                        <span className='key'>{key}:</span>
                        <span className='value'>{JSON.stringify(r[key], null, 4)}</span>
                    </p>
                ))    
            }            
            </div>
        </div>
    );

    return (
        <li className="transaction" onClick={handleClick}>
            {t.hash}
            {visible?<Details />:null}
        </li>
    )
 };
