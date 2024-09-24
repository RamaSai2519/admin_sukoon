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
import InsightsTable from '../../components/DataTable';
import { Button } from 'antd';

const DashboardTab = () => {
  const { stats, fetchStats } = useStats();
  const [view, setView] = React.useState('Split By Duration');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    fetchStats();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

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
    <LazyLoad>
      <div id='dashboardTab' className='min-h-screen'>
        <div id='parent-grid' className='flex flex-col w-full h-full'>
          <div id='stats-grid' className='grid grid-cols-5'>
            <DashboardTile title="Total Calls">
              <h1>{stats.total_calls}</h1>
              <h4>Today: {stats.today_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Successful Calls">
              <h1>{stats.successful_calls}</h1>
              <div className='flex flex-row justify-between w-full'>
                <h4>Today: {stats.today_successful_calls}</h4>
              </div>
            </DashboardTile>
            <DashboardTile title="Failed Calls">
              <h1>{stats.failed_calls}</h1>
              <h4>Today: {stats.today_failed_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Missed Calls">
              <h1>{stats.missed_calls}</h1>
              <h4>Today: {stats.today_missed_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Avg. Duration">
              <h1>{stats.average_call_duration}</h1>
              <p className='text-right w-full'>&gt;1m</p>
            </DashboardTile>
            <DashboardTile title="Total Duration">
              <h1>{stats.total_duration}</h1>
              <p className='text-right w-full'>successful calls</p>
            </DashboardTile>
            <DashboardTile msg={"Number of successful scheduled calls with more than 1 minute duration"} title="Scheduled Calls">
              <h1>{stats.scheduled_calls_percentage}%</h1>
              <p className='text-right w-full'>&gt;1m</p>
            </DashboardTile>
            <DashboardTile title="Avg. Score">
              <h1>{stats.avg_conversation_score}</h1>
              <p className='text-right w-full'>successful calls</p>
            </DashboardTile>
            <DashboardTile title="Online Saarthis" style={{ "gridRow": "1 / span 2", "gridColumn": "5" }}>
              <OnlineSaarthisTable onlineSaarthis={stats.onlineSarathis} />
            </DashboardTile>
            <DashboardTile style={{ "gridColumn": "1 / 5" }}>
              <LastFiveCallsTable />
            </DashboardTile>
            <DashboardTile title={view} style={{ "gridColumn": "5 / span 1" }} >
              <InsightsTable view={view} handleToggle={handleToggle} />
              <div className='w-full flex items-center justify-end'>
                <Button className='mt-1' onClick={handleToggle}>
                  Next
                </Button>
              </div>
            </DashboardTile>
          </div>
          {!loading &&
            <LazyLoad>
              <div id='graphs-grid' className='grid md:grid-cols-2 w-full h-full'>
                <DashboardTile title='Call Graph'><CallGraph /></DashboardTile>
                <DashboardTile title='Expert Graph'><ExpertGraph /></DashboardTile>
                <DashboardTile title='Hourly Call Chart'><HourCallChart /></DashboardTile>
                <DashboardTile title='Day Graph'><DayGraph /></DashboardTile>
              </div>
            </LazyLoad>
          }
        </div>
      </div>
    </LazyLoad >
  );
};

export default DashboardTab;
