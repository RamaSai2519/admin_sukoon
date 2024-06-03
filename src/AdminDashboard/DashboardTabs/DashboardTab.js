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
    <div className="px-5">
        <div className="flex flex-wrap justify-between">
          <div className='w-full'>
            <div className='grid grid-cols-3 md:grid-cols-5'>
              <DashboardTile title="Total Calls">
                <h1>{stats.totalCalls}</h1>
                <h4>Today: {stats.todayCalls}</h4>
              </DashboardTile>
              <DashboardTile title="Successful Calls">
                <h1>{stats.successfulCalls}</h1>
                <div className='flex flex-row justify-between w-full'>
                  <h4>Today: {stats.todaySuccessfulCalls}</h4>
                  <p>&gt;1m</p>
                </div>
              </DashboardTile>
              <DashboardTile title="Failed Calls">
                <h1>{stats.failedCalls}</h1>
                <h4>Today: {stats.todayFailedCalls}</h4>
              </DashboardTile>
              <DashboardTile title="Avg. Duration">
                <h1>{stats.averageCallDuration}</h1>
                <p className='text-right w-full'>&gt;1m</p>
              </DashboardTile>
              <DashboardTile title="Online Saarthis">
                <OnlineSaarthisTable onlineSaarthis={stats.onlineSaarthis} />
              </DashboardTile>
            </div>
          </div>
          <div className='w-full'>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <DashboardTile title="Call Graph">
                <CallGraph />
              </DashboardTile>
              <DashboardTile title="Expert Graph">
                <ExpertGraph />
                <p className='w-full text-right'>&gt;1m</p>
              </DashboardTile>
              <DashboardTile title="Hourly Call Chart">
                <HourCallChart />
              </DashboardTile>
              <DashboardTile title="Day Graph">
                <DayGraph />
              </DashboardTile>
            </div>
          </div>
          <div className="w-full">
            <DashboardTile>
              <LastFiveCallsTable />
            </DashboardTile>
          </div>
        </div>
      </div>
    </LazyLoad>
  );
};

export default DashboardTab;
