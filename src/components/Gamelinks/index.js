import { Button, Select, Table } from 'antd';
import { useParams, useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import Raxios, { Paxios } from '../../services/axiosHelper';
import getColumnSearchProps from '../../Utils/antTableHelper';

const Gamelinks = () => {
    const { Option } = Select;
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const expertId = searchParams.get('expertId');
    const searchInputRef = useRef(null);
    const [allData, setAllData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [expertNames, setExpertNames] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedExpert, setSelectedExpert] = useState(expertId || null);

    const createColumn = (title, dataIndex, key, render) => {
        return {
            title,
            dataIndex,
            key,
            ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(render && { render }),
        };
    };

    const fetchAllLinks = async () => {
        try {
            const response = selectedExpert
                ? await Paxios.get(`/expert/getGamesByExpert?expertId=${selectedExpert}`)
                : await Paxios.get("/expert/getAllLinks");

            console.log(response.data);
            setAllData(response.data);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const fetchExpertLinks = async (expertId) => {
        try {
            const response = await Paxios.get(`/expert/getGamesByExpert?expertId=${expertId}`);
            console.log(response.data);
            setAllData(response.data);
        } catch (error) {
            console.error('Error fetching expert links:', error);
        }
    };

    const fetchExpertOptions = async () => {
        try {
            const response = await Raxios.get("/expert/getExpertNames");
            console.log(response.data);
            setExpertNames(response.data);
        } catch (error) {
            console.error('Error fetching experts:', error);
        }
    };

    useEffect(() => {
        fetchExpertLinks(expertId);
    }, [expertId]);

    useEffect(() => {
        fetchExpertOptions();
    }, []);

    useEffect(() => {
        fetchAllLinks();
    }, [selectedExpert]);

    const handleExpertChange = (value) => {
        setSelectedExpert(value);
        console.log(expertId);
    };

    const fcolumns = [
        createColumn('Expert Name', 'sarathiID', 'name', sarathiID => sarathiID.name),
        createColumn('Created At', 'createdAt', 'createdAt'),
        createColumn('Last Updated', 'updatedAt', 'updatedAt'),
        { title: 'Actions', dataIndex: 'gameLink', key: 'actions', render: (record) => <Button onClick={() => { navigator.clipboard.writeText(record); }}>Copy Link</Button> }
    ];

    return (
        <div className="w-full overflow-auto mt-5 gap-5 flex flex-col">
            <div>
                <Select
                    className='w-fit'
                    allowClear
                    showSearch
                    title='Select By Expert'
                    placeholder='Select By Expert'
                    onChange={handleExpertChange}
                    value={selectedExpert}
                    optionFilterProp="children"
                >
                    {expertNames.map((expert) => (
                        <Option key={expert._id} value={expert._id}>
                            {expert.name}
                        </Option>
                    ))}
                </Select>
            </div>
            <Table
                rowKey={(record) => record._id}
                columns={fcolumns}
                dataSource={allData}
                loading={allData.length === 0}
            />
        </div>
    );
};

export default Gamelinks;
