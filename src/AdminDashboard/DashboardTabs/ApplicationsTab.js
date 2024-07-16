import React, { useRef, useState } from "react";
import { Table, ConfigProvider, theme, Flex, Radio } from "antd";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";
import { formatDate } from "../../Utils/formatHelper";
import { fetchPagedData } from "../../services/fetchData";
import getColumnSearchProps from "../../Utils/antTableHelper";
import EditableCell from "../../components/EditableCell";
import Raxios from "../../services/axiosHelper";

const ApplicationsTab = () => {
    const [applications, setApplications] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [formType, setFormType] = React.useState(
        localStorage.getItem('formType') === "event" ? "event" : "sarathi"
    );
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    React.useEffect(() => {
        fetchPagedData(currentPage, pageSize, setApplications, setTotal, setLoading, `/data/applications`, { formType });
    }, [currentPage, pageSize, formType]);

    const createColumn = (title, dataIndex, key, render, width, editable) => {
        return {
            title,
            dataIndex,
            key,
            ...getColumnSearchProps(dataIndex, title, searchText, setSearchText, searchedColumn, setSearchedColumn, searchInputRef),
            ...(render && { render }),
            ...(width && { width }),
            ...(editable && { editable }),
        };
    };

    const columns = [
        createColumn("Name", "name", "name"),
        createColumn("Email", "email", "email"),
        createColumn("Gender", "gender", "gender"),
        createColumn("Phone Number", "phoneNumber", "phoneNumber"),
        createColumn("Date of Birth", "dateOfBirth", "dateOfBirth", (dateOfBirth) => formatDate(dateOfBirth)),
        createColumn("Remarks", "remarks", "remarks", null, '', true),
        createColumn("languages", "languages", "languages"),
        createColumn("workingHours", "workingHours", "workingHours"),
        createColumn("skills", "skills", "skills"),
        createColumn("Applied Date", "createdDate", "createdDate", (createdDate) => formatDate(createdDate)),
    ];

    const components = {
        body: {
            cell: EditableCell,
        },
    };

    const handleSave = async ({ key, field, value }) => {
        try {
            await Raxios.post('/user/leadRemarks', { key, field, value })
                .then((response) => {
                    if (response.request.status === 200) {
                        let newApplications = [...applications];
                        const index = newApplications.findIndex((item) => key === item._id);
                        newApplications[index][field] = value;
                        setApplications(newApplications);
                        window.alert(response.data.message);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="min-h-screen p-5 w-full overflow-auto">
                    <div className="flex w-full justify-between items-center gap-2">
                        <Flex vertical>
                            <Radio.Group
                                value={formType}
                                onChange={(e) => {
                                    setFormType(e.target.value);
                                    localStorage.setItem('formType', e.target.value);
                                }}
                            >
                                <Radio.Button value="sarathi">Sarathis</Radio.Button>
                                <Radio.Button value="event">Event Hosts</Radio.Button>
                            </Radio.Group>
                        </Flex>
                    </div>
                    {loading ? (
                        <Loading />
                    ) : (
                        <LazyLoad>
                            <Table
                                className="my-5"
                                columns={mergedColumns}
                                components={components}
                                dataSource={applications}
                                rowKey={(record) => record._id}
                                pagination={{
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: total,
                                    onChange: (page, pageSize) => {
                                        setCurrentPage(page);
                                        setPageSize(pageSize);
                                    },
                                }}
                            />
                        </LazyLoad>
                    )}
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default ApplicationsTab;
