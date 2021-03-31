import React, { Component } from "react";
import Data from "../Data/Data.js";
import Header from "../Header/Header";
import '../App/App.css';

export default class HomePage extends Component {
  render() {
    return (
      <div className="MasterApp">
        <Header></Header>
        <h1 className="Title">Weather Station</h1>
        <Data />
      </div>
    );
  }
}
