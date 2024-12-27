'use client'

import React, { useEffect, useState } from 'react'
import { raxiosFetchData } from '../../services/fetchData'
import { Button, Card, List } from 'antd'

const Chats = () => {
    const [histories, setHistories] = useState([])
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(0)
    const [size, setSize] = useState(20)
    const [page, setPage] = useState(
        localStorage.getItem('chatsPage') ? parseInt(localStorage.getItem('chatsPage')) : 1
    )
    const [selectedChat, setSelectedChat] = useState(null)

    const fetchChats = async () => {
        await raxiosFetchData(page, size, setHistories, setTotal, '/actions/histories', null, setLoading)
    }

    useEffect(() => { fetchChats() }, [page, size])

    const handlListChange = (current, pageSize) => {
        setPage(current);
        localStorage.setItem('chatsPage', current);
        setSize(pageSize);
    };

    return (
        <div className='w-ful flex gap-10 py-5'>
            <div className='w-1/4 flex flex-col gap-5'>
                <List
                    size="small"
                    bordered
                    dataSource={histories}
                    pagination={{
                        onChange: handlListChange,
                        pageSize: size,
                        total: total,
                        showSizeChanger: false
                    }}
                    renderItem={item => (
                        <List.Item onClick={() => setSelectedChat(item)}>
                            <span>{item.phoneNumber}</span>
                            <span>{item.createdAt}</span>
                        </List.Item>
                    )}
                />
            </div>
            <div className='w-3/4'>
                {selectedChat && (
                    <Card>
                        <div className='flex justify-between'>
                            <span>{selectedChat.phoneNumber}</span>
                            <span>{selectedChat.createdAt}</span>
                        </div>
                        <div className='mt-5'>
                            <div className='flex flex-col gap-5'>
                                {selectedChat.history.map((message, index) => (
                                    message.role === 'user' ? (
                                        <div key={index} className='flex justify-start'>
                                            {message.role}
                                            <span className='p-3 rounded-lg'>{message.content}</span>
                                        </div>
                                    ) : message.role === 'assistant' ? (
                                        <div key={index} className='flex justify-end'>
                                            {message.role}
                                            <span className='p-3 rounded-lg'>{message.content}</span>
                                        </div>
                                    ) : (
                                        <></>
                                    )
                                ))}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Chats

