// DayGraph.js
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';

const DayGraph = () => {
    const [chart, setChart] = useState(null);
    const [callData, setCallData] = useState([]);
    const [timeframe, setTimeframe] = useState('year'); // Default timeframe is 'year'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const callData = await fetchCallData();
                setCallData(callData);
                renderChart(callData);
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
    }, [timeframe]);

    const fetchCallData = async () => {
        try {
            const response = await fetch('/api/calls');
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

    const renderChart = (callData) => {
        const filteredData = filterDataByTimeframe(callData);

        const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayData = Array.from({ length: 7 }, (_, index) => {
            const callsOnDay = filteredData.filter(call => {
                const callDate = new Date(call.initiatedTime);
                return callDate.getDay() === index;
            });
            return callsOnDay.length;
        });

        const ctx = document.getElementById('dayGraph');

        if (chart) {
            chart.destroy();
        }

        if (ctx) {
            setChart(new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dayLabels,
                    datasets: [{
                        label: 'Number of Calls',
                        data: dayData,
                        backgroundColor: 'rgba(69, 120, 249, 1)',
                        borderColor: 'rgba(69, 120, 249, 1)',
                        borderWidth: 0,
                        borderRadius: 20,
                        barPercentage: 0.7,
                        categoryPercentage: 0.7,
                        borderSkipped: false,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: false,
                            },
                            display: false,
                            title: {
                                display: false,
                                text: 'Number of Calls'
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                            },
                            title: {
                                display: true,
                                text: 'Day of the Week'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false, // Hide legend
                        },
                    },
                }
            }));
        }
    };

    const filterDataByTimeframe = (callData) => {
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

    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };

    return (
        <div className='day-graph'>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: "0" }}>Daily Call Graph</h3>
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
            <canvas id="dayGraph"></canvas>
        </div>
    );
};

export default DayGraph;