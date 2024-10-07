// import { Button, message, Select, Table } from 'antd';
// import React, { useEffect, useRef, useState } from 'react';
// import Faxios from '../../services/axiosHelper';
// import getColumnSearchProps from '../../Utils/antTableHelper';
// import { formatTime } from '../../Utils/formatHelper';
// import { useLocation } from 'react-router-dom';

// const Gamelinks = () => {
//     const { Option } = Select;
//     const location = useLocation();
//     const searchParams = new URLSearchParams(location.search);
//     const expertId = searchParams.get('expertId');
//     const searchInputRef = useRef(null);
//     const [allData, setAllData] = useState([]);
//     const [searchText, setSearchText] = useState('');
//     const [expertNames, setExpertNames] = useState([]);
//     const [searchedColumn, setSearchedColumn] = useState('');
//     const [selectedExpert, setSelectedExpert] = useState(expertId || null);
//     const [loading, setLoading] = useState(false);

//     const fetchAllLinks = async () => {
//         setLoading(true);
//         try {
//             const response = selectedExpert
//                 ? await Faxios.get(`/expert/getGamesByExpert?expertId=${selectedExpert}`)
//                 : await Faxios.get("/expert/getAllLinks");
//             setAllData(response.data);
//         } catch (error) {
//             if (error.response.status === 404) {
//                 message.error("Expert doesn't have any links");
//             } else if (error.response.status === 400) {
//                 message.error('Invalid expert ID');
//             }
//             console.error('Error fetching game links:', error);
//             message.error('Failed to fetch data');
//         }
//         setLoading(false);
//     };

//     const fetchExpertOptions = async () => {
//         setLoading(true);
//         try {
//             const response = await Faxios.get("/expert/getExpertNames");
//             setExpertNames(response.data);
//         } catch (error) {
//             console.error('Error fetching experts:', error);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchExpertOptions();
//     }, []);

//     useEffect(() => {
//         fetchAllLinks();
//         // eslint-disable-next-line
//     }, [selectedExpert]);

//     const handleExpertChange = (value) => {
//         setSelectedExpert(value);
//     };

//     const createColumn = (title, dataIndex, key, render) => {
//         return {
//             title,
//             dataIndex,
//             key,
//             ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
//             ...(render && { render }),
//         };
//     };

//     const columns = [
//         createColumn('Expert Name', 'sarathiID', 'name', sarathiID => sarathiID.name),
//         createColumn('User Name', 'gameLink', 'userName', gameLink => new URLSearchParams(gameLink.split('?')[1]).get('userName')),
//         createColumn('Game Started At', 'createdAt', 'createdAt', createdAt => formatTime(createdAt)),
//         { title: 'Actions', dataIndex: 'gameLink', key: 'actions', render: (record) => <Button onClick={() => { navigator.clipboard.writeText(record); }}>Copy Link</Button> }
//     ];

//     return (
//         <div className="w-full overflow-auto mt-5 gap-5 flex flex-col">
//             <div className='flex gap-2'>
//                 <Select
//                     className='w-fit'
//                     allowClear
//                     showSearch
//                     title='Select By Expert'
//                     placeholder='Select By Expert'
//                     onChange={handleExpertChange}
//                     value={selectedExpert}
//                     optionFilterProp="children"
//                 >
//                     {expertNames.map((expert) => (
//                         <Option key={expert._id} value={expert._id}>
//                             {expert.name}
//                         </Option>
//                     ))}
//                 </Select>
//                 <Button
//                     onClick={() => { setSelectedExpert(null); }}
//                 >Clear Selection</Button>
//             </div>
//             <Table
//                 rowKey={(record) => record._id}
//                 columns={columns}
//                 dataSource={allData.reverse()}
//                 loading={loading}
//             />
//         </div>
//     );
// };

// export default Gamelinks;
