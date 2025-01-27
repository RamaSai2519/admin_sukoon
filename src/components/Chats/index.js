'use client'

import React, { useEffect, useState } from 'react'
import Loading from '../Loading/loading'
import { useNavigate } from 'react-router-dom'
import { formatTime } from '../../Utils/formatHelper'
import { Table, Button, Form, Input, Select } from 'antd'
import { raxiosFetchData } from '../../services/fetchData'

const Chats = () => {
    const [viewTools, setViewTools] = useState(false)
    const [histories, setHistories] = useState([])
    const [loading, setLoading] = useState(false)
    const [filters, setFilters] = useState({
        filter_field: 'phoneNumber',
        filter_value: ''
    })
    const [total, setTotal] = useState(0)
    const [size, setSize] = useState(10)
    const [page, setPage] = useState(
        localStorage.getItem('chatsPage') ? parseInt(localStorage.getItem('chatsPage')) : 1
    )
    const [selectedChat, setSelectedChat] = useState(null)
    const navigate = useNavigate()

    const fetchChats = async () => {
        await raxiosFetchData(page, size, setHistories, setTotal, '/actions/histories', filters, setLoading)
    }

    // eslint-disable-next-line
    useEffect(() => { fetchChats() }, [page, size, filters])

    const handlListChange = (current, pageSize) => {
        setPage(current);
        localStorage.setItem('chatsPage', current);
        setSize(pageSize);
    };

    const truncateContent = (content, limit) => {
        if (content.length > limit) {
            return content.substring(0, limit) + '...';
        }
        return content;
    };

    const formatContent = (content) => {
        return content?.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
    };

    function formatTimeStr(timeStr, minutesToAdd = 660) {
        if (timeStr.endsWith('Z')) return formatTime(timeStr);
        timeStr = timeStr.replace(' ', 'T');
        const date = new Date(timeStr);
        date.setMinutes(date.getMinutes() + minutesToAdd);
        const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);
        return formattedDate;
    }

    const columns = [
        { title: 'Name', key: 'name', render: (record) => (record.user?.name ? `${record.user.name} (${record.phoneNumber})` : record.phoneNumber) },
        { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: '107px' }
    ];

    const handleRefresh = async () => {
        const selectedChatId = selectedChat._id;
        await fetchChats();
        setSelectedChat(histories.find((history) => history._id === selectedChatId));
    }

    useEffect(() => {
        if (selectedChat) {
            const chatView = document.getElementById('chat-view');
            chatView.scrollTop = chatView.scrollHeight;
        }
    }, [selectedChat]);

    const handleUserView = (record) => {
        navigate(`/admin/users/${record.user._id}`);
    }

    if (loading) return <Loading />;

    return (
        <div className='w-ful flex gap-10 py-5'>
            <div className='w-1/4 flex flex-col'>
                <Form className='flex w-full justify-center items-center gap-2' onFinish={(values) => setFilters(values)} initialValues={filters}>
                    <Form.Item name='filter_value' required>
                        <Input placeholder='Search...' />
                    </Form.Item>
                    <Form.Item name='filter_field' required>
                        <Select defaultValue='phoneNumber'>
                            <Select.Option value='phoneNumber'>Phone Number</Select.Option>
                            <Select.Option value='createdAt'>Created At</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit'>Search</Button>
                    </Form.Item>
                </Form>
                <Table
                    columns={columns}
                    dataSource={histories}
                    rowKey={item => item._id}
                    pagination={{
                        onChange: handlListChange,
                        current: page,
                        pageSize: size,
                        total: total,
                        showSizeChanger: false
                    }}
                    onRow={(record) => ({
                        onClick: () => setSelectedChat(record),
                    })}
                    rowClassName={'cursor-pointer'}
                />
            </div>
            <div className='w-3/4'>
                {selectedChat ? (
                    <div className='h-[88vh] overflow-auto no-scrollbar border border-lightBlack rounded-2xl' id='chat-view'>
                        <div className='p-5 flex items-center justify-between w-full border dark:border-lightBlack bg-white dark:bg-lightBlack sticky top-0' id='chat-header'>
                            <span className='cursor-pointer' onClick={() => handleUserView(selectedChat)}>
                                {selectedChat.user?.name || selectedChat.phoneNumber} <span className='text-gray-500'>({selectedChat.context === 'wa_webhook' ? 'Whatsapp' : selectedChat.context})</span>
                            </span>
                            <div className='flex gap-5'>
                                <Button onClick={handleRefresh}>Refresh</Button>
                                <Button onClick={() => setViewTools(!viewTools)}>
                                    {viewTools ? 'Hide Tool Calls' : 'View Tool Calls'}
                                </Button>
                            </div>
                        </div>
                        <div className='p-2'>
                            <div className='flex flex-col gap-2'>
                                {selectedChat.history.map((message, index) => (
                                    message.role === 'user' ? (
                                        <div key={index} className='flex flex-col px-3 py-2 justify-start max-w-[80%] mr-auto rounded-2xl rounded-bl-none border dark:border-lightBlack dark:bg-lightBlack'>
                                            <span className='text-gray-500'>{message.role}</span>
                                            <span className='p-2 rounded-lg' dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}></span>
                                            {message.timestamp && <span className='text-gray-500 text-right text-xs'>{formatTimeStr(message.timestamp)}</span>}
                                        </div>
                                    ) : message.role === 'assistant' ? (
                                        <>
                                            {message.tool_calls ? (
                                                <div className='flex px-3 py-2 flex-col justify-end items-end rounded-2xl rounded-b-none border dark:border-lightBlack dark:bg-lightBlack max-w-[60%] ml-auto'>
                                                    {viewTools ? <>
                                                        <span className='text-gray-500'>{message.role} tool call</span>
                                                        {message.tool_calls.map((call, index) => (
                                                            <div key={index} className='flex px-1 flex-col'>
                                                                <p>Called tool <b>{call.function.name}</b> with arguments <b>{truncateContent(call.function.arguments, 200)}</b></p>
                                                            </div>
                                                        ))}
                                                        {message.timestamp && <span className='text-gray-500 text-right text-xs'>{formatTimeStr(message.timestamp)}</span>}
                                                    </> :
                                                        <>
                                                            <span className='text-gray-500'>{message.role} made a tool call</span>
                                                        </>
                                                    }
                                                </div>
                                            ) : (
                                                <div className='flex px-3 py-2 flex-col justify-end items-end rounded-2xl rounded-br-none border dark:border-lightBlack dark:bg-lightBlack max-w-[80%] ml-auto'>
                                                    <span className='text-gray-500'>{message.role}</span>
                                                    <span className='p-2 rounded-lg text-left w-full' dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}></span>
                                                    {message.timestamp && <span className='text-gray-500 text-right text-xs'>{formatTimeStr(message.timestamp)}</span>}
                                                </div>
                                            )}
                                        </>
                                    ) : message.role === 'tool' ? (
                                        <div className='flex px-3 py-2 flex-col justify-end items-end rounded-2xl rounded-b-none border dark:border-lightBlack dark:bg-lightBlack max-w-[60%] ml-auto'>
                                            {viewTools ? <>
                                                <span className='text-gray-500'>{message.role} response</span>
                                                <span className='p-2 rounded-lg' dangerouslySetInnerHTML={{ __html: formatContent(truncateContent(message.content, 250)) }}></span>
                                                {message.timestamp && <span className='text-gray-500 text-right text-xs'>{formatTimeStr(message.timestamp)}</span>}
                                            </> : <>
                                                <span className='text-gray-500'>{message.role} returned a response</span>
                                            </>}
                                        </div>
                                    ) : <></>
                                ))}
                                <div className='flex p-2 flex-col justify-end items-end rounded-2xl border dark:border-lightBlack dark:bg-lightBlack ml-auto'>
                                    <span>
                                        {selectedChat.status === 'inprogress' ? "Typing..." : "Done"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                    <div className='h-[88vh] overflow-auto no-scrollbar border border-lightBlack rounded-2xl flex justify-center items-center'>
                        <span>Select a chat to view</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default Chats

