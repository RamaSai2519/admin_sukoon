import Chart from 'chart.js/auto';
import React, { useEffect, useState } from 'react';
import { strToDate } from '../../Utils/formatHelper';
import { useCalls, useExperts } from '../../contexts/useData';

const ExpertGraph = () => {
  const { calls } = useCalls();
  const { experts } = useExperts();
  const [chart, setChart] = useState(null);
  const [timeframe, setTimeframe] = useState('year');
  const [type, setType] = useState('all');
  const [representation, setRepresentation] = useState('absolute');

  useEffect(() => {
    renderChart(calls, experts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, experts, timeframe, type, representation]);

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
    return callData.filter(call => strToDate(call.initiatedTime) > startDate);
  };

  const filterCallsByType = (filteredData) => {
    switch (type) {
      case 'successful':
        return filteredData.filter(call => call.status === 'successful');
      case 'inadequate':
        return filteredData.filter(call => call.status === 'inadequate');
      case 'failed':
        return filteredData.filter(call => call.status === 'failed');
      case 'missed':
        return filteredData.filter(call => call.status === 'missed');
      case 'all':
      default:
        return filteredData;
    }
  };

  const renderChart = (callData, expertData) => {
    const filteredCalls = filterCallsByTimeframe(callData);
    const filteredCallsByType = filterCallsByType(filteredCalls);

    const expertCalls = {};

    filteredCallsByType.forEach((call) => {
      const expertId = call.expert;
      const expert = expertData.find(expert => expert._id === expertId);
      if (expert) {
        const expertName = expert.name;
        expertCalls[expertName] = (expertCalls[expertName] || 0) + 1;
      }
    });

    const totalCalls = Object.values(expertCalls).reduce((acc, val) => acc + val, 0);
    const chartData = Object.entries(expertCalls);
    chartData.sort((a, b) => b[1] - a[1]);
    const labels = chartData.map((data) => data[0]);
    const counts = chartData.map((data) => data[1]);

    const dataValues = representation === 'percentage'
      ? counts.map(count => (count / totalCalls * 100).toFixed(2))
      : counts;

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
                label: representation === 'percentage' ? 'Percentage of Calls per Expert' : 'Number of Calls per Expert',
                data: dataValues,
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
                title: {
                  display: true,
                  text: representation === 'percentage' ? 'Percentage (%)' : 'Number of Calls'
                }
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

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleRepresentationChange = (event) => {
    setRepresentation(event.target.value);
  };

  return (
    <div className='w-full h-full'>
      <div className='flex mt-2 justify-between items-center'>
        <h2>Calls per Expert</h2>
        <div className='flex flex-cols-3 gap-1'>
          <div className='drop-down'>
            <label className='border rounded-xl p-1 border-gray-500'>
              <select value={type} onChange={handleTypeChange}>
                <option value="all">All Calls</option>
                <option value="successful">Successful</option>
                <option value="inadequate">Inadequate</option>
                <option value="failed">Failed</option>
                <option value="missed">Missed</option>
              </select>
            </label>
          </div>
          <div className='drop-down'>
            <label className='border border-gray-500 rounded-xl p-1'>
              <select value={timeframe} onChange={handleTimeframeChange}>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="year">Year</option>
              </select>
            </label>
          </div>
          <div className='drop-down'>
            <label className='border border-gray-500 rounded-xl p-1'>
              <select value={representation} onChange={handleRepresentationChange}>
                <option value="absolute">Absolute</option>
                <option value="percentage">Percentage</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div className='border-t mt-1 border-neutral-600' />
      <div className="chart-wrapper">
        <canvas id="expertCallChart"></canvas>
      </div>
    </div>
  );
};

export default ExpertGraph;
