import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';

const HourCallChart = () => {
    const [chart, setChart] = useState(null);
    const [callData, setCallData] = useState([]);
    const [timeframe, setTimeframe] = useState('year');

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
        // Filter call data based on selected timeframe
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
        const filteredData = callData.filter(call => {
            const callTime = new Date(call.initiatedTime);
            const callHour = callTime.getHours();
            return callHour >= 9 && callHour <= 22; // 9am to 10pm
        });

        const hourData = Array.from({ length: 14 }, (_, index) => {
            const hour = (index + 9) % 24; // 9am to 10pm
            const callsWithinHour = filteredData.filter(call => {
                const callTime = new Date(call.initiatedTime);
                const callHour = callTime.getHours();
                return callHour === hour;
            });
            const totalCalls = callsWithinHour.length;
            return totalCalls;
        });

        const ctx = document.getElementById('hourCallChart');

        if (chart) {
            chart.destroy();
        }

        if (ctx) {
            setChart(new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 12 }, (_, index) => `${(index + 9) % 24}:00 IST`),
                    datasets: [{
                        label: 'Number of Calls',
                        data: hourData,
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
                                text: 'Hour (IST)'
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

    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };

    return (
        <div className='hour-call-chart'>
            <div className='idk' style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: "0" }}>Hourly Call Graph</h3>
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
            <canvas id="hourCallChart"></canvas>
        </div>
    );
};

export default HourCallChart;