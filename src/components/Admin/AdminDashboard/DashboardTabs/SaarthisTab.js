// components/Admin/AdminDashboard/OnlineSaarthisTab.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OnlineSaarthisTable from '../../OnlineSaarthisTable/OnlineSaarthisTable';
import '../AdminDashboard.css';

const SaarthisTab = () => {
    const [onlineSaarthis, setOnlineSaarthis] = useState([]);

    useEffect(() => {
        const fetchOnlineSaarthis = async () => {
            try {
                const response = await axios.get('http://15.206.127.248/api/online-saarthis');
                setOnlineSaarthis(response.data);
            } catch (error) {
                console.error('Error fetching online Saarthis:', error);
            }
        };

        fetchOnlineSaarthis();
    }, []);

    return (
        <div className="dashboard-tiles">
            <div className='dashboard-tile'>
                <div className="grid">
                    <div className="grid-tile-1">
                        <h3>Online Saarthis</h3>
                        <OnlineSaarthisTable onlineSaarthis={onlineSaarthis} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaarthisTab;
