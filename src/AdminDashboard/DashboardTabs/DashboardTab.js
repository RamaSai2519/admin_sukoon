import React, { useEffect, useState } from 'react';
import { useStats } from '../../contexts/useData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import DashboardTile from '../../components/DashboardTile';
import DayGraph from '../../components/DaysGraph/DaysGraph';
import CallGraph from '../../components/CallGraph/CallGraph';
import { Progress, Modal, InputNumber, Checkbox } from 'antd';
import LatestCallsTable from '../../components/LatestCallsTable';
import ExpertGraph from '../../components/ExpertGraph/ExpertGraph';
import HourCallChart from '../../components/HourCallChart/HourCallChart';
import OnlineSaarthisTable from '../../components/OnlineSaarthisTable/OnlineSaarthisTable';

const DashboardTab = () => {
  const { stats } = useStats();
  const [countdown, setCountdown] = useState(() => parseInt(localStorage.getItem('countdown') || '30'));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCountdown, setNewCountdown] = useState(countdown);
  const [neverCountdown, setNeverCountdown] = useState(() => localStorage.getItem('neverCountdown') === 'true');

  useEffect(() => {
    if (!neverCountdown) {
      const interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown > 0 ? prevCountdown - 1 : newCountdown);
        if (countdown === 0) {
          window.location.reload();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown, newCountdown, neverCountdown]);

  const handleCircleClick = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    localStorage.setItem('countdown', newCountdown);
    localStorage.setItem('neverCountdown', neverCountdown);
    setCountdown(newCountdown);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <LazyLoad>
      <div id='dashboardTab' className='min-h-screen'>
        <div className='fixed top-4 right-4 z-50' onClick={handleCircleClick}>
          <Progress type="circle" percent={(countdown / newCountdown) * 100} format={() => countdown} width={30} />
        </div>
        <Modal title="Set Countdown Timer" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <InputNumber min={1} value={newCountdown} onChange={setNewCountdown} />
          <Checkbox checked={neverCountdown} onChange={e => setNeverCountdown(e.target.checked)}>Never Countdown</Checkbox>
        </Modal>
        <div id='parent-grid' className='flex flex-col w-full h-full'>
          <div id='stats-grid' className='grid grid-cols-5'>
            <DashboardTile title="Total Calls">
              <h1>{stats.total_calls}</h1>
              <h4>Today: {stats.today_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Successful Calls">
              <h1>{stats.successful_calls}</h1>
              <h4>Today: {stats.today_successful_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Inadequate Calls">
              <h1>{stats.inadequate_calls}</h1>
              <h4>Today: {stats.today_inadequate_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Missed Calls">
              <h1>{stats.missed_calls}</h1>
              <h4>Today: {stats.today_missed_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Failed Calls">
              <h1>{stats.failed_calls}</h1>
              <h4>Today: {stats.today_failed_calls}</h4>
            </DashboardTile>
            <DashboardTile title="Avg. Duration">
              <h1>{stats.average_call_duration}</h1>
              <p className='text-right w-full'>&gt;1m</p>
            </DashboardTile>
            <DashboardTile title="Total Duration">
              <h1>{stats.total_duration}</h1>
              <p className='text-right w-full'>successful calls</p>
            </DashboardTile>
            <DashboardTile title="Avg. Score">
              <h1>{stats.avg_conversation_score}</h1>
              <p className='text-right w-full'>successful calls</p>
            </DashboardTile>
            <DashboardTile title="Online Saarthis" style={{ "gridRow": "1 / span 2", "gridColumn": "5" }}>
              <OnlineSaarthisTable onlineSaarthis={stats.onlineSarathis} />
            </DashboardTile>
          </div>
          <DashboardTile><LatestCallsTable /></DashboardTile>
          <LazyLoad>
            <div id='graphs-grid' className='grid md:grid-cols-2 w-full h-full'>
              <DashboardTile title='Call Graph'><CallGraph /></DashboardTile>
              <DashboardTile title='Expert Graph'><ExpertGraph /></DashboardTile>
              <DashboardTile title='Hourly Call Chart'><HourCallChart /></DashboardTile>
              <DashboardTile title='Day Graph'><DayGraph /></DashboardTile>
            </div>
          </LazyLoad>
        </div>
      </div>
    </LazyLoad >
  );
};

export default DashboardTab;
