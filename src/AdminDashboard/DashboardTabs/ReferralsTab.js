import React, { useState, useEffect } from "react";
import Raxios from "../../services/axiosHelper";
import ReferralChart from "../../components/ReferralsGraph";
import { Button, Select, Table } from "antd";
import { Link } from "react-router-dom";


const ReferralsTab = () => {
    const [communityReferrals, setCommunityReferrals] = useState({});
    const [userReferrals, setUserReferrals] = useState([]);
    const [referralData, setReferralData] = useState([]);
    const { Option } = Select;

    const columns = [
        { title: "Name", dataIndex: "name", key: "name", },
        { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber", },
        {
            title: "Action", key: "action",
            render: (record) => (
                <Link to={`/admin/users/${record.key}`}>
                    <Button onClick={() => localStorage.setItem('userNumber', record.phoneNumber)}>
                        View
                    </Button>
                </Link>
            )
        },
    ]

    const lcolumns = [
        { title: "Name", dataIndex: "user_name", key: "user_name" },
        { title: "Counts", dataIndex: "count", key: "count" },
        {
            title: "Action", key: "action",
            render: (record) => (
                <Link to={`/admin/users/${record.key}`}>
                    <Button onClick={() => localStorage.setItem('userNumber', record.phoneNumber)}>
                        View
                    </Button>
                </Link>
            )
        },
    ]

    const getReferralData = async (refCode) => {
        try {
            const response = await Raxios.post("/actions/user_referrals", { refCode });
            setReferralData(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReferralsList = async () => {
        try {
            const res = await Raxios.get("/actions/user_referrals");
            const communityReferralData = res.data.communityReferrals.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {});
            setUserReferrals(res.data.userReferrals);
            setCommunityReferrals(communityReferralData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchReferralsList();
    }, []);



    return (
        <div className='min-h-screen p-5 w-full overflow-auto flex md:flex-row flex-col h-max '>
            <div className='flex flex-col md:w-1/2 mr-2'>
                <Select
                    className='w-full'
                    placeholder='Select a RefCode'
                    showSearch
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => getReferralData(value)}
                >
                    {Object.keys(communityReferrals).map((key) => (
                        <Option key={key} value={key}>
                            {key}
                        </Option>
                    ))}
                </Select>
                <Table dataSource={referralData} columns={columns} />
            </div>

            <div className='flex md:mt-0 mt-5 md:w-1/2 pl-2 md:border-l-2 dark:md:border-lightBlack'>
                <div className="flex flex-col w-full">
                    <h1>Community Referrals</h1>
                    {Object.keys(communityReferrals).length > 0 && (
                        <ReferralChart data={communityReferrals} />
                    )}
                    <h1 className="mt-10">User Referrals</h1>
                    <Table dataSource={userReferrals} columns={lcolumns} />
                </div>
            </div>
        </div>
    );
};

export default ReferralsTab;