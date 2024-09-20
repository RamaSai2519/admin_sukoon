import Raxios from '../services/axiosHelper';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { useCategories } from '../services/useData';
import Loading from '../components/Loading/loading';
import { message, Select, Switch, Table } from 'antd';
import EditableTimeCell from '../components/EditableTimeCell';
import Faxios from '../services/raxiosHelper';

const { Option } = Select;

const ExpertDetails = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState({
    name: '',
    phoneNumber: '',
    topics: '',
    description: '',
    categories: [],
    profile: '',
    status: '',
    languages: [],
    score: '',
    repeat_score: '',
    total_score: '',
    calls_share: '',
  });
  const [editMode, setEditMode] = useState(false);
  const { allCategories, fetchCategories } = useCategories();
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpertDetails = async () => {
    try {
      const response = await Raxios.get(`/expert/experts/${expertId}`);
      const { __v, lastModifiedBy, ...expertData } = response.data;
      setExpert(expertData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expert details:', error);
    }
  };

  const fetchTimings = async () => {
    try {
      const response = await Raxios.get(`/data/timings?expert=${expertId}`);
      setTimings(response.data);
    } catch (error) {
      console.error('Error fetching expert timings:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories();
    fetchTimings();
    fetchExpertDetails();
  }, [expertId]);

  useEffect(() => {
    if (!loading && window.location.hash === '#timings') {
      const timingsElement = document.getElementById('timings');
      if (timingsElement) {
        timingsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading, timings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpert({ ...expert, [name]: value });
  };

  const handleUpdate = async (updatedFormData) => {
    try {
      await Faxios.post('/expert', updatedFormData);
      setExpert((prev) => ({ ...prev, ...updatedFormData }));
      message.success('Expert details updated successfully!');
      setEditMode(false);
    } catch (error) {
      message.error('Error updating expert details:', error);
      console.error('Error updating expert details:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await Raxios.delete(`/expert/experts/${expertId}`);
      message.success('Expert deleted successfully!');
      window.location.href = '/admin/experts';
    } catch (error) {
      console.error('Error deleting expert:', error);
      message.error('Error deleting expert:', error);
    }
  };

  const handleSave = async (row) => {
    try {
      await Raxios.post(`/data/timings`, { expertId, row });
      message.success('Timings updated successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error updating timings:', error);
      window.alert('Error updating timings:', error);
    }
  };

  const columns = [
    { title: 'Day', dataIndex: 'day', key: 'day', editable: false },
    { title: 'Start Time 1', dataIndex: 'PrimaryStartTime', key: 'PrimaryStartTime', editable: true },
    { title: 'End Time 1', dataIndex: 'PrimaryEndTime', key: 'PrimaryEndTime', editable: true },
    { title: 'Start Time 2', dataIndex: 'SecondaryStartTime', key: 'SecondaryStartTime', editable: true },
    { title: 'End Time 2', dataIndex: 'SecondaryEndTime', key: 'SecondaryEndTime', editable: true }
  ];

  const components = {
    body: { cell: EditableTimeCell }
  };

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record) => ({
      record,
      editable: col.editable,
      dataIndex: col.dataIndex,
      title: col.title,
      handleSave
    })
  }));

  if (loading) {
    return (
      <div className='min-h-screen w-full'>
        <Loading />
      </div>
    );
  }

  const StatusTile = ({ title, value, switchValue, onChange }) => (
    <div className='grid-tile'>
      <h3>{title}</h3>
      <div className="flex h-full justify-between items-center">
        <h2>{value}</h2>
        <Switch checked={switchValue} onChange={onChange} />
      </div>
    </div>
  );

  return (
    <div>
      {expert && (
        <div className='h3-darkgrey'>
          <div className='flex flex-row justify-between items-center p-5 overflow-auto'>
            <h1>Expert Details</h1>
            <button className='back-button' onClick={() => window.history.back()}>
              <FaArrowLeft className="back-icon" />
            </button>
          </div>
          <div className="grid-tile-2">
            <img src={expert.profile} alt="Expert Profile" className='max-h-52' />
          </div>
          <div className="grid grid-cols-2 p-5 overflow-auto">
            {['name', 'phoneNumber', 'status', 'description', 'topics', 'languages'].map((field, idx) => (
              field === 'status' ?
                <div className='grid grid-cols-2'>
                  <StatusTile
                    title="Status"
                    value={expert.status === 'online' ? 'Online' : 'Offline'}
                    switchValue={expert.status === 'online'}
                    onChange={() => handleUpdate({ ...expert, status: expert.status === 'offline' ? 'online' : 'offline' })}
                  />
                  <StatusTile
                    title="Busy"
                    value={expert.isBusy ? 'Busy' : 'Available'}
                    switchValue={expert.isBusy}
                    onChange={() => handleUpdate({ ...expert, isBusy: !expert.isBusy })}
                  />
                  <StatusTile
                    title="active"
                    value={expert.active ? 'Active' : 'Inactive'}
                    switchValue={expert.active}
                    onChange={() => handleUpdate({ ...expert, active: !expert.active })}
                  />
                  <StatusTile
                    title="Profile"
                    value={expert.profileCompleted ? 'Profile Completed' : 'Profile Incomplete'}
                    switchValue={expert.profileCompleted}
                    onChange={() => handleUpdate({ ...expert, profileCompleted: !expert.profileCompleted })}
                  />
                </div>
                :
                <div key={idx} className='grid-tile'>
                  <h3>{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
                  {editMode ? (
                    <p><input type="text" name={field} value={expert[field]} onChange={handleInputChange} /></p>
                  ) : (
                    <h2>{expert[field]}</h2>
                  )}
                </div>
            ))}
            <div className='grid-tile'>
              <h3>Categories</h3>
              {editMode ? (
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Select Categories"
                  value={expert.categories}
                  onChange={(value) => setExpert((prev) => ({ ...prev, categories: value }))}
                >
                  {allCategories.map((category) => (
                    <Option key={category._id} value={category}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <h2>{expert.categories.join(', ') || 'No categories'}</h2>
              )}
            </div>
            <div className='grid grid-cols-4'>
              {['score', 'repeat_score', 'calls_share', 'total_score'].map((field, idx) => (
                <div key={idx} className='grid-tile'>
                  <h3>{field.split(/(?=[A-Z])/).join(' ')}</h3>
                  {editMode ? (
                    <p><input type="number" name={field} value={expert[field]} onChange={handleInputChange} /></p>
                  ) : (
                    <h2>{expert[field]}{field === 'calls_share' ? '%' : ''}</h2>
                  )}
                </div>
              ))}
            </div>
            <div id='timings' className='grid-tile'>
              <h3>Timings</h3>
              <Table
                components={components}
                columns={mergedColumns}
                dataSource={timings}
                pagination={false}
                rowKey={(record) => record._id}
              />
            </div>
            <div className='edit-button-container'>
              {editMode ? (
                <>
                  <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
                  <button className='update-button' onClick={() => handleUpdate(expert.status)}>Update Details</button>
                </>
              ) : (
                <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
              )}
              <button className='update-button' style={{ background: 'red' }} onClick={handleDelete}>Delete Expert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDetails;