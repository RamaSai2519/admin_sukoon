// ExpertGraph.js
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './ExpertGraph.css';
import { useCallsData, useExpertManagement } from '../../../services/useCallsData';

const ExpertGraph = () => {
  const { experts, fetchNewExperts } = useExpertManagement();
  const { calls } = useCallsData();
  const [chart, setChart] = useState(null);
  const [timeframe, setTimeframe] = useState('year');

  useEffect(() => {
    if (calls.length > 0 && experts.length > 0) {
      renderChart(calls, experts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, experts, timeframe]);

  const filterCallsByTimeframe = (callData) => {
    let startDate = new Date();
    switch (timeframe) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }
    return callData.filter(call => new Date(call.initiatedTime) > startDate);
  };

  const renderChart = (callData, expertData) => {
    const filteredCalls = filterCallsByTimeframe(callData);
    const successfulCalls = filteredCalls.filter(call => call.status === 'successful');

    const expertCalls = {};

    successfulCalls.forEach((call) => {
      const expertId = call.expert;
      const expert = expertData.find(expert => expert._id === expertId);
      if (expert) {
        const expertName = expert.name;
        expertCalls[expertName] = (expertCalls[expertName] || 0) + 1;
      }
    });

    const chartData = Object.entries(expertCalls);
    chartData.sort((a, b) => b[1] - a[1]);
    const labels = chartData.map((data) => data[0]);
    const counts = chartData.map((data) => data[1]);
    const ctx = document.getElementById('expertCallChart');

    if (chart) {
      chart.destroy();
    }

    if (ctx) {
      setChart(
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Number of Calls per Expert',
                data: counts,
                backgroundColor: 'rgba(69, 120, 249, 1)',
                borderColor: 'rgba(69, 120, 249, 1)',
                borderWidth: 0,
                borderRadius: 20,
                barPercentage: 0.7,
                categoryPercentage: 0.7,
                borderSkipped: false,
              },
            ],
          },
          options: {
            indexAxis: 'y',
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: false,
                },
              },
              y: {
                display: true,
                grid: {
                  display: false,
                },
              },
            },
          },

        })
      );
    }
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <div className="chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: "0" }}>Calls per Expert (Successful)</h2>
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
      <div className="chart-wrapper">
        <canvas id="expertCallChart"></canvas>
      </div>
    </div>
  );
};

export default ExpertGraph;
