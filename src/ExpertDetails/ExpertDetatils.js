import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Raxios from '../services/axiosHelper';
import S3Uploader from '../components/Upload';
import { fetchPlatfromsCategoriesAndSubCategories, RaxiosPost } from '../services/fetchData';
import React, { useState, useEffect } from 'react';
import { useCategories } from '../contexts/useData';
import Loading from '../components/Loading/loading';
import { raxiosFetchData } from '../services/fetchData';
import { Edit, RefreshCw, Trash2, X } from 'lucide-react';
import EditableTimeCell from '../components/EditableTimeCell';
import PropertyValueRenderer from '../components/JsonRenderer';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Select, Switch, Table, Input, Form, Button } from 'antd';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alertDialog";

const { Option } = Select;

const ExpertDetails = () => {
  const { number } = useParams();
  const expertId = localStorage.getItem('expertId');
  const [expert, setExpert] = useState({
    name: '', score: '', topics: '', status: '',
    persona: {}, profile: '', categories: [], phoneNumber: '',
    description: '', total_score: '', calls_share: '', repeat_score: ''
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { allCategories, fetchCategories } = useCategories();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [platformCategories, setPlatformCategories] = useState([]);
  const [timings, setTimings] = useState([]);
  const [form] = Form.useForm();

  const fetchExpertDetails = async () => {
    try {
      const response = await Raxios.get(`/actions/expert?phoneNumber=${number}`);
      const { __v, lastModifiedBy, calls, ...expertData } = response.data;
      setExpert(expertData);
      form.setFieldsValue(expertData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expert details:', error);
    }
  };

  const fetchTimings = async () => {
    const timings = await raxiosFetchData(null, null, null, null, '/actions/timings', { expert: expertId });
    setTimings(timings);
  };

  const fetchPlatformCategories = async () => {
    const fetchPlatformCategories = await fetchPlatfromsCategoriesAndSubCategories();
    setPlatformCategories(fetchPlatformCategories);
  }

  useEffect(() => {
    setLoading(true);
    fetchPlatformCategories();
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
    updatedFormData = { ...updatedFormData, sub_category: [] };
    if (updatedFormData.phoneNumber.length !== 10) return;
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
      <h3 className='text-lg'>{title}</h3>
      <div className="flex h-full justify-between items-center">
        <h2>{value}</h2>
        <Switch checked={switchValue} onChange={onChange} />
      </div>
    </div>
  );

  const formFields = [
    { name: 'status', label: 'Status', type: 'status' },
    { name: 'name', label: 'Name', type: 'input' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'input', disabled: true },
    { name: 'type', label: 'Type', type: 'select', options: ['expert', 'saarthi', 'internal'] },
    { name: 'languages', label: 'Languages', type: 'input' },
    { name: 'categories', label: 'Categories', type: 'select', options: allCategories, mode: 'multiple' },
    { name: 'platform_categories', label: 'Platform Categories', type: 'select', options: allCategories, mode: 'multiple' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'score', label: 'Score', type: 'input' },
    { name: 'repeat_score', label: 'Repeat Score', type: 'input' },
    { name: 'calls_share', label: 'Calls Share', type: 'input' },
    { name: 'total_score', label: 'Total Score', type: 'input' },
  ];

  
  const HandleObjectInSelect =   () => {
    
    const handleUpdate = async (updatedFormData) => {
      if(expert.phoneNumber && updatedFormData.sub_category?.length> 0) {
        let postObject = {
          phoneNumber: expert.phoneNumber,
          sub_category: updatedFormData.sub_category
        }
        await RaxiosPost('/actions/expert', postObject, true);
      }
    }
    return (
      <Form onFinish={handleUpdate}>
        <Form.Item name="sub_category" label="Platform Categories">
          <Select
            mode={'multiple'}
            className="w-full mt-2"
            placeholder={`Select  Platform`}
            disabled={!editMode}
          >
            {platformCategories.map((option) => (
              <Option key={option._id} value={option._id} >{option.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" title='Submit' htmlType="submit" className='flex items-center gap-2' >Submit</Button>      
        </Form>
    );
  };

  return (
    <div>
       <HandleObjectInSelect />
      {expert && (
        <Form form={form} className='' layout="vertical" onFinish={handleUpdate}>
        
          <div className='h3-darkgrey'>
            <div className='flex flex-row justify-between items-center p-5 overflow-auto'>
              <h1>Expert Details</h1>
              <div className='flex gap-5 items-center'>
                <div className='w-full flex gap-5 items-start p-5'>
                  {editMode &&
                    <Button type="primary" htmlType="submit" className='flex items-center gap-2'>
                      <RefreshCw className="w-4 h-4" /> Update Details
                    </Button>}
                  {editMode ? (
                    <Button onClick={() => setEditMode(false)} className='flex items-center gap-2'>
                      <X className="w-4 h-4" />Cancel
                    </Button>
                  ) : (
                    <Button onClick={() => setEditMode(true)} className='flex items-center gap-2'>
                      <Edit className="w-4 h-4" /> Edit Details
                    </Button>
                  )}
                  <Button danger onClick={() => setShowDeleteDialog(true)} className='flex items-center gap-2'>
                    <Trash2 className="h-4 w-4" /> Delete Expert
                  </Button>
                </div>
                <button className='back-button' onClick={() => { window.history.back(); localStorage.removeItem('expertId') }}>
                  <FaArrowLeft className="back-icon" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 p-5 overflow-auto">
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
              {formFields.map((field, idx) => (
                field.type === 'status' ? (
                  <div key={idx} className='grid grid-cols-2'>
                    <StatusTile
                      title="Status" value={expert.status === 'online' ? 'Online' : 'Offline'}
                      switchValue={expert.status === 'online'} onChange={() => handleUpdate({ ...expert, status: expert.status === 'offline' ? 'online' : 'offline' })}
                    />
                    <StatusTile
                      title="Busy" value={expert.isBusy ? 'Busy' : 'Available'}
                      switchValue={expert.isBusy} onChange={() => handleUpdate({ ...expert, isBusy: !expert.isBusy })}
                    />
                    <StatusTile
                      title="Active" value={expert.active ? 'Active' : 'Inactive'}
                      switchValue={expert.active} onChange={() => handleUpdate({ ...expert, active: !expert.active })}
                    />
                    <StatusTile
                      title="Profile" value={expert.profileCompleted ? 'Profile Completed' : 'Profile Incomplete'}
                      switchValue={expert.profileCompleted} onChange={() => handleUpdate({ ...expert, profileCompleted: !expert.profileCompleted })}
                    />
                  </div>
                ) : (
                  <div key={idx} className='grid-tile'>
                    <h3 className='text-lg'>{field.label}</h3>
                    <Form.Item name={field.name}>
                      {field.type === 'input' ? (
                        <Input type="text" className='mt-2' disabled={!editMode || field.disabled} />
                      ) : field.type === 'select' ? (
                        <Select mode={field.mode} className='w-full mt-2' placeholder={`Select ${field.label}`} disabled={!editMode}>
                          {field.options.map((option) => (<Option key={option} value={option} />))}
                        </Select>
                      ) : (
                        <Input.TextArea className='mt-2' rows={15} disabled={!editMode} />
                      )}
                    </Form.Item>
                  </div>
                )
              ))}
              {expert.persona &&
                <div className='grid-tile'>
                  <h3 className='text-lg'>Customer Persona</h3>
                  <PropertyValueRenderer data={expert.persona} />
                </div>
              }
              <div className='w-full'>
                <div id='timings' className='grid-tile-2 w-full'>
                  <h3 className='text-lg'>Timings</h3>
                  <Table components={components} columns={mergedColumns} dataSource={timings} pagination={false} rowKey={(record) => record._id} />
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="dark:bg-lightBlack dark:text-white bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDelete} danger type='primary' autoFocus>Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpertDetails;