import React, { useState, useEffect } from 'react';
import LeadsPopup from '../../components/Popups/LeadsPopup';
import DashboardTile from '../../components/DashboardTile';
import { useUsers, useCalls } from '../../services/useData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import Loading from '../../components/Loading/loading';
import { formatDate } from '../../Utils/formatHelper';
import Histograms from '../../components/Histograms';
import Popup from '../../components/Popups/Popup';
import Faxios from '../../services/raxiosHelper';
import { Link } from 'react-router-dom';

const UsersTab = () => {
  const { users, fetchUsers } = useUsers();
  const { calls, fetchCalls } = useCalls();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentDayTotalUsers, setCurrentDayTotalUsers] = useState(0);
  const [oneCallUsers, setOneCallUsers] = useState([]);
  const [twoCallsUsers, setTwoCallsUsers] = useState([]);
  const [moreThanTwoCallsUsers, setMoreThanTwoCallsUsers] = useState([]);
  const [currentDayPartialSignups, setCurrentDayPartialSignups] = useState(0);
  const [popupContent, setPopupContent] = useState({
    title: localStorage.getItem('popupTitle') || '',
    users: []
  });

  const fetchLeads = async () => {
    try {
      const response = await Faxios.get('/leads', {
        params: {
          data: true,
        },
      });
      setLeads(response.data.data);
      setTotalUsers(response.data.non_leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchUsers(), fetchLeads()]);
    setLoading(false);
    fetchCalls();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const calculateCurrentDayUsers = () => {
    const utcTimeString = new Date().toUTCString();
    const currentIstDate = formatDate(utcTimeString);
    const currentDayTotalUsersCount = users.filter(user => formatDate(user.createdDate) === currentIstDate && user.profileCompleted === true).length;
    const currentDayPartialSignupsCount = leads.filter(lead => formatDate(lead.createdDate) === currentIstDate && lead.profileCompleted === false).length;
    setCurrentDayPartialSignups(currentDayPartialSignupsCount);
    setCurrentDayTotalUsers(currentDayTotalUsersCount);
  };

  const calculateCallCounts = () => {
    const callCounts = {};
    calls.forEach(call => {
      const userId = call.user;
      if (call.status === 'successful' && call.failedReason === '') {
        callCounts[userId] = (callCounts[userId] || 0) + 1;
      }
    });

    const oneCallUsersList = users.filter(user => callCounts[user._id] === 1);
    const twoCallsUsersList = users.filter(user => callCounts[user._id] === 2);
    const moreThanTwoCallsUsersList = users.filter(user => callCounts[user._id] > 2);

    setOneCallUsers(oneCallUsersList);
    setTwoCallsUsers(twoCallsUsersList);
    setMoreThanTwoCallsUsers(moreThanTwoCallsUsersList);
  };

  useEffect(() => {
    calculateCurrentDayUsers();
    calculateCallCounts();

    if (popupContent.title) {
      fetchPopupUsers(popupContent.title);
    }
    // eslint-disable-next-line
  }, [users, calls, leads]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const fetchPopupUsers = (title) => {
    let usersToSet = [];
    switch (title) {
      case 'Users with One Call':
        usersToSet = oneCallUsers;
        break;
      case 'Users with Two Calls':
        usersToSet = twoCallsUsers;
        break;
      case 'Users with More than Two Calls':
        usersToSet = moreThanTwoCallsUsers;
        break;
      case 'Partial Signups':
        usersToSet = leads;
        break;
      default:
        usersToSet = [];
    }
    setPopupContent({ title, users: usersToSet });
  };

  const openPopup = (title) => {
    localStorage.setItem('popupTitle', title);
    fetchPopupUsers(title);
  };

  const closePopup = () => {
    setPopupContent({ title: '', users: [] });
    localStorage.removeItem('popupTitle');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <LazyLoad>
      <div className="w-full min-h-screen">
        <div className="flex flex-wrap justify-between">
          <div className="w-full">
            <div className="grid grid-cols-3 md:grid-cols-5">
              <Link to="/admin/home/users%20list">
                <DashboardTile title="Registered Users">
                  <div className='flex justify-between items-center w-full'>
                    <h1>{totalUsers}</h1>
                    <h4>Today: {currentDayTotalUsers}</h4>
                  </div>
                </DashboardTile>
              </Link>
              <DashboardTile title="One Call Users" pointer='pointer' onClick={() => openPopup('Users with One Call')}>
                <h1 className='cursor-pointer'>{oneCallUsers.length}</h1>
              </DashboardTile>
              <DashboardTile title="Two Calls Users" pointer='pointer' onClick={() => openPopup('Users with Two Calls')}>
                <h1 className='cursor-pointer'>{twoCallsUsers.length}</h1>
              </DashboardTile>
              <DashboardTile title="Repeat Users" pointer='pointer' onClick={() => openPopup('Users with More than Two Calls')}>
                <h1 className='cursor-pointer'>{moreThanTwoCallsUsers.length}</h1>
              </DashboardTile>
              <DashboardTile title="Leads" pointer='pointer' onClick={() => openPopup('Partial Signups')}>
                <div className='flex justify-between items-center w-full'>
                  <h1>{leads.length}</h1>
                  <h4>Today: {currentDayPartialSignups}</h4>
                </div>
              </DashboardTile>
            </div>
          </div>
        </div >
        <Histograms usersData={users} />
        {
          popupContent.title && (
            popupContent.title === 'Partial Signups' ? (
              <LeadsPopup
                title={popupContent.title}
                leads={leads}
                onClose={closePopup}
              />
            ) : (
              <Popup
                title={popupContent.title}
                users={popupContent.users}
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
