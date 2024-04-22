// ExpertGraph.js
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const ExpertGraph = () => {
  const [callData, setCallData] = useState([]);
  const [expertData, setExpertData] = useState({});
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [callDataResponse, expertDataResponse] = await Promise.all([
          fetchCallData(),
          fetchExpertData()
        ]);

        setCallData(callDataResponse);
        setExpertData(expertDataResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (callData.length > 0 && Object.keys(expertData).length > 0) {
      renderChart(callData, expertData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callData, expertData]); // Ignoring the missing dependencies warning

  const fetchCallData = async () => {
    try {
      const response = await fetch('/api/successful-calls');
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

  const fetchExpertData = async () => {
    try {
      const response = await fetch('/api/experts');
      if (!response.ok) {
        throw new Error('Failed to fetch expert data');
      }
      const expertData = await response.json();
      return expertData.reduce((acc, expert) => {
        acc[expert._id] = expert; // Assuming expert._id is unique
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching expert data:', error);
      return {};
    }
  };

  const renderChart = (callData, expertData) => {
    const expertCalls = {};

    callData.forEach((call) => {
      const expertId = call.expert;
      const expert = expertData[expertId];
      if (expert) {
        const expertName = expert.name;
        expertCalls[expertName] = (expertCalls[expertName] || 0) + 1;
      }
    });

    // Convert object to array for sorting
    const chartData = Object.entries(expertCalls);

    // Sort the chart data in descending order of counts
    chartData.sort((a, b) => b[1] - a[1]);

    // Extract labels and counts after sorting
    const labels = chartData.map((data) => data[0]);
    const counts = chartData.map((data) => data[1]);

    const ctx = document.getElementById('expertCallChart');

    if (chart) {
      chart.destroy();
    }

    if (ctx) {
      setChart(
        new Chart(ctx, {
          type: 'bar', // Change type to horizontalBar
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
                borderSkipped: false, // Round the bottom of the bars
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


  return (
    <div style={{ width: "100%" }}>
      <h2>Number of Calls per Expert</h2>
      <div style={{ height: '100%', width: 'auto' }}>
        <canvas id="expertCallChart"></canvas>
      </div>
    </div>
  );
};

export default ExpertGraph;