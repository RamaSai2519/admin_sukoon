// DashboardTab.js
import React from 'react';
import OnlineSaarthisTable from '../../components/OnlineSaarthisTable/OnlineSaarthisTable';
import CallGraph from '../../components/CallGraph/CallGraph';
import HourCallChart from '../../components/HourCallChart/HourCallChart';
import ExpertGraph from '../../components/ExpertGraph/ExpertGraph';
import DayGraph from '../../components/DaysGraph/DaysGraph';
import LastFiveCallsTable from '../../components/LastFiveCallsTable/LastFiveCallsTable';
import { useStats } from '../../services/useData';
import DashboardTile from '../../components/DashboardTile';
import LazyLoad from '../../components/LazyLoad/lazyload';

const DashboardTab = () => {
  const { stats } = useStats();

  return (
    <LazyLoad>
      <div id='dashboardTab' className='min-h-screen'>
        <div id='parent-grid' className='flex w-full h-full'>
          <div id='graphs-grid' className='grid md:grid-cols-2 w-full h-full'>
            <div id='stats-grid' className='grid grid-cols-3'>
              <DashboardTile title="Total Calls">
                <h1>{stats.totalCalls}</h1>
                <h4>Today: {stats.todayCalls}</h4>
              </DashboardTile>
              <DashboardTile title="Successful Calls">
                <h1>{stats.successfulCalls}</h1>
                <div className='flex flex-row justify-between w-full'>
                  <h4>Today: {stats.todaySuccessfulCalls}</h4>
                </div>
              </DashboardTile>
              <DashboardTile title="Failed Calls">
                <h1>{stats.failedCalls}</h1>
                <h4>Today: {stats.todayFailedCalls}</h4>
              </DashboardTile>
              <DashboardTile title="Missed Calls">
                <h1>{stats.missedCalls}</h1>
                <h4>Today: {stats.todayMissedCalls}</h4>
              </DashboardTile>
              <DashboardTile title="Avg. Duration">
                <h1>{stats.averageCallDuration}</h1>
                <p className='text-right w-full'>&gt;1m</p>
              </DashboardTile>
              <DashboardTile msg={"Total Duration of Successful Calls with more than 1 minute duration"} title="Total Duration">
                <h1>{stats.totalDuration}</h1>
                <p className='text-right w-full'>&gt;1m</p>
              </DashboardTile>
              <DashboardTile msg={"Number of successful scheduled calls with more than 1 minute duration"} title="Scheduled Calls">
                <h1>{stats.scheduledCallsPercentage}%</h1>
                <p className='text-right w-full'>&gt;1m</p>
              </DashboardTile>
              <DashboardTile title="Avg. Score">
                <h1>{stats.averageConversationScore}</h1>
                <p className='text-right w-full'>all calls</p>
              </DashboardTile>
              <DashboardTile title="Online Saarthis">
                <OnlineSaarthisTable onlineSaarthis={stats.onlineSaarthis} />
              </DashboardTile>
            </div>
            <DashboardTile title='Latest Calls'><LastFiveCallsTable /></DashboardTile>
            <DashboardTile title='Call Graph'><CallGraph /></DashboardTile>
            <DashboardTile title='Expert Graph'><ExpertGraph /></DashboardTile>
            <DashboardTile title='Hourly Call Chart'><HourCallChart /></DashboardTile>
            <DashboardTile title='Day Graph'><DayGraph /></DashboardTile>
          </div>
        </div>
      </div>
    </LazyLoad>
  );
};

export default DashboardTab;
