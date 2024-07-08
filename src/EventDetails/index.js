import { Table, Button, ConfigProvider, Upload, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import LazyLoad from '../components/LazyLoad/lazyload';
import writeXlsxFile from 'write-excel-file';
import Raxios from '../services/axiosHelper';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { saveAs } from 'file-saver';
import { UploadOutlined } from '@ant-design/icons';

const EventDetails = () => {
    const { slug } = useParams();
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [mainTitle, setMainTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const darkMode = localStorage.getItem('darkMode') === 'true';



    const fetchEventDetails = async () => {
        Raxios.get(`/event/event?slug=${slug}`)
            .then(response => {
                setName(response.data.name);
                setMainTitle(response.data.mainTitle);
                setSubTitle(response.data.subTitle);
                setImage(response.data.imageUrl);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            })
    };

    const fetchUsers = async () => {
        Raxios.get(`/event/users?slug=${slug}`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching event details:', error);
            })
    };

    const handleUpdate = () => {
        Raxios.put(`/event/event?slug=${slug}`, {
            name,
            mainTitle,
            subTitle,
            slug,
            imageUrl: image
        })
            .then(response => {
                setName(response.data.name);
                setMainTitle(response.data.mainTitle);
                setSubTitle(response.data.subTitle);
                setImage(response.data.imageUrl);
                window.alert('Event details updated successfully.');
            })
            .catch(error => {
                console.error('Error updating event details:', error);
                window.alert('Error updating event details:', error);
            });
    };

    const handleUpload = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        Raxios.post('/service/upload', formData)
            .then(response => {
                setImage(response.data.file_url);
                message.success('Image uploaded successfully.');
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                message.error('Failed to upload image.');
            });

        return false; // Prevent upload to default action (browser upload)
    };

    useEffect(() => {
        fetchEventDetails();
        fetchUsers();
    }, [slug]);

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Contact', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'City', dataIndex: 'city', key: 'city' },
        { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', render: (time) => new Date(time).toLocaleString() },
        { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt', render: (time) => new Date(time).toLocaleString() }
    ];

    const downloadExcel = async () => {
        const wsData = [
            [
                { value: 'Name' },
                { value: 'Contact' },
                { value: 'Email' },
                { value: 'City' },
                { value: 'Created At' },
                { value: 'Updated At' }
            ]
        ];
        users.forEach(user => {
            wsData.push([
                { value: user.name },
                { value: user.phoneNumber },
                { value: user.email },
                { value: user.city },
                { value: new Date(user.createdAt).toLocaleString() },
                { value: new Date(user.updatedAt).toLocaleString() }
            ]);
        });
        const buffer = await writeXlsxFile(wsData, {
            headerStyle: {
                fontWeight: 'bold'
            },
            buffer: true
        });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'UserList.xlsx');
    };

    return (
        <LazyLoad>
            <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
                <div className="container flex flex-col px-5 min-h-screen">
                    <div id='details-header' className='flex flex-row items-center justify-between'>
                        <h1>Event Details</h1>
                        <button className='back-button' onClick={() => window.history.back()}>
                            <FaArrowLeft className="back-icon" />
                        </button>
                    </div>
                    <div className='flex w-full items-center justify-stretch '>
                        <div id='details-content' className='grid md:grid-cols-4 md:gap-4 items-center'>
                            <div className='grid-tile'>
                                <h3>Title</h3>
                                <input type="text" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} />
                            </div>
                            <div className='grid-tile'>
                                <h3>Subtitle</h3>
                                <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                            </div>
                            <div className='grid-tile'>
                                <h3>Name</h3>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='grid-tile'>
                                <h3>Image</h3>
                                <img src={image} alt='Event' />
                                <Upload beforeUpload={handleUpload} showUploadList={false}>
                                    <Button icon={<UploadOutlined />} className='w-full mt-2'>Edit Image</Button>
                                </Upload>
                            </div>
                        </div>
                        <div>
                            <Button className='w-fit' onClick={handleUpdate}>Update Details</Button>
                        </div>
                    </div>
                    <div className='w-full'>
                        <div className='flex justify-between'>
                            <h1>Registered Users</h1>
                            <Button onClick={downloadExcel}>Download Excel</Button>
                        </div>
                        <Table dataSource={users} columns={columns} rowKey={(record) => record._id || record.email} />
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
}


export default EventDetails;