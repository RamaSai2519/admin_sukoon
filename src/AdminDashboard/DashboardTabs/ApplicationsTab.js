import React from "react";
import { Table, ConfigProvider, theme } from "antd";
import { useApplications } from "../../services/useData";
import LazyLoad from "../../components/LazyLoad/lazyload";

const ApplicationsTab = () => {
    const { applications, fetchApplications } = useApplications();
    const darkMode = localStorage.getItem('darkMode') === 'true';

    React.useEffect(() => {
        fetchApplications();
        // eslint-disable-next-line
    }, []);

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Date of Birth",
            dataIndex: "dateOfBirth",
            key: "dateOfBirth",
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
        },
        {
            title: "Applied Date",
            dataIndex: "createdDate",
            key: "createdDate",
        },
    ];

    return (
        <LazyLoad>
            <ConfigProvider theme={
                {
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }
            }>
                <div className="min-h-screen">
                    <Table dataSource={applications} columns={columns} />
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default ApplicationsTab;
