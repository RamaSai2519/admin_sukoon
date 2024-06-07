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
import DynamicTable from '../../components/DataTable';
import { Button, ConfigProvider, theme } from 'antd';

const DashboardTab = () => {
  const { stats } = useStats();
  const [view, setView] = React.useState('Split By Duration');
  const darkMode = localStorage.getItem('darkMode') === 'true';

  const handleToggle = () => {
    if (view === 'Split By Duration') {
      setView('Average Call Durations');
    } else if (view === 'Average Call Durations') {
      setView('Split Of Calls');
    } else {
      setView('Split By Duration');
    }
  };

  return (
    <ConfigProvider theme={
      {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
    }>
      <LazyLoad>
        <div id='dashboardTab' className='min-h-screen'>
          <div id='parent-grid' className='flex flex-col w-full h-full'>
            <div id='stats-grid' className='grid grid-cols-5'>
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
              <DashboardTile title="Total Duration">
                <h1>{stats.totalDuration}</h1>
                <p className='text-right w-full'>all calls</p>
              </DashboardTile>
              <DashboardTile msg={"Number of successful scheduled calls with more than 1 minute duration"} title="Scheduled Calls">
                <h1>{stats.scheduledCallsPercentage}%</h1>
                <p className='text-right w-full'>&gt;1m</p>
              </DashboardTile>
              <DashboardTile title="Avg. Score">
                <h1>{stats.averageConversationScore}</h1>
                <p className='text-right w-full'>all calls</p>
              </DashboardTile>
              <DashboardTile title="Online Saarthis" style={{ "grid-row": "1 / span 2", "grid-column": "5" }}>
                <OnlineSaarthisTable onlineSaarthis={stats.onlineSaarthis} />
              </DashboardTile>
              <DashboardTile title='Latest Calls' style={{ "grid-column": "1 / 4" }}><LastFiveCallsTable /></DashboardTile>
              <DashboardTile title={view} style={{ "grid-column": "4 / span 2" }} >
                <DynamicTable view={view} handleToggle={handleToggle} />
                {/* <Switch
                checkedChildren="Next"
                unCheckedChildren="Next"
                onChange={handleToggle}
              /> */}
                <div className='w-full flex items-center justify-end'><Button className='mt-1' onClick={handleToggle}>Next</Button></div>
              </DashboardTile>
            </div>
            <div id='graphs-grid' className='grid md:grid-cols-2 w-full h-full'>
              <DashboardTile title='Call Graph'><CallGraph /></DashboardTile>
              <DashboardTile title='Expert Graph'><ExpertGraph /></DashboardTile>
              <DashboardTile title='Hourly Call Chart'><HourCallChart /></DashboardTile>
              <DashboardTile title='Day Graph'><DayGraph /></DashboardTile>
            </div>
          </div>
        </div>
      </LazyLoad >
    </ConfigProvider>
  );
};

export default DashboardTab;
