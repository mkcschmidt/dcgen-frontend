import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import MyChart from "./MyChart";

const Button = ({ text, isSelected, onClick }) => (
  <button onClick={onClick} className={`timeframe-button ${isSelected ? 'selected' : ''}`}>
    {text}
  </button>
);

const ChartSection = () => {

  const chartRef = useRef(null);

  const [timeFrame, setTimeFrame] = useState('3M');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const chartElement = chartRef.current;

    const preventScroll = (e) => {
      e.preventDefault();
    };

    if (chartElement) {
      chartElement.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      if (chartElement) {
        chartElement.removeEventListener('touchmove', preventScroll);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.dcgen.finance/timeSeries?timeframe=${timeFrame}`);
        setChartData(response.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [timeFrame]);

  const firstValue = chartData.length > 0 ? chartData[0][1] : 0;
  const lastValue = chartData.length > 0 ? chartData[chartData.length - 1][1] : 0;
  const difference = lastValue - firstValue;
  const percentChange = (difference / firstValue) * 100;
  const changeClass = percentChange >= 0 ? 'positive-percent' : 'negative-percent';

  return (
    <main className="container">
      <section className="content">
        <p className="overview">Overview</p>
        <hr className="horizontal-line" />
        <div className="info-container">
          <div>
            <h2 className="index-value">{lastValue.toFixed(2)}</h2>
            <p className="index-level">Index Level</p>
          </div>
          <div>
            <h2 className={`return-value ${changeClass}`}>{isNaN(percentChange) ? "---" : percentChange.toFixed(2)}%</h2>
            <p className="return">{timeFrame === 'MAX' ? "Overall" : timeFrame} Return</p>
          </div>
        </div>
      </section>
      <section className="chart">
        <div className="timeframe-buttons">
          <Button text="3M" isSelected={timeFrame === '3M'} onClick={() => setTimeFrame('3M')} />
          <Button text="6M" isSelected={timeFrame === '6M'} onClick={() => setTimeFrame('6M')} />
          <Button text="1Y" isSelected={timeFrame === '1Y'} onClick={() => setTimeFrame('1Y')} />
          <Button text="MAX" isSelected={timeFrame === 'MAX'} onClick={() => setTimeFrame('MAX')} />
        </div>
        <div>
          <MyChart className="chart-area" chartData={chartData} timeFrame={timeFrame} />
        </div>
      </section>
    </main>
  )
}

export default ChartSection;