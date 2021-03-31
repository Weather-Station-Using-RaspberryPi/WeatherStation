import React from 'react';
import { useState } from 'react';
import "./slidebar.css"
import '../App/App.css'
import {
    Link
  } from "react-router-dom";



export default props => {

  const [active, setActive] = useState(true);

  const ClickHandler = () => {
    let x = active;
    setActive(!x)
  }

  return (
    <div className="Team_Home">
      {active ? <div>
                <Link style={{textDecoration: 'none'}} onClick={ClickHandler} className="link" to="/about">Team</Link>    
                </div> :  <div>
                          <Link style={{textDecoration: 'none'}} onClick={ClickHandler} className="link" to="/">Home</Link>
                          </div> 
      }
      
    </div>
  );
};
