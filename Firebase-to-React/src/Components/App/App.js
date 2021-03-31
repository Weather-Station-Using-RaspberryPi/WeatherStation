import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomePage from "../HomePage/HomePage.js";
import About from '../AboutUs/AboutUs';
import Sidebar from '../Slider/Sidebar';
import "./App.css";
import "../Slider/slidebar.css"

export default class App extends Component {
  render() {
    return (
      <Router>
      <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      <div>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
    );
  }
}


