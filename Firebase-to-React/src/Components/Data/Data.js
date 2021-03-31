import React, { Component } from "react";
import "../App/App.css";
import { db } from "../Firebase/firebase.js";
import { Link } from 'react-scroll';
import pressureImage from "../Assets/SVG/pressure-gauge.svg";
import TemperatureImage from "../Assets/SVG/heat.svg";
import HumidityImage from "../Assets/SVG/humidity.svg";
import PMten from "../Assets/SVG/pmArtboard 1.svg";
import PMtwofive from "../Assets/SVG/pmArtboard 1 copy.svg";
import Rain from "../Assets/SVG/raining.svg";
import Chart from "../Chart/Chart";
import { format } from 'date-fns';

export default class DataEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temperature: false,
      humidity: false,
      pressure: false,
      pmtwofive: false,
      pmten: false,
      weatherData: null,
      TimeStamp: null,
      TimeData: null,
      TemperatureData: null,
      DateData: null,
      HumidityData: null,
      PressureData: null,
      PMtwofiveData: null,
      PMtenData: null,
      DateTime: null,
      CSVdata: null,
      weatherAllData: null,
      scrollchart: false
    };
  }

  async componentDidMount() {
    console.log("mounted");
    let x = format(new Date(), 'dd/MM/yyyy')
    console.log(x)
    let y = x.toString();
    db.collection("WeatherData")
      .where("Date", "==", y)
      .get()
      .then((snapshot) => {
        var weather = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          weather.push(data);
        });
        let n = weather.length;
        const Sorted = weather.sort((a,b) => b.TimeStamp-a.TimeStamp);
        this.setState({
          ...this.state,
          weatherData: Sorted[0],
          weatherAllData: weather,

          TimeStamp: weather.map((data, index) => {
            return data.TimeStamp;
          }),
          TemperatureData: weather.map((data, index) => {
            return data.Temperature;
          }),
          TimeData: weather.map((data, index) => {
            return data.Time;
          }),
          DateData: weather.map((data, index) => {
            return data.Date;
          }),
          HumidityData: weather.map((data, index) => {
            return data.Humidity;
          }),
          PressureData: weather.map((data, index) => {
            return data.Pressure;
          }),
          PMtwofiveData: weather.map((data, index) => {
            return data.PMtwofive;
          }),
          PMtenData: weather.map((data, index) => {
            return data.PMten;
          }),
          CSVdata: weather.map((data, index) => {
            return [
              data.Date,
              data.Time,
              data.PMtwofive,
              data.PMten,
              data.Humidity,
              data.Temperature,
            ];
          }),
          DateTime: weather.map((data) => {
            var temp = `${data.Time} ${data.Date}`;
            return temp;
          }),
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    function TemperatureHandler() {
      let x = this.state.temperature;
      let y = this.state.scrollchart;
      this.setState({
        ...this.state,
        temperature: !x,
        scrollchart: !y
      });
    }

    function HumidityHandler() {
      let x = this.state.humidity;
      let y = this.state.scrollchart;
      this.setState({
        ...this.state,
        humidity: !x,
        scrollchart: !y
      });
    }

    function PressureHandler() {
      let x = this.state.pressure;
      let y = this.state.scrollchart;
      this.setState({
        ...this.state,
        pressure: !x,
        scrollchart: !y
      });
    }

    function PMtwofiveHandler() {
      let x = this.state.pmtwofive;
      let y = this.state.scrollchart;
      this.setState({
        ...this.state,
        pmtwofive: !x,
        scrollchart: !y
      });
    }

    function PMtenHandler() {
      let x = this.state.pmten;
      let y = this.state.scrollchart;
      this.setState({
        ...this.state,
        pmten: !x,
        scrollchart: !y
      });
    }

    return (
      <>
        <div className="App">
          {this.state.weatherData && (
            <button className="form transperant">
              <Link 
              onClick={TemperatureHandler.bind(this)}
              to='temperature'
              smooth={true}
              duration={1000}
              >
              <div>
                <img src={TemperatureImage} className="img"></img>
                <h1>Temperature</h1>
                <h1>{this.state.weatherData.Temperature} <i className="fas fa-circle fa-xs logo" ></i><span className="unit">c</span></h1>
              </div>
              </Link>
            </button>
          )}
          {this.state.weatherData && (
            <button className="form transperant">
              <Link
              onClick={HumidityHandler.bind(this)}
              to='humidity'
              smooth={true}
              duration={1000}
              >
              <div>
                <img src={HumidityImage} className="img"></img>
                <h1>Humidity</h1>
                <h1>{this.state.weatherData.Humidity.toFixed(2)}</h1>
              </div>
              </Link>
            </button>
          )}
          {this.state.weatherData && (
            <button className="form transperant">
              <Link
              onClick={PressureHandler.bind(this)}
              to='pressure'
              smooth={true}
              duration={1000}
              >
              <div>
                <img src={pressureImage} className="img"></img>
                <h1>Pressure</h1>
                <h1>{this.state.weatherData.Pressure.toFixed(2)} <span>hpa</span></h1>
              </div>
              </Link>
            </button>
          )}
          {this.state.weatherData && (
            <button className="form transperant">
              <div>
                <img src={Rain} className="img"></img>
                <h1>Rain</h1>
                <h1>{this.state.weatherData.Rain}</h1>
              </div>
            </button>
          )}
          {this.state.weatherData && (
            <button className="form transperant">
              <Link
              onClick={PMtwofiveHandler.bind(this)}
              to='pmtwofive'
              smooth={true}
              duration={1000}
              >
              <div>
                <img src={PMtwofive} className="img"></img>
                <h1>PM2.5</h1>
                <h1>{this.state.weatherData.PMtwofive}</h1>
              </div>
              </Link>
            </button>
          )}
          {this.state.weatherData && (
            <button className="form transperant">
              <Link
              onClick={PMtenHandler.bind(this)}
              to='pmten'
              smooth={true}
              duration={1000}
              >
              <div>
                <img src={PMten} className="img"></img>
                <h1>PM10</h1>
                <h1>{this.state.weatherData.PMten}</h1>
              </div>
              </Link>
            </button>
          )}
        </div>
        <div id='temperature'>
        {this.state.temperature ? (
          <Chart
            timeStamp={this.state.TimeStamp}
            timeData={this.state.TimeData}
            data={this.state.TemperatureData}
            dateData={this.state.DateData}
            name="Temperature"
            DateTime={this.state.DateTime}
          />
        ) : (
          <div></div>
        )}
        </div>
        <div id='humidity'>
        {this.state.humidity ? (
          <Chart
            timeStamp={this.state.TimeStamp}
            timeData={this.state.TimeData}
            data={this.state.HumidityData}
            dateData={this.state.DateData}
            name="Humidity"
            DateTime={this.state.DateTime}
          />
        ) : (
          <div></div>
        )}
        </div>
        <div id='pressure'>
        {this.state.pressure ? (
          <Chart
            timeStamp={this.state.TimeStamp}
            timeData={this.state.TimeData}
            data={this.state.PressureData}
            dateData={this.state.DateData}
            name="Pressure"
            DateTime={this.state.DateTime}
          />
        ) : (
          <div></div>
        )}
        </div>
        <div id='pmtwofive'>
        {this.state.pmtwofive ? (
          <Chart
            timeStamp={this.state.TimeStamp}
            timeData={this.state.TimeData}
            data={this.state.PMtwofiveData}
            dateData={this.state.DateData}
            name="PM2.5"
            DateTime={this.state.DateTime}
          />
        ) : (
          <div></div>
        )}
        </div>
        <div id='pmten'>
        {this.state.pmten ? (
          <Chart
            timeStamp={this.state.TimeStamp}
            timeData={this.state.TimeData}
            data={this.state.PMtenData}
            dateData={this.state.DateData}
            name="PM10"
            DateTime={this.state.DateTime}
          />
        ) : (
          <div></div>
        )}
        </div>
      </>
    );
  }
}
