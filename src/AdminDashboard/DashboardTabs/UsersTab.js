/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import LeadsPopup from '../../components/Popups/LeadsPopup';
import DashboardTile from '../../components/DashboardTile';
import LazyLoad from '../../components/LazyLoad/lazyload';
import Loading from '../../components/Loading/loading';
import Histograms from '../../components/Histograms';
import { useUsers } from '../../contexts/useData';
import Popup from '../../components/Popups/Popup';
import Raxios from '../../services/axiosHelper';
import { Link } from 'react-router-dom';
import { message } from 'antd';

const UsersTab = () => {
  const { users, fetchUsers } = useUsers();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [users_type, setUsersType] = useState(null);
  const [graphsLoading, setGraphsLoading] = useState(false);

  const fetchCounts = async () => {
    setLoading(true);
    const response = await Raxios.get('/actions/leads_count');
    if (response.status === 200) { setCounts(response.data) } else { message.error(response.msg) }
    setLoading(false);
  }
  const fetchData = async () => {
    fetchCounts();
    setGraphsLoading(true);
    await fetchUsers();
    setGraphsLoading(false);
  };

  const closePopup = () => { setUsersType(null); localStorage.removeItem('users_type') };
  const openPopup = (type) => { setUsersType(type); localStorage.setItem('users_type', type) };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => {
    const handleKeyPress = (event) => { if (event.key === 'Escape') { closePopup() } };
    window.addEventListener('keydown', handleKeyPress);
    return () => { window.removeEventListener('keydown', handleKeyPress); };
  }, []);
  useEffect(() => { if (localStorage.getItem('users_type')) { setUsersType(localStorage.getItem('users_type')) } }, []);

  if (loading) { return <Loading /> }

  return (
    <LazyLoad>
      <div className="w-full min-h-screen">
        <div className="flex flex-wrap justify-between">
          <div className="w-full">
            <div className="grid grid-cols-3 md:grid-cols-5">
              <Link to="/admin/home/users%20list">
                <DashboardTile title="Registered Users">
                  <div className='flex justify-between items-center w-full'>
                    <h1>{counts.non_leads}</h1>
                    <h4>Today: {counts.today_non_leads}</h4>
                  </div>
                </DashboardTile>
              </Link>
              <DashboardTile title="One Call Users" pointer='pointer' onClick={() => openPopup('one_call_users')}>
                <h1 className='cursor-pointer'>{counts.one_call_users}</h1>
              </DashboardTile>
              <DashboardTile title="Two Calls Users" pointer='pointer' onClick={() => openPopup('two_call_users')}>
                <h1 className='cursor-pointer'>{counts.two_call_users}</h1>
              </DashboardTile>
              <DashboardTile title="Repeat Users" pointer='pointer' onClick={() => openPopup('repeat_users')}>
                <h1 className='cursor-pointer'>{counts.repeat_users}</h1>
              </DashboardTile>
              <DashboardTile title="Leads" pointer='pointer' onClick={() => openPopup('leads')}>
                <div className='flex justify-between items-center w-full'>
                  <h1>{counts.total_leads}</h1>
                  <h4>Today: {counts.todat_leads}</h4>
                </div>
              </DashboardTile>
            </div>
          </div>
        </div >
        {graphsLoading ? <Loading /> : <Histograms usersData={users} />}
        {
          users_type && (
            users_type === 'leads' ? (
              <LeadsPopup onClose={closePopup} />
            ) : (
              <Popup
                users_type={users_type}
                onClose={closePopup}
              />
            )
          )
        }
      </div>
    </LazyLoad>
  );
};

export default UsersTab;
