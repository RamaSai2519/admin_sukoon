import React, { useState, useEffect, useCallback } from 'react';
import OnlineSaarthisTable from '../../OnlineSaarthisTable/OnlineSaarthisTable';
import CallGraph from '../../CallGraph/CallGraph';
import HourCallChart from '../../HourCallChart/HourCallChart';
import ExpertGraph from '../../ExpertGraph/ExpertGraph';
import DayGraph from '../../DaysGraph/DaysGraph';
import LastFiveCallsTable from '../../LastFiveCallsTable/LastFiveCallsTable';
import '../AdminDashboard.css';
import useCallsData from '../../../../services/useCallsData';
import useExpertManagement from '../../../../services/useExpertManagement';
const DashboardTab = () => {
  const { calls } = useCallsData();
  const { experts } = useExpertManagement();

  const [onlineSaarthis, setOnlineSaarthis] = useState([]);
  const [totalCalls, setTotalCalls] = useState([]);
  const [successfulCalls, setSuccessfulCalls] = useState([]);
  const [currentDaySuccessfulCalls, setCurrentDaySuccessfulCalls] = useState(0);
  const [currentDayTotalCalls, setCurrentDayTotalCalls] = useState(0);
  const [averageCallDuration, setAverageCallDuration] = useState(0);

  const fetchOnlineSaarthis = useCallback(() => {
    const onlineExperts = experts.filter(expert => expert.status === 'online');
    setOnlineSaarthis(onlineExperts);
  }, [experts]);

  const calculateStatistics = useCallback(() => {
    const currentDate = new Date().toLocaleDateString('en-US');
    const currentDaySuccessfulCallsCount = calls.filter(call => {
      const callDate = new Date(call.initiatedTime).toLocaleDateString('en-US');
      return callDate === currentDate && call.status === 'successfull';
    }).length;

    const currentDayTotalCallsCount = calls.filter(call => {
      const callDate = new Date(call.initiatedTime).toLocaleDateString('en-US');
      return callDate === currentDate;
    }).length;

    setCurrentDaySuccessfulCalls(currentDaySuccessfulCallsCount);
    setCurrentDayTotalCalls(currentDayTotalCallsCount);

    const successfulCallsData = calls.filter(call => call.status === 'successfull');
    const totalDurationSeconds = successfulCallsData.reduce((total, call) => {
      const [hours, minutes, seconds] = call.duration.split(':').map(Number);
      const durationInSeconds = hours * 3600 + minutes * 60 + seconds;
      return total + durationInSeconds;
    }, 0);

    const averageDuration = totalDurationSeconds / successfulCallsData.length;
    setAverageCallDuration(averageDuration);
    setTotalCalls(calls);
    setSuccessfulCalls(successfulCallsData);
  }, [calls]);

  useEffect(() => {
    fetchOnlineSaarthis();
    calculateStatistics();
  }, [fetchOnlineSaarthis, calculateStatistics]);

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
