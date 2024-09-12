import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ReferralChart = ({ data }) => {
    const chartRef = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            destroyChart();
            renderChart();
        }

        return () => {
            destroyChart();
        };
    }, [data]);

    const destroyChart = () => {
        if (chartInstance) {
            chartInstance.destroy();
            setChartInstance(null);
        }
    };

    const renderChart = () => {
        const ctx = chartRef.current.getContext("2d");
        const chart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: "Referral Count",
                    data: Object.values(data),
                    backgroundColor: 'rgba(69, 120, 249, 1)',
                    borderColor: 'rgba(69, 120, 249, 1)',
                    borderWidth: 1,
                    borderRadius: 20,
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                    borderSkipped: false,
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, grid: { display: false } }
                },
            }
        });
        setChartInstance(chart);
    };

    return (
        <div className="w-full border border-lightBlack rounded-xl">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default ReferralChart;