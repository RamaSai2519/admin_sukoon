import Raxios from '../../services/axiosHelper';
import React, { useState, useEffect } from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import Loading from '../../components/Loading/loading';
import LazyLoad from '../../components/LazyLoad/lazyload';

const WhatsappTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [loading, setLoading] = useState(false);
    const [incomingData, setIncomingData] = useState([]);
    const [outgoingData, setOutgoingData] = useState([]);

    const fetchData = async () => {
        setLoading(true);
        const response = await Raxios.get('/data/wahistory');
        setIncomingData(response.data.filter((item) => item.type === 'Incoming'))
        setOutgoingData(response.data.filter((item) => item.type === 'Outgoing'))
        console.log(response.data, "incomingData");
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const outgoingColumns = [
        { title: "User Name", dataIndex: "userName", key: "userName" },
        { title: "Phone Number", dataIndex: "userNumber", key: "userNumber" },
        { title: "Template", dataIndex: "templateName", key: "templateName" },
        { title: "Sent At", dataIndex: "createdAt", key: "createdAt" },
        { title: "Status", dataIndex: "status", key: "status" },
    ]

    const incomingColumns = [
        { title: "User Name", dataIndex: "userName", key: "userName" },
        { title: "Phone Number", dataIndex: "userNumber", key: "userNumber" },
        { title: "Message", dataIndex: "body", key: "body" },
        { title: "Received At", dataIndex: "createdAt", key: "createdAt" },
    ]

    if (loading) {
        return <Loading />;
    }

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="min-h-screen py-2">
                    <div className='grid md:grid-cols-2 md:gap-4 w-full'>
                        <div className='md:border-r-2 md:border-lightBlack md:pr-4'>
                            <h1 className="text-2xl font-bold mb-2">Incoming Messages</h1>
                            <Table dataSource={incomingData} columns={incomingColumns} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Outgoing Messages</h1>
                            <Table dataSource={outgoingData} columns={outgoingColumns} />
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default WhatsappTab;