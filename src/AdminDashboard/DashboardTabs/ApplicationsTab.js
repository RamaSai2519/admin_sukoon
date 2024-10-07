import React, { useEffect, useRef, useState } from "react";
import { RaxiosPost } from "../../services/fetchData";
import { Table, Flex, Radio, message } from "antd";
import { formatDate } from "../../Utils/formatHelper";
import Loading from "../../components/Loading/loading";
import EditableCell from "../../components/EditableCell";
import LazyLoad from "../../components/LazyLoad/lazyload";
import { raxiosFetchData } from "../../services/fetchData";
import getColumnSearchProps from "../../Utils/antTableHelper";

const ApplicationsTab = () => {
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState(
        localStorage.getItem('formType') === "event" ? "event" : "sarathi"
    );
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInputRef = useRef(null);

    useEffect(() => {
        raxiosFetchData(currentPage, pageSize, setApplications, setTotal, '/applicant', { formType }, setLoading);
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

    const handleSaveRemarks = async ({ key, field, value }) => {
        const response = await RaxiosPost('/remarks', { key, value });
        if (response.status !== 200) {
            message.error(response.msg);
        } else {
            let newApplications = [...applications];
            const index = newApplications.findIndex((item) => key === item._id);
            newApplications[index][field] = value;
            setApplications(newApplications);
            message.success(response.msg);
        }
    };

    const mergedColumns = columns.map((col) => {
        if (!col.editable) return col;
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSaveRemarks,
            })
        };
    });

    return (
        <LazyLoad>
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
        </LazyLoad>
    );
};

export default ApplicationsTab;
