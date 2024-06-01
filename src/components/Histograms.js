import { useState, useEffect } from "react";
import DashboardTile from "./DashboardTile/DashboardTile";
import Chart from "chart.js/auto";

const Histograms = ({ usersData }) => {
    const [usersPerCity, setUsersPerCity] = useState({});
    const [usersPerAgeGroup, setUsersPerAgeGroup] = useState({});
    const [cityChart, setCityChart] = useState(null);
    const [ageGroupChart, setAgeGroupChart] = useState(null);
    const [showCounts, setShowCounts] = useState(false);
    const [othersCities, setOthersCities] = useState([]);

    useEffect(() => {
        if (usersData && usersData.length > 0) {
            calculateUsersPerCity(usersData);
            calculateUsersPerAgeGroup(usersData);
        }
    }, [usersData]);

    // Function to calculate users per city
    const calculateUsersPerCity = (users) => {
        const cityCounts = {};
        const othersCities = []; // Array to store cities grouped into "Others"

        users.forEach(user => {
            const city = user.city || 'Unknown';
            cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        let othersCount = 0;
        const sortedCities = Object.keys(cityCounts)
            .sort((a, b) => a.localeCompare(b))
            .filter(city => {
                if (cityCounts[city] === 1) {
                    othersCount += 1;
                    othersCities.push(city); // Store cities grouped into "Others"
                    delete cityCounts[city];
                    return false;
                }
                return true;
            });

        if (othersCount > 0) {
            cityCounts['Others'] = othersCount;
            sortedCities.push('Others');
        }

        const sortedCityCounts = {};
        sortedCities.forEach(city => {
            sortedCityCounts[city] = cityCounts[city];
        });

        setUsersPerCity(sortedCityCounts);
        setOthersCities(othersCities);
    };


    // Function to calculate users per age group
    const calculateUsersPerAgeGroup = (users) => {
        const ageGroupCounts = {
            'Under 40': 0,
            '41 - 50': 0,
            '51 - 55': 0,
            '56 - 60': 0,
            '61 - 65': 0,
            '66 - 70': 0,
            'Over 70': 0,
            'Unknown': 0
        };
        const currentDate = new Date();
        users.forEach(user => {
            const birthDate = new Date(user.birthDate);
            const age = currentDate.getFullYear() - birthDate.getFullYear();
            let ageGroup;
            if (age < 40) {
                ageGroup = 'Under 40';
            } else if (age >= 41 && age <= 50) {
                ageGroup = '41 - 50';
            } else if (age >= 51 && age <= 55) {
                ageGroup = '51 - 55';
            } else if (age >= 56 && age <= 60) {
                ageGroup = '56 - 60';
            } else if (age >= 61 && age <= 65) {
                ageGroup = '61 - 65';
            } else if (age >= 66 && age <= 70) {
                ageGroup = '66 - 70';
            } else if (age > 70) {
                ageGroup = 'Over 70';
            } else {
                ageGroup = 'Unknown';
            }
            ageGroupCounts[ageGroup] += 1;
        });
        setUsersPerAgeGroup(ageGroupCounts);
    };

    useEffect(() => {
        destroyCharts();
        renderCharts();
        // eslint-disable-next-line
    }, [usersPerCity, usersPerAgeGroup]);

    const destroyCharts = () => {
        if (cityChart) {
            cityChart.destroy();
            setCityChart(null);
        }
        if (ageGroupChart) {
            ageGroupChart.destroy();
            setAgeGroupChart(null);
        }
    };

    // Function to render charts
    const renderCharts = () => {
        const cityChartCanvas = document.getElementById('cityChart');
        const ageGroupChartCanvas = document.getElementById('ageGroupChart');

        setCityChart(renderCityChart(cityChartCanvas));
        setAgeGroupChart(renderAgeGroupChart(ageGroupChartCanvas));
    };

    // Function to render city chart
    const renderCityChart = (canvas) => {
        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(usersPerCity),
                datasets: [{
                    label: 'Users per City',
                    data: Object.values(usersPerCity),
                    backgroundColor: '#FF6384',
                    borderColor: '#FF6384',
                    borderWidth: 0,
                    borderRadius: 20,
                    barPercentage: 0.7,
                    categoryPercentage: 0.7,
                    borderSkipped: false,
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
            }
        });
    };

    const renderAgeGroupChart = (canvas) => {
        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(usersPerAgeGroup),
                datasets: [{
                    label: 'Users per Age Group',
                    data: Object.values(usersPerAgeGroup),
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
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
            }
        });
    };

    const renderCityTable = () => {
        if (!showCounts) return null;
        const othersEntries = othersCities.map((city, index) => (
            <tr key={index}>
                <td>{city}</td>
            </tr>
        ));

        return (
            <table>
                <thead>
                    <tr>
                        <th>Cities with one User only</th>
                    </tr>
                </thead>
                <tbody>
                    {othersEntries}
                </tbody>
            </table>
        );
    };

    return (
        <div className="">
            <div className="grid md:grid-cols-2">
            <DashboardTile title="Users Per City">
                {/* <button className="popup-button"
                    onClick={() => setShowCounts(!showCounts)}>
                    Show Others</button> */}
                <div className="w-full">
                    <canvas id="cityChart"></canvas>
                </div>
                {renderCityTable()}
            </DashboardTile>
            <DashboardTile title="Users Per Age">
                <div className="w-full">
                    <canvas id="ageGroupChart"></canvas>
                </div>
            </DashboardTile>
            </div>
        </div>
    );
};

export default Histograms;