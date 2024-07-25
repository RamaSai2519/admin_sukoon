import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { useCalls } from '../../services/useData';

const CallGraph = () => {
  const { calls } = useCalls();
  const [chart, setChart] = useState(null);
  const [timeframe, setTimeframe] = useState('year');
  const [type, setType] = useState('all');

  useEffect(() => {
    renderChart(calls);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calls, timeframe, type]);

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

  const filterCallsByType = (filteredData) => {
    switch (type) {
      case 'successful':
        return filteredData.filter(call => call.status === 'successful');
      case 'failed':
        return filteredData.filter(call => call.status === 'failed');
      case 'missed':
        return filteredData.filter(call => call.status === 'missed');
      case 'all':
      default:
        return filteredData;
    }
  };

  const formatDate = (date) => {
    const options = { month: 'short', day: '2-digit' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
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

  const renderChart = (callData) => {
    const filteredCalls = filterCallsByTimeframe(callData);
    const filteredCallsByType = filterCallsByType(filteredCalls);
    const { labels, counts } = processChartData(filteredCallsByType);

    const ctx = document.getElementById('callChart');
    if (chart) {
      chart.destroy();
    }

    if (ctx) {
      const gradient = ctx.getContext('2d').createLinearGradient(500, 0, 0, 0);
      gradient.addColorStop(0, 'rgba(69, 120, 249, 1)');
      gradient.addColorStop(1, 'rgba(69, 120, 249, 0.3)');

      setChart(
        new Chart(ctx, {
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
              x: { display: true, grid: { display: false } },
              y: { display: false, grid: { display: false } }
            },
            plugins: {
              legend: { display: false },
              hover: { mode: 'nearest', intersect: false, },
              tooltip: { mode: 'nearest', intersect: false, },
            },
          },
        })
      );
    }
  };

  return (
    <div className='w-full h-full'>
      <div className='flex mt-2 justify-between items-center'>
        <h2>Calls Over Time</h2>
        <div className='flex flex-cols-2 gap-1'>
          <div className='drop-down'>
            <label className='border border-gray-500 rounded-xl p-1'>
              <select value={type} onChange={handleTypeChange}>
                <option value="all">All Calls</option>
                <option value="successful">Successful</option>
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
        </div>
      </div>
      <div className='border-t mt-1 border-neutral-600' />
      <canvas id="callChart"></canvas>
    </div>
  );
};

export default CallGraph;
