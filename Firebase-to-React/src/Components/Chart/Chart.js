import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function Chart({
  timeStamp,
  timeData,
  data,
  dateData,
  name,
  DateTime,
}) {
  const series = [
    {
      name: name,
      data: data,
    },
  ];
  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: DateTime,
      title: {
        text: "Time and Date",
      },
    },
    yaxis: {
      title: {
        text: name,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <br />
      <h2>{name}</h2>
      <br />
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={350}
      />
      <br />
    </div>
  );
}
