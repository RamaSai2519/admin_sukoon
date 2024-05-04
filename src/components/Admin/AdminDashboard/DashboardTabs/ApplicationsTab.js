import React, { useState, useEffect } from "react";
import axios from "axios";

const ApplicationsTab = () => {
    const [applications, setApplications] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: "",
        direction: "",
    });

    useEffect(() => {}, []);

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

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get("/api/applications");
                setApplications(response.data.reverse());
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, []);

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
                                <th>Video</th>
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
                                    <td>
                                        <a href={application.video} target="_blank" rel="noreferrer">
                                            View
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsTab;