// components/Admin/AdminDashboard/DashboardTab.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import OnlineSaarthisTable from '../../OnlineSaarthisTable/OnlineSaarthisTable';
import CallGraph from '../../CallGraph/CallGraph';
import HourCallChart from '../../HourCallChart/HourCallChart';
import ExpertGraph from '../../ExpertGraph/ExpertGraph';
import DayGraph from '../../DayGraph/DayGraph';
import LastFiveCallsTable from '../../LastFiveCallsTable/LastFiveCallsTable';
import '../AdminDashboard.css';

const DashboardTab = () => {
  const [onlineSaarthis, setOnlineSaarthis] = useState([]);
  const [totalCalls, setTotalCalls] = useState([]);
  const [successfulCalls, setSuccessfulCalls] = useState([]);
  const [currentDaySuccessfulCalls, setCurrentDaySuccessfulCalls] = useState(0);
  const [currentDayTotalCalls, setCurrentDayTotalCalls] = useState(0);
  const [averageCallDuration, setAverageCallDuration] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const [callsResponse, successfulCallsResponse] = await Promise.all([
        axios.get('/api/calls'),
        axios.get('/api/successful-calls')
      ]);

      const callsData = callsResponse.data;
      const successfulCallsData = successfulCallsResponse.data;

      setTotalCalls(callsData);
      setSuccessfulCalls(successfulCallsData);

      const currentDate = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).split(',')[0];

      const currentDaySuccessfulCallsCount = successfulCallsData.filter(call => {
        const callDate = new Date(call.initiatedTime).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split(',')[0];
        return callDate === currentDate;
      }).length;

      const currentDayTotalCallsCount = callsData.filter(call => {
        const callDate = new Date(call.initiatedTime).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split(',')[0];
        return callDate === currentDate;
      }).length;

      setCurrentDaySuccessfulCalls(currentDaySuccessfulCallsCount);
      setCurrentDayTotalCalls(currentDayTotalCallsCount);

      const totalDurationSeconds = successfulCallsData.reduce((total, call) => {
        const [hours, minutes, seconds] = call.duration.split(':').map(Number);
        const durationInSeconds = hours * 3600 + minutes * 60 + seconds;
        return total + durationInSeconds;
      }, 0);

      const averageDuration = totalDurationSeconds / successfulCallsData.length;
      setAverageCallDuration(averageDuration);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchOnlineSaarthis = async () => {
        try {
            const response = await axios.get('/api/online-saarthis');
            setOnlineSaarthis(response.data);
        } catch (error) {
            console.error('Error fetching online Saarthis:', error);
        }
    };

    fetchOnlineSaarthis();
}, []);

  const formatDuration = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.round(durationInSeconds % 60);

    const formattedDuration = [];
    if (hours > 0) formattedDuration.push(`${hours}h`);

    if (seconds >= 30) {
      formattedDuration.push(`${minutes + 1}m`);
    } else if (seconds > 0) {
      if (minutes > 0) formattedDuration.push(`${minutes}m`);
    }

    return formattedDuration.join(' ');
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-tiles">
        <div className="dashboard-tile">
          <div className="grid-row">
            <div className="grid-tile-1">
              <h3>Successful Calls</h3>
              <h1>{successfulCalls.length}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>Today: {currentDaySuccessfulCalls}</h4>
                <p style={{ margin: 0 }}>&gt;1m</p>
              </div>
            </div>
            <div className="grid-tile-1">
              <h3>Total Calls</h3>
              <h1>{totalCalls.length}</h1>
              <h4>Today: {currentDayTotalCalls}</h4>
            </div>
            <div className="grid-tile-1">
              <h3>Avg. Duration</h3>
              <h1>{formatDuration(averageCallDuration)}</h1>
              <p style={{ textAlign: 'right', margin: '0' }}>&gt;1m</p>
            </div>
            <div className="grid-tile-1">
              <h3>Online Saarthis</h3>
              <OnlineSaarthisTable onlineSaarthis={onlineSaarthis} />
            </div>
          </div>
        </div>
        <div className='dashboard-tile'>
          <div className="grid">
            <div className='grid-tile-1'>
              <h3>Call Graph</h3>
              <CallGraph />
            </div>
            <div className='grid-tile-1'>
              <h3>Expert Graph</h3>
              <ExpertGraph />
              <p style={{ textAlign: 'right', margin: '0' }}>&gt;1m</p>
            </div>
            <div className='grid-tile-1'>
              <HourCallChart />
            </div>
            <div className='grid-tile-1'>
              <DayGraph />
            </div>
          </div>
        </div>

        <div className="dashboard-tile">
          <div className='latest-wrapper'>
            <LastFiveCallsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;