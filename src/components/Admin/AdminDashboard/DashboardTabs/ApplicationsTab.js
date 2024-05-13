import React, { useState } from "react";
import { useData } from "../../../../services/useData";
import * as XLSX from 'xlsx';

const ApplicationsTab = () => {
    const { applications } = useData();
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "",
    });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    applications.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    const renderSortArrow = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "ascending" ? " ▲" : " ▼";
        }
        return null;
    };

    const downloadExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Name", "Email", "Phone Number", "Date of Birth", "Gender", "Applied Date"]
        ];
        applications.forEach((application) => {
            wsData.push([
                application.name,
                application.email,
                application.phoneNumber,
                application.dateOfBirth,
                application.gender,
                application.createdDate,
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Applications_Data");

        XLSX.writeFile(wb, "ApplicationsList.xlsx");
    };

    return (
        <div className="table-container">
            <div className="dashboard-tile">
                <div className="latest-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("name")}>
                                    Name {renderSortArrow("name")}
                                </th>
                                <th onClick={() => handleSort("email")}>
                                    Email {renderSortArrow("email")}
                                </th>
                                <th onClick={() => handleSort("phoneNumber")}>
                                    Phone Number {renderSortArrow("phoneNumber")}
                                </th>
                                <th onClick={() => handleSort("dateOfBirth")}>
                                    Date of Birth {renderSortArrow("dateOfBirth")}
                                </th>
                                <th onClick={() => handleSort("gender")}>
                                    Gender {renderSortArrow("gender")}
                                </th>
                                <th onClick={() => handleSort("createdDate")}>
                                    Applied Date {renderSortArrow("createdDate")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id}>
                                    <td>{application.name}</td>
                                    <td>{application.email}</td>
                                    <td>{application.phoneNumber}</td>
                                    <td>{application.dateOfBirth}</td>
                                    <td>{application.gender}</td>
                                    <td>{application.createdDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className='popup-button' onClick={downloadExcel}>Export Excel Sheet</button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsTab;