import React from "react";
import Raxios from "../../services/axiosHelper";
import { Table, ConfigProvider, theme, Flex, Radio } from "antd";
import LazyLoad from "../../components/LazyLoad/lazyload";
import Loading from "../../components/Loading/loading";

const ApplicationsTab = () => {
    const [applications, setApplications] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [formType, setFormType] = React.useState(
        localStorage.getItem('formType') === "sarathi" ? "sarathi" : "event"
    );
    const darkMode = localStorage.getItem('darkMode') === 'true';

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await Raxios.get(`/data/applications?page=${currentPage}&size=${pageSize}&formType=${formType}`);
            setApplications(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Failed to fetch applications", error);
        }
        setLoading(false);
    };

    React.useEffect(() => {
        fetchApplications();
        // eslint-disable-next-line
    }, [currentPage, pageSize, formType]);

    const columns = [
        { title: "Name", dataIndex: "name", key: "name",},
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Gender", dataIndex: "gender", key: "gender" },
        { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber" },
        {
            title: "Date of Birth", dataIndex: "dateOfBirth", key: "dateOfBirth",
            render: (dateOfBirth) => new Date(dateOfBirth).toLocaleDateString()
        },
        { title: "languages", dataIndex: "languages", key: "languages" },
        { title: "workingHours", dataIndex: "workingHours", key: "workingHours" },
        { title: "skills", dataIndex: "skills", key: "skills" },
        {
            title: "Applied Date", dataIndex: "createdDate", key: "createdDate",
            render: (createdDate) => new Date(createdDate).toLocaleDateString(),
        },
    ];

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
                                <Radio.Button value="sarathi">Sarathi</Radio.Button>
                                <Radio.Button value="event">Event</Radio.Button>
                            </Radio.Group>
                        </Flex>
                    </div>
                    {loading ? (
                        <Loading />
                    ) : (
                        <LazyLoad>
                            <Table
                                className="my-5"
                                columns={columns}
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
