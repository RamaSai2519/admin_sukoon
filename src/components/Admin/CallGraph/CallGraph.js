// CallGraph.js
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import './CallGraph.css';

const CallGraph = () => {
  const [chart, setChart] = useState(null);
  const [timeframe, setTimeframe] = useState('year'); // Default timeframe is year

  useEffect(() => {
    const fetchData = async () => {
      try {
        const callData = await fetchCallData();
        const filteredData = filterData(callData);
        renderChart(filteredData);
      } catch (error) {
        console.error('Error fetching call data:', error);
      }
    };

    fetchData();

    return () => {
      if (chart) {
        chart.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe]); // Ignoring the missing dependencies warning

  const fetchCallData = async () => {
    try {
      const response = await fetch('http://15.206.127.248/api/calls');
      if (!response.ok) {
        throw new Error('Failed to fetch call data');
      }
      const callData = await response.json();
      return callData;
    } catch (error) {
      console.error('Error fetching call data:', error);
      return [];
    }
  };

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

  const renderChart = (callData) => {
    const aggregatedData = callData.reduce((acc, curr) => {
      // Custom date formatting to show only day and month
      const date = formatDate(new Date(curr.initiatedTime));
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Sort the aggregated data by date
    const sortedData = Object.entries(aggregatedData)
      .sort(([date1], [date2]) => new Date(date1) - new Date(date2));

    const labels = sortedData.map(([date]) => date);
    const counts = sortedData.map(([_, count]) => count);

    const ctx = document.getElementById('callChart');

    if (chart) {
      chart.destroy();
    }

    if (ctx) {
      const gradient = ctx.getContext('2d').createLinearGradient(500, 0, 0, 0);
      gradient.addColorStop(0, 'rgba(69, 120, 249, 1)');
      gradient.addColorStop(1, 'rgba(69, 120, 249, 0.3)');

      setChart(new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            data: counts,
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
                callback: (value, index, values) => {
                  // Custom callback to format y-axis labels
                  return formatDateLabel(value);
                }
              }
            },
          },
          plugins: {
            legend: {
              display: false, // Hide legend
            },
          },
        },
      }));

      chart.update();
    }
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  // Custom date formatting function to show only day and month
  const formatDate = (date) => {
    const options = { month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Custom callback function for y-axis label formatting
  const formatDateLabel = (value) => {
    const date = new Date(value);
    const options = { month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className='calls-table' style={{ height: 'auto', width: '100%' }}>
      <div className='idk' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Number of Calls Over Time</h2>
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
      <div className='call-chart'>
        <canvas id="callChart"></canvas>
      </div>
    </div>
  );
};

export default CallGraph;