import React, { useEffect, useState } from 'react';
import { Button, Card, Select, Input, Upload, message } from 'antd';
import { beforeUpload, generateOptions } from '../../Utils/antSelectHelper';
import { fetchData } from '../../services/fetchData';
import Loading from '../Loading/loading';
import Raxios from '../../services/axiosHelper';
import { UploadOutlined } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';
import Faxios from '../../services/raxiosHelper';

const SendWAForm = () => {
    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({});
    const [cities, setCities] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [selectedCities, setSelectedCities] = useState([]);
    const [messagePreview, setMessagePreview] = useState('');
    const [slugs, setSlugs] = useState([]);
    const [slug, setSlug] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [usersCount, setUsersCount] = useState(0);
    const [eventSlug, setEventSlug] = useState('');
    const [response, setResponse] = useState(false);
    // const [fetchStatus, setFetchStatus] = useState(false);
    // const [proNum, setProNum] = useState({
    //     count: 0,
    //     status: 'pending',
    // });
    // const [messageId, setMessageId] = useState('');

    const fetchAllData = async () => {
        setLoading(true);
        await fetchData(setCities, setLoading, '/data/userCities');
        await fetchData(setTemplates, setLoading, '/wa/templates');
        await fetchData(setSlugs, setLoading, '/event/slugs');
        setLoading(false);
    };

    // const fetchMessageStatus = async () => {
    //     try {
    //         const response = await Raxios.get('wa/proNum', {
    //             params: {
    //                 messageId,
    //                 proNum: proNum.count,
    //             },
    //         });

    //     } catch (error) {
    //         message.error('Error fetching message status:', error);

    //     }
    // };

    // useEffect(() => {
    //     if (fetchStatus && (proNum.status === "pending")) {
    //         console.log(proNum, "proNum");
    //         fetchMessageStatus()
    //     } else if (fetchStatus && (proNum.status === "done")) {
    //         message.success('Sent All Messages');
    //         setFetchStatus(false);
    //         setProNum(0);
    //     }
    // }, [proNum.count, fetchStatus]);

    useEffect(() => {
        fetchAllData();

        return () => {
            setTemplate(null);
            setInputs({});
            setSelectedType('');
            setSelectedCities([]);
            setMessagePreview('');
            setSlug('');
            setUploadedImageUrl('');
        };
    }, []);

    useEffect(() => {
        if (messagePreview.length > 1024) {
            message.error('Message length exceeds 1024 characters');
        }
    }, [messagePreview]);

    const fetchPreview = async () => {
        if (selectedType === "event" && !eventSlug) {
            return;
        }
        const response = await Faxios.post('/wa_options', {
            usersType: selectedType,
            cities: selectedCities,
            eventId: eventSlug,
            action: 'preview'
        });
        if (response.status !== 200) {
            message.error('Failed to fetch preview data');
        } else {
            setUsersCount(response.data.usersCount);
        }
    };

    useEffect(() => {
        if (selectedType || selectedCities.length > 0) {
            fetchPreview();
        }
    }, [selectedCities, selectedType, eventSlug]);

    useEffect(() => {
        if (template) {
            const initialInputs = {};
            const placeholders = template.message.match(/<\w+>/g) || [];
            placeholders.forEach((placeholder) => {
                if (placeholder === '<user_name>') {
                    initialInputs['<user_name>'] = localStorage.getItem('adminName') || 'Mr. X';
                } else if (placeholder === '<phone_number>') {
                    initialInputs['<phone_number>'] = '+91-8035752993';
                } else if (placeholder === '<whatsapp_community_link>') {
                    initialInputs['<whatsapp_community_link>'] = 'https://chat.whatsapp.com/Gvl7RE4Zu0i2C1tJIKSeYW'
                }
                else {
                    initialInputs[placeholder] = '';
                }
            });
            setInputs(initialInputs);
        }
    }, [template]);

    useEffect(() => {
        if (template) {
            let updatedMessage = template.message;
            Object.keys(inputs).forEach((key) => {
                updatedMessage = updatedMessage.replace(key, inputs[key] || key);
            });
            setMessagePreview(updatedMessage);
        }
    }, [inputs, template]);

    const handleInputChange = (placeholder, value) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            [placeholder]: value,
        }));
    };

    const handleUploadChange = (info) => {
        if (info.file.status === 'done') {
            setUploadedImageUrl(info.file.response.file_url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const handleSend = async () => {
        if (template.extra_args && template.extra_args.includes('registraion_link_slug') && !slug) {
            message.error('Please select a registration link slug');
            return;
        } else if (template.extra_args && template.extra_args.includes('image_link') && !uploadedImageUrl) {
            message.error('Please upload an image');
            return;
        } else if (selectedType === "event" && !eventSlug) {
            message.error('Please select an event slug');
            return;
        } else if (messagePreview.length > 1024) {
            message.error('Message length exceeds 1024 characters');
            return;
        }
        const newMessageId = uuidv4();
        const finalInputs = {
            ...inputs,
            '<registraion_link_slug>': slug,
            '<image_link>': uploadedImageUrl
        };
        setResponse(true);
        const response = await Faxios.post('/wa_options', {
            messageId: newMessageId,
            templateId: template._id,
            usersType: selectedType,
            eventId: eventSlug,
            cities: selectedCities,
            inputs: finalInputs,
            action: 'send'
        });
        if (response.status !== 200) {
            message.error('Failed to send messages');
        } else {
            window.alert(`Messages are being sent, please note down the message ID: ${newMessageId} for future reference`);
            // setFetchStatus(true);
        }
        setResponse(false);
        window.location.reload();
    };

    if (loading) return <Loading />;

    return (
        <div className='flex w-full gap-2'>
            <div className='flex flex-col w-full gap-2'>
                <Select
                    allowClear
                    showSearch
                    className='w-full'
                    placeholder="Select Template"
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        const selectedTemplate = templates.find(template => template._id === value);
                        setTemplate(selectedTemplate);
                    }}
                    onClear={() => {
                        setTemplate(null);
                        setMessagePreview('');
                        setInputs({});
                    }}
                >
                    {generateOptions(templates, 'name')}
                </Select>

                <Select
                    allowClear
                    placeholder="Select Users By Type"
                    className='w-full'
                    onChange={(value) => {
                        setSelectedType(value);
                        setSelectedCities([]);
                    }}
                    onClear={() => setSelectedType('')}
                    disabled={selectedCities.length > 0}
                >
                    <Select.Option value="partial">Partial Signups</Select.Option>
                    <Select.Option value="full">Complete Signups</Select.Option>
                    <Select.Option value="event">Event Signups</Select.Option>
                    <Select.Option value="all">All Users</Select.Option>
                </Select>
                {selectedType === "event" && <Select
                    allowClear
                    showSearch
                    className='w-full'
                    placeholder="Select Event Slug"
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => setEventSlug(value)}
                    onClear={() => setEventSlug('')}
                >
                    {generateOptions(slugs, 'slug')}
                </Select>}
                <Select
                    mode="multiple"
                    allowClear
                    showSearch
                    className='w-full'
                    placeholder="Select Users By City"
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        setSelectedCities(value);
                        setSelectedType('');
                    }}
                    onClear={() => setSelectedCities([])}
                    disabled={selectedType}
                >
                    {generateOptions(cities, 'city')}
                </Select>

                {template && Object.keys(inputs).map((placeholder, index) => (
                    <div className='grid grid-cols-2 gap-2 my-1' key={index}>
                        <Card size='small'><p className='overflow-clip text-ellipsis'>{placeholder}</p></Card>
                        <Input
                            placeholder="Enter value"
                            value={inputs[placeholder]}
                            onChange={(e) => handleInputChange(placeholder, e.target.value)}
                            disabled={placeholder === '<user_name>'}
                        />
                    </div>
                ))}
                <div className='flex items-center justify-center gap-2'>
                    {template && template.extra_args && template.extra_args.includes('image_link') && (
                        <Upload
                            name="file"
                            // listType="picture-card"
                            beforeUpload={beforeUpload}
                            onChange={handleUploadChange}
                            action="https://rama.sukoonunlimited.com/admin/service/upload"
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    )}
                    {template && template.extra_args && template.extra_args.includes('registraion_link_slug') && (
                        <Select
                            allowClear
                            showSearch
                            className='w-full'
                            placeholder="Select Registration Link Slug"
                            optionFilterProp='children'
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value) => setSlug(value)}
                            onClear={() => setSlug('')}
                        >
                            {slugs.map((slug, index) => (
                                <Select.Option key={index} value={slug.slug}>{slug.slug}</Select.Option>
                            ))}
                        </Select>
                    )}
                </div>
                <Button
                    type='primary'
                    className='w-full'
                    disabled={!template || (!selectedType && selectedCities.length === 0)}
                    onClick={handleSend}
                    loading={response}
                >
                    Send Message
                </Button>
                {/* {fetchStatus && <Progress percent={(proNum / usersCount) * 100} />} */}
            </div>
            {template && <div className='flex flex-col'>
                <Card className='w-full h-fit rounded-b-none'>
                    <div className='w-full flex justify-between items-center'>
                        <h1>Preview</h1>
                        <div className='flex flex-col'>
                            <span>Users Count: {usersCount}</span>
                            <span>Character Count: {messagePreview.length}</span>
                        </div>

                    </div>
                </Card>
                <Card className='w-full h-fit rounded-t-none'>
                    <span className='whitespace-pre-wrap'>{messagePreview}</span>
                </Card>
            </div>}
        </div>
    );
};

export default SendWAForm;