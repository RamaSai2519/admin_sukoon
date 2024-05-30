import React from "react";
import { Table, ConfigProvider, theme } from "antd";
import { useApplications } from "../../../../services/useData";

const ApplicationsTab = () => {
    const { applications } = useApplications();
    const darkMode = localStorage.getItem('darkMode') === 'true';

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
        <ConfigProvider theme={
            {
                algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }
        }>
            <div className="container">
                <Table dataSource={applications} columns={columns} />
            </div>
        </ConfigProvider>
    );
};

export default ApplicationsTab;
