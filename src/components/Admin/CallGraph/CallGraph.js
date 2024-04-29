import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './CallGraph.css';
import useCallsData from '../../../services/useCallsData';

const CallGraph = () => {
  const { calls } = useCallsData();
  const [chart, setChart] = useState(null);
  const [timeframe, setTimeframe] = useState('year');

  useEffect(() => {
    const ctx = document.getElementById('callChart');
    if (!ctx) return;

    const gradient = ctx.getContext('2d').createLinearGradient(500, 0, 0, 0);
    gradient.addColorStop(0, 'rgba(69, 120, 249, 1)');
    gradient.addColorStop(1, 'rgba(69, 120, 249, 0.3)');

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          borderColor: gradient,
          borderWidth: 5,
          pointRadius: 2,
          pointBorderWidth: 0,
          pointBackgroundColor: 'rgba(69, 120, 249, 1)',
          tension: 0.4
        }]
      },
      options: {
        scales: {
          x: {
            display: true,
            grid: {
              display: false,
            },
          },
          y: {
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              callback: (value) => {
                return formatDateLabel(value);
              }
            }
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (chart && chart.canvas) { 
      const filteredData = filterData(calls);
      const { labels, counts } = processChartData(filteredData);

      chart.data.labels = labels;
      chart.data.datasets[0].data = counts;
      chart.update();
    }
  }, [calls, chart]); 

  useEffect(() => {
    if (chart && chart.canvas) {
      const filteredData = filterData(calls);
      const { labels, counts } = processChartData(filteredData);

      chart.data.labels = labels;
      chart.data.datasets[0].data = counts;
      chart.update();
    }
  }, [timeframe]);

  const filterData = (callData) => {
    let startDate = new Date();
    switch (timeframe) {
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    const filteredData = callData.filter(call => new Date(call.initiatedTime) > startDate);
    return filteredData;
  };

  const processChartData = (callData) => {
    const aggregatedData = callData.reduce((acc, curr) => {
      const date = formatDate(new Date(curr.initiatedTime));
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const sortedData = Object.entries(aggregatedData)
      .sort(([date1], [date2]) => new Date(date1) - new Date(date2));

    const labels = sortedData.map(([date]) => date);
    const counts = sortedData.map(([_, count]) => count);

    return { labels, counts };
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const formatDate = (date) => {
    const options = { month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const formatDateLabel = (value) => {
    const date = new Date(value);
    const options = { month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className='calls-table' style={{ height: 'auto', width: '100%' }}>
      <div className='idk' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: "0" }}>Number of Calls Over Time</h2>
        <div className='drop-down'>
          <label>
            <select value={timeframe} onChange={handleTimeframeChange}>
              <option value="week">Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
          </label>
        </div>
      </div>
      <div className="chart-container">
        <div className="chart-wrapper">
          <canvas id="callChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default CallGraph;