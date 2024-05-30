import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { useCalls } from '../../../services/useData';

const HourCallChart = () => {
    const { calls } = useCalls();
    const [chart, setChart] = useState(null);
    const [timeframe, setTimeframe] = useState('year');

    useEffect(() => {
        renderChart(calls);
        // eslint-disable-next-line
    }, [calls, timeframe]);

    const renderChart = (callData) => {
        const filteredData = filterDataByTimeframe(callData);

        const hourData = Array.from({ length: 14 }, (_, index) => {
            const hour = (index + 9) % 24;
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
                    labels: Array.from({ length: 12 }, (_, index) => `${(index + 9) % 24}:00`),
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
                            display: false,
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
        <div className='w-full h-full'>
            <div className='flex mt-2 justify-between items-center'>
                <h3>Calls per Hour (All)</h3>
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
