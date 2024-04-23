// components/Admin/AdminDashboard/Histograms.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import '../AdminDashboard.css';

const Histograms = ({ usersData }) => {
    const [usersPerCity, setUsersPerCity] = useState({});
    const [usersPerAgeGroup, setUsersPerAgeGroup] = useState({});

    useEffect(() => {
        if (usersData && usersData.length > 0) {
            calculateUsersPerCity(usersData);
            calculateUsersPerAgeGroup(usersData);
        }
    }, [usersData]);

    const calculateUsersPerCity = (users) => {
        const cityCounts = {};
        users.forEach(user => {
            const city = user.city || 'Unknown';
            cityCounts[city] = (cityCounts[city] || 0) + 1;
        });

        // Sort cities by count, then alphabetically
        const sortedCities = Object.keys(cityCounts).sort((a, b) => {
            // Compare counts first
            const countComparison = cityCounts[b] - cityCounts[a];
            if (countComparison !== 0) {
                return countComparison;
            }
            // If counts are equal, sort alphabetically
            return a.localeCompare(b);
        });

        const sortedCityCounts = {};
        sortedCities.forEach(city => {
            sortedCityCounts[city] = cityCounts[city];
        });

        setUsersPerCity(sortedCityCounts);
    };

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

    const cityData = {
        labels: Object.keys(usersPerCity),
        datasets: [
            {
                label: 'Users per City',
                data: Object.values(usersPerCity),
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                borderWidth: 1,
            },
        ],
    };

    const ageGroupData = {
        labels: Object.keys(usersPerAgeGroup),
        datasets: [
            {
                label: 'Users per Age Group',
                data: Object.values(usersPerAgeGroup),
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="admin-dashboard-container">
            <div className="dashboard-tiles">
                <div className="dashboard-tile">
                    <div className="grid-tile-1">
                        <h3>Users per City</h3>
                        <Bar data={cityData} />
                    </div>
                    <div className="grid-tile-1">
                        <h3>Users per Age</h3>
                        <Bar data={ageGroupData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Histograms;