import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import S3Uploader from '../components/Upload';
import { RaxiosPost } from '../services/fetchData';
import React, { useState, useEffect } from 'react';
import { useCategories } from '../services/useData';
import Loading from '../components/Loading/loading';
import { raxiosFetchData } from '../services/fetchData';
import { message, Select, Switch, Table, Input } from 'antd';
import EditableTimeCell from '../components/EditableTimeCell';

const { Option } = Select;

const ExpertDetails = () => {
  const { number } = useParams();
  const expertId = localStorage.getItem('expertId');
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
    calls_share: ''
  });
  const { allCategories, fetchCategories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [persona, setPersona] = useState('');
  const [timings, setTimings] = useState([]);

  const fetchExpertDetails = async () => {
    try {
      const response = await Raxios.get(`/actions/expert?phoneNumber=${number}`);
      const { __v, lastModifiedBy, calls, persona, ...expertData } = response.data;
      setExpert(expertData);
      if (typeof persona === 'object') {
        const personaString = JSON.stringify(persona, null, 2);
        // eslint-disable-next-line
        const personaWithoutQuotes = personaString.replace(/\"/g, '');
        setPersona(personaWithoutQuotes);
      } else {
        setPersona(persona);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expert details:', error);
    }
  };

  const fetchTimings = async () => {
    const timings = await raxiosFetchData(null, null, null, null, '/actions/timings', { expert: expertId });
    setTimings(timings);
  };

  useEffect(() => {
    setLoading(true);
    fetchCategories();
    fetchTimings();
    fetchExpertDetails();

    // eslint-disable-next-line
  }, [expertId]);

  useEffect(() => {
    if (!loading && window.location.hash === '#timings') {
      const timingsElement = document.getElementById('timings');
      if (timingsElement) {
        timingsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [loading, timings]);

  const handleInputChange = (name, value) => {
    const updatedExpert = { ...expert, [name]: value };
    setExpert(updatedExpert);
    setTimeout(() => handleUpdate(updatedExpert), 1000);
  };

  const handleUpdate = async (updatedFormData) => {
    if (updatedFormData.phoneNumber.length !== 10) {
      return
    }
    try {
      const response = await Raxios.post('/actions/expert', updatedFormData);
      if (response.status !== 200) {
        message.error(response.msg);
      } else {
        fetchExpertDetails();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    await handleUpdate({ ...expert, isDeleted: true });
    window.history.back();
  };

  const handleSave = async (row) => {
    await RaxiosPost('/actions/timings', { expertId, row }, true);
    fetchTimings();
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
            <button className='back-button' onClick={() => { window.history.back(); localStorage.removeItem('expertId') }}>
              <FaArrowLeft className="back-icon" />
            </button>
          </div>
          <div className="grid grid-cols-2 p-5 overflow-auto">
            <div className="grid-tile-2">
              {/* <img src={expert.profile} alt="Expert Profile" className='max-h-52' /> */}
              <S3Uploader setFileUrl={(url) => handleUpdate({ ...expert, profile: url })} finalFileUrl={expert.profile} />
            </div>
            {['status', 'name', 'phoneNumber', 'type', 'languages'].map((field, idx) => (
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
                field === 'type' ?
                  <div className='grid-tile'>
                    <h3>Type</h3>
                    <Select
                      className='w-full'
                      placeholder="Select Type"
                      value={expert.type}
                      onChange={(value) => handleUpdate({ ...expert, type: value })}
                    >
                      <Option value="expert">Expert</Option>
                      <Option value="saarthi">Sarathi</Option>
                      <Option value="internal">Internal</Option>
                    </Select>
                  </div>
                  : field === "phoneNumber" ?
                    <div key={idx} className='grid-tile'>
                      <h3>Phone Number</h3>
                      <span className='text-xl'>{expert.phoneNumber}</span>
                    </div>
                    :
                    <div key={idx} className='grid-tile'>
                      <h3>{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
                      <input
                        type="text"
                        className='dark:bg-darkBlack dark:border-darkGray border p-0.5 pl-2 rounded-md'
                        value={expert[field]}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                      />
                    </div>
            ))}
            <div className='grid-tile'>
              <h3>Categories</h3>
              <Select
                mode="multiple" className='w-full'
                placeholder="Select Categories" value={expert.categories}
                onChange={(value) => handleUpdate({ ...expert, categories: value })}
              >
                {allCategories.map((category) => (
                  <Option key={category} value={category} />
                ))}
              </Select>
            </div>
            <div className='grid grid-cols-4'>
              {['score', 'repeat_score', 'calls_share', 'total_score'].map((field, idx) => (
                <div key={idx} className='grid-tile'>
                  <h3>{field.split(/(?=[A-Z])/).join(' ')}</h3>
                  <Input
                    value={expert[field]}
                    onChange={(e) => handleInputChange(field, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </div>
            <div className='grid-tile'>
              <h3>Description</h3>
              <Input.TextArea
                rows={15}
                value={expert.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
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
            {persona &&
              <div className='grid-tile'>
                <h3>Customer Persona</h3>
                <p className='text-xl whitespace-pre-wrap'>{persona}</p>
              </div>
            }
            <div className='edit-button-container'>
              <button className='update-button' style={{ background: 'red' }} onClick={handleDelete}>Delete Expert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDetails;