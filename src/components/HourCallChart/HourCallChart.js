import Chart from 'chart.js/auto';
import React, { useEffect, useState } from 'react';
import { useCalls } from '../../contexts/useData';
import { strToDate } from '../../Utils/formatHelper';

const HourCallChart = () => {
    const { calls } = useCalls();
    const [chart, setChart] = useState(null);
    const [timeframe, setTimeframe] = useState('year');
    const [type, setType] = useState('all');

    useEffect(() => {
        renderChart(calls);
        // eslint-disable-next-line
    }, [calls, timeframe, type]);

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
        return callData.filter(call => strToDate(call.initiatedTime) > startDate);
    };

    const filterDataByType = (filteredData) => {
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
    }

    const handleTimeframeChange = (event) => {
        setTimeframe(event.target.value);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const renderChart = (callData) => {
        const filteredData = filterDataByTimeframe(callData);
        const filteredDataByType = filterDataByType(filteredData);

        const hourData = Array.from({ length: 14 }, (_, index) => {
            const hour = (index + 9) % 24;
            const callsWithinHour = filteredDataByType.filter(call => {
                const callTime = strToDate(call.initiatedTime);
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



    return (
        <div className='w-full h-full'>
            <div className='flex mt-2 justify-between items-center'>
                <h3>Calls per Hour (All)</h3>
                <div className='flex flex-cols-2 gap-1'>
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
                </div>
            </div>
            <div className='border-t mt-1 border-neutral-600' />
            <canvas id="hourCallChart"></canvas>
        </div>
    );
};

export default HourCallChart;
