import React, { useEffect, useState } from 'react';
import { Flex, Radio } from 'antd';
import SendWAForm from '../../components/SendWAForm';
import WaWhHistory from '../../components/WaWhHistory';
import WaFeedbacks from '../../components/WaFeedbacks';
import { raxiosFetchData } from '../../services/fetchData';

const WhatsappTab = () => {
    const [table, setTable] = useState(localStorage.getItem('waTable') === 'history' ? 'history' : 'feedback');
    const [currentPage, setCurrentPage] = useState(localStorage.getItem('fcurrentPage') ? parseInt(localStorage.getItem('fcurrentPage')) : 1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const endpoint = '/actions/wa_history';
        const needType = table === 'history' ? 'webhook' : 'feedback';
        raxiosFetchData(currentPage, pageSize, setData, setTotalItems, endpoint, { type: needType }, setLoading);
        // eslint-disable-next-line
    }, [currentPage, pageSize, table]);

    const handleTableChange = (current, pageSize) => {
        setCurrentPage(current);
        localStorage.setItem('fcurrentPage', current);
        setPageSize(pageSize);
    };

    return (
        <div className='min-h-screen p-5 w-full overflow-auto flex md:flex-row flex-col h-max '>
            <div className='flex flex-col md:w-1/2 mr-2'>
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
            <div className='flex md:mt-0 mt-5 md:w-1/2 pl-2 md:border-l-2 dark:md:border-lightBlack'>
                <SendWAForm />
            </div>
        </div>
    );
};

export default WhatsappTab;
