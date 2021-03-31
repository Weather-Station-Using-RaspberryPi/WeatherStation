import React from 'react';
import '../App/App.css';
import NimishSir from '../Assets/IMG/Nimish Sir.jpeg';
import Maam from "../Assets/IMG/Ma'am.jpeg";
import Smith from '../Assets/IMG/Smith.jpg';
import Sunny from '../Assets/IMG/Sunny.jpg';
import Jimmy from '../Assets/IMG/Jimmy.jpg';
import Mohit from '../Assets/IMG/Mohit.jpg';
import RahulSir from '../Assets/IMG/Rahul Sir.jpg';
import Header from '../Header/Header';

export default function AboutUs() {
    return (
        <div className="MasterApp">
          <Header />
          <h1 className="about">Developed By</h1>
          <div className="photo">
            <button className="form transperant">
              <div className="card">
                <div>
                  <img src={Smith} className="smith" alt="user"/>
                </div>
                <div className="card-body">
                  <h3 className="smithName">Smith Chokshi</h3>
                </div>
              </div>
            </button>
            <button className="form transperant">
              <div className="card">
                <div>
                  <img src={Sunny} className="sunny" alt="user"/>
                </div>
                <div className="card-body">
                  <h3 className="sunnyName">Sunny Patel</h3>
                </div>
              </div>
            </button>
            <button className="form transperant">
              <div className="card">
                <div>
                  <img src={Jimmy} className="jimmy" alt="user"/>
                </div>
                <div className="card-body">
                  <h3 className="jimmyName">Jimmy Patel</h3>
                </div>
              </div>
            </button>
            <button className="form transperant">
              <div className="card">
                <div>
                  <img src={Mohit} className="mohit" alt="user"/>
                </div>
                <div className="card-body">
                  <h3 className="mohitName">Mohit Devpura</h3>
                </div>
              </div>
            </button>
          </div>
          <div>
            <h1 className="about">Guided By</h1>
            <div className="photo">
              <button className="form transperant">
                <div className="card">
                  <div>
                    <img src={NimishSir} className="nimish" alt="user"/>
                  </div>
                  <div className="card-body">
                    <h3 className="SirName">Prof Nimish Das</h3>
                  </div>
                </div>
              </button>
              <button className="form transperant">
                <div className="card">
                  <div>
                    <img src={Maam} className="card-img-top" alt="user"/>
                  </div>
                  <div className="card-body">
                    <h3 className="Name">Prof Janki Adhvaryu</h3>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div>
            <h1 className="about">Supported By</h1>
            <div className="photo">
              <button className="form transperant">
                <div className="card">
                  <div>
                    <img src={RahulSir} className="rahul" alt="user"/>
                  </div>
                  <div className="card-body">
                    <h3 className="rahulName">Prof Rahul Savaliya (Smart Lab)</h3>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
    )
}





