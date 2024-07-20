import React, { useEffect, useState } from 'react';
import WaWhHistory from '../../components/WaWhHistory';
import WaFeedbacks from '../../components/WaFeedbacks';
import SendWAForm from '../../components/SendWAForm';
import Raxios from '../../services/axiosHelper';
import { ConfigProvider, theme, Button, Flex, Radio } from 'antd';
import { fetchPagedData } from '../../services/fetchData';
import { downloadExcel } from '../../Utils/exportHelper';

const WhatsappTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [table, setTable] = useState(localStorage.getItem('waTable') === 'history' ? 'history' : 'feedback');
    const [currentPage, setCurrentPage] = useState(localStorage.getItem('fcurrentPage') ? parseInt(localStorage.getItem('fcurrentPage')) : 1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const endpoint = table === 'feedback' ? '/wa/feedbacks' : '/wa/wahistory';
        fetchPagedData(currentPage, pageSize, setData, setTotalItems, setLoading, endpoint);
        // eslint-disable-next-line
    }, [currentPage, pageSize, table]);

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('fcurrentPage', current);
        setPageSize(pageSize);
    };

    const downloadData = async () => {
        const filename = table === 'feedback' ? 'Feedbacks' : 'History';
        const endpoint = table === 'feedback' ? '/wa/feedbacks' : '/wa/wahistory';

        let allData = [];
        try {
            const response = await Raxios.get(endpoint, { params: { size: 'all' } });
            allData = response.data.data;
        } catch (error) {
            console.error("Error fetching all data:", error);
            return;
        }

        let dataToWrite = [];
        if (filename === 'History') {
            allData.forEach((item) => {
                dataToWrite.push({
                    'User Name': item.userName,
                    'Phone Number': item.userNumber,
                    'Message': item.body,
                    'Received At': item.createdAt
                });
            });
        } else {
            allData.forEach((item) => {
                dataToWrite.push({
                    'User Name': item.userName,
                    'Expert Name': item.expertName,
                    'Message': item.body,
                    'Received At': item.createdAt
                });
            });
        }

        try {
            await downloadExcel(dataToWrite, `${filename}.xlsx`);
        } catch (error) {
            console.error("Error during export:", error);
        }
    };

    return (
        <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            <div className='min-h-screen p-5 w-full overflow-auto flex h-max '>
                <div className='flex flex-col w-1/2 mr-2'>
                    <div className='flex w-full justify-between items-center gap-2 mb-2'>
                        <Flex vertical>
                            <Radio.Group
                                value={table}
                                onChange={(e) => {
                                    localStorage.setItem('waTable', e.target.value);
                                    setTable(e.target.value);
                                }}
                            >
                                <Radio.Button value='history'>History</Radio.Button>
                                <Radio.Button value='feedback'>Feedback</Radio.Button>
                            </Radio.Group>
                        </Flex>
                        <Button onClick={downloadData}>Export</Button>
                    </div>
                    {table === 'history' ? (
                        <WaWhHistory
                            data={data}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            handleTableChange={handleTableChange}
                            loading={loading}
                        />
                    ) : (
                        <WaFeedbacks
                            data={data}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            handleTableChange={handleTableChange}
                            loading={loading}
                        />
                    )}
                </div>
                <div className='flex w-1/2 pl-2 md:border-l-2 dark:md:border-lightBlack'>
                    <SendWAForm />
                </div>
            </div>
        </ConfigProvider>
    );
};

export default WhatsappTab;
