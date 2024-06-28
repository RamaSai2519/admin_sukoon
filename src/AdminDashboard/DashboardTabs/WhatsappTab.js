import React, { useEffect, useState } from 'react';
import WaWhHistory from '../../components/WaWhHistory';
import WaFeedbacks from '../../components/WaFeedbacks';
import Raxios from '../../services/axiosHelper';
import writeXlsxFile from 'write-excel-file';
import { ConfigProvider, theme, Button, Flex, Radio } from 'antd';
import { saveAs } from 'file-saver';

const WhatsappTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [table, setTable] = useState(localStorage.getItem('waTable') === 'history' ? 'history' : 'feedback');
    const [currentPage, setCurrentPage] = useState(localStorage.getItem('fcurrentPage') ? parseInt(localStorage.getItem('fcurrentPage')) : 1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const fetchData = async (page, size, endpoint) => {
        setLoading(true);
        const response = await Raxios.get(endpoint, { params: { page, size } });
        setData(response.data.data);
        setTotalItems(response.data.total);
        setLoading(false);
    };

    useEffect(() => {
        const endpoint = table === 'feedback' ? '/data/feedbacks' : '/data/wahistory';
        fetchData(currentPage, pageSize, endpoint);
        // eslint-disable-next-line
    }, [currentPage, pageSize, table]);

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('fcurrentPage', current);
        setPageSize(pageSize);
    };

    const downloadData = async () => {
        const filename = table === 'feedback' ? 'Feedbacks' : 'History';
        const endpoint = table === 'feedback' ? '/data/feedbacks' : '/data/wahistory';

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
            dataToWrite.push([
                { value: 'User Name' },
                { value: 'Phone Number' },
                { value: 'Message' },
                { value: 'Received At' }
            ]);
            allData.forEach((item) => {
                dataToWrite.push([
                    { value: item.userName },
                    { value: item.userNumber },
                    { value: item.body },
                    { value: item.createdAt }
                ]);
            });
        } else {
            dataToWrite.push([
                { value: 'User Name' },
                { value: 'Expert Name' },
                { value: 'Message' },
                { value: 'Received At' }
            ]);
            allData.forEach((item) => {
                dataToWrite.push([
                    { value: item.userName },
                    { value: item.expertName },
                    { value: item.body },
                    { value: item.createdAt }
                ]);
            });
        }

        try {
            const buffer = await writeXlsxFile(dataToWrite, {
                headerStyle: {
                    fontWeight: 'bold'
                },
                buffer: true
            });

            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `${filename}.xlsx`);
        } catch (error) {
            console.error("Error during export:", error);
        }
    };

    return (
        <ConfigProvider theme={{ algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm }}>
            <div className='min-h-screen p-5 w-full overflow-auto'>
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
        </ConfigProvider>
    );
};

export default WhatsappTab;
