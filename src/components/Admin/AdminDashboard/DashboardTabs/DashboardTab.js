// DashboardTab.js
import React from 'react';
import OnlineSaarthisTable from '../../OnlineSaarthisTable/OnlineSaarthisTable';
import CallGraph from '../../CallGraph/CallGraph';
import HourCallChart from '../../HourCallChart/HourCallChart';
import ExpertGraph from '../../ExpertGraph/ExpertGraph';
import DayGraph from '../../DaysGraph/DaysGraph';
import LastFiveCallsTable from '../../LastFiveCallsTable/LastFiveCallsTable';
import '../AdminDashboard.css';
import { useData } from '../../../../services/useData';

const DashboardTab = () => {
  const { stats } = useData();

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-tiles">
        <div className="dashboard-tile">
          <div className="grid-row">
            <div className="grid-tile-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3>Total Calls</h3>
              <h1>{stats.totalCalls}</h1>
              <h4>Today: {stats.todayCalls}</h4>
            </div>
            <div className="grid-tile-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3>Successful Calls</h3>
              <h1>{stats.successfulCalls}</h1>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ margin: 0 }}>Today: {stats.todaySuccessfulCalls}</h4>
                <p style={{ margin: 0 }}>&gt;1m</p>
              </div>
            </div>
            <div className="grid-tile-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3>Total Failed Calls</h3>
              <h1>{stats.failedCalls}</h1>
              <h4>Today: {stats.todayFailedCalls}</h4>
            </div>
            <div className="grid-tile-1" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3>Avg. Duration</h3>
              <h1>{stats.averageCallDuration}</h1>
              <p style={{ textAlign: 'right', margin: '0' }}>&gt;1m</p>
            </div>
            <div className="grid-tile-1">
              <h3>Online Saarthis</h3>
              <OnlineSaarthisTable onlineSaarthis={stats.onlineSaarthis} />
            </div>
          </div>
        </div>
        <div className='dashboard-tile'>
          <div className="grid">
            <div className='grid-tile-1'>
              <CallGraph />
            </div>
            <div className='grid-tile-1'>
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
