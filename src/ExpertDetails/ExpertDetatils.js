import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import S3Uploader from '../components/Upload';
import { RaxiosPost } from '../services/fetchData';
import React, { useState, useEffect } from 'react';
import { useCategories } from '../contexts/useData';
import Loading from '../components/Loading/loading';
import { raxiosFetchData } from '../services/fetchData';
import EditableTimeCell from '../components/EditableTimeCell';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Select, Switch, Table, Input, Form, Button } from 'antd';

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
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();

  const fetchExpertDetails = async () => {
    try {
      const response = await Raxios.get(`/actions/expert?phoneNumber=${number}`);
      const { __v, lastModifiedBy, calls, persona, ...expertData } = response.data;
      setExpert(expertData);
      form.setFieldsValue(expertData);
      if (typeof persona === 'object') {
        const personaString = JSON.stringify(persona, null, 2);
        const personaWithoutQuotes = personaString.replace(/"/g, '');
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

  const handleUpdate = async (updatedFormData) => {
    console.log("🚀 ~ handleUpdate ~ updatedFormData:", updatedFormData)
    if (updatedFormData.phoneNumber.length !== 10) {
      return;
    }
    try {
      const response = await Raxios.post('/actions/expert', updatedFormData);
      if (response.status !== 200) {
        message.error(response.msg);
      } else {
        fetchExpertDetails();
        message.success(response.msg);
        setEditMode(false);
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
          <div className="">
            <Form form={form} className='grid grid-cols-2 p-5 overflow-auto' layout="vertical" onFinish={handleUpdate}>
              <div className='flex justify-between w-full h-full'>
                <div className="grid-tile-2">
                  <S3Uploader setFileUrl={(url) => handleUpdate({ ...expert, profile: url })} finalFileUrl={expert.profile} />
                </div>
                <div className='grid-tile'>
                  <Form.List name="highlights">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                          <div key={key} className="flex items-center gap-2 mb-2">
                            <Form.Item
                              className='mb-0'
                              {...restField}
                              name={[name, 'icon']}
                              fieldKey={[fieldKey, 'icon']}
                              rules={[{ required: true, message: 'Missing icon URL' }]}
                            >
                              <Input disabled={!editMode} placeholder="Icon URL" suffix={
                                <S3Uploader
                                  disabled={!editMode}
                                  show={false}
                                  setFileUrl={(url) => form.setFieldValue(['highlights', name, 'icon'], url)}
                                  finalFileUrl={form.getFieldValue(['highlights', name, 'icon'])}
                                />
                              } />
                            </Form.Item>
                            <Form.Item
                              className='mb-0'
                              {...restField}
                              name={[name, 'text']}
                              fieldKey={[fieldKey, 'text']}
                              rules={[{ required: true, message: 'Missing text' }]}
                            >
                              <Input disabled={!editMode} className='h-[43.5px]' placeholder="Text" />
                            </Form.Item>
                            {editMode && <MinusCircleOutlined className='text-red-600' onClick={() => remove(name)} />}
                          </div>
                        ))}
                        <Form.Item>
                          <Button type="dashed" disabled={!editMode} onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Highlight
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </div>
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
                      <Form.Item name="type">
                        <Select
                          disabled={!editMode}
                          className='w-full mt-2'
                          placeholder="Select Type"
                          onChange={(value) => handleUpdate({ ...expert, type: value })}
                        >
                          <Option value="expert">Expert</Option>
                          <Option value="saarthi">Sarathi</Option>
                          <Option value="internal">Internal</Option>
                        </Select>
                      </Form.Item>
                    </div>
                    : field === "phoneNumber" ?
                      <Form.Item key={idx} className='grid-tile' name={field}>
                        <h3>Phone Number</h3>
                        <Input className='text-xl' disabled value={expert[field]} />
                      </Form.Item>
                      :
                      <div key={idx} className='grid-tile'>
                        <h3>{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
                        <Form.Item name={field}>
                          <Input
                            type="text"
                            className='mt-2'
                            onChange={(e) => handleUpdate({ ...expert, [field]: e.target.value })}
                            disabled={!editMode}
                          />
                        </Form.Item>
                      </div>
              ))}
              <div className='grid-tile'>
                <h3>Categories</h3>
                <Form.Item name="categories">
                  <Select
                    mode="multiple" className='w-full mt-2'
                    placeholder="Select Categories"
                    onChange={(value) => handleUpdate({ ...expert, categories: value })}
                    disabled={!editMode}
                  >
                    {allCategories.map((category) => (
                      <Option key={category} value={category} />
                    ))}
                  </Select>
                </Form.Item>
              </div>
              <div className='grid grid-cols-4'>
                {['score', 'repeat_score', 'calls_share', 'total_score'].map((field, idx) => (
                  <div key={idx} className='grid-tile'>
                    <h3>{field.split(/(?=[A-Z])/).join(' ')}</h3>
                    <Form.Item name={field}>
                      <Input
                        onChange={(e) => handleUpdate({ ...expert, [field]: parseFloat(e.target.value) })}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </div>
                ))}
              </div>
              <div className='grid-tile'>
                <h3>Description</h3>
                <Form.Item name="description">
                  <Input.TextArea
                    className='mt-2'
                    rows={15}
                    onChange={(e) => handleUpdate({ ...expert, description: e.target.value })}
                    disabled={!editMode}
                  />
                </Form.Item>
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
                {editMode && <Button type="primary" htmlType="submit">Update Details</Button>}
                {editMode ? (
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                ) : (
                  <Button onClick={() => setEditMode(true)}>Edit Details</Button>
                )}
                <Button danger onClick={handleDelete}>Delete Expert</Button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDetails;