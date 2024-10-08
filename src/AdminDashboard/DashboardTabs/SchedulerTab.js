import React, { useEffect, useState } from "react";
import { RaxiosPost } from "../../services/fetchData";
import LazyLoad from "../../components/LazyLoad/lazyload";
import InternalToggle from "../../components/InternalToggle";
import SchedulesTable from "../../components/SchedulesTable";
import { useUsers, useExperts } from "../../services/useData";
import { generateOptions } from "../../Utils/antSelectHelper";
import { Select, DatePicker, Form, Button, message } from "antd";

const SchedulerTab = () => {
    const { users, fetchUsers } = useUsers();
    const { experts, fetchExperts } = useExperts();
    const [schedules, setSchedules] = useState([]);
    const [rLoading, setRLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [internalView, setInternalView] = useState(
        localStorage.getItem('internalView') === 'true' ? true : false
    );
    const { Option } = Select;

    const fetchSchedules = async () => {
        setRLoading(true);
        const response = await RaxiosPost('/schedules', { action: 'get' });
        setSchedules(response.data.data);
        setRLoading(false);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchUsersAndExperts = async () => {
        setDisable(true);
        await fetchUsers();
        await fetchExperts(internalView);
        setDisable(false);
    };

    useEffect(() => {
        fetchUsersAndExperts();
        // eslint-disable-next-line
    }, [internalView]);

    const handleCallTrigger = async (values) => {
        setLoading(true);
        await RaxiosPost('/call', {
            user_id: values.user,
            expert_id: values.expert,
            user_requested: values.user_requested === "Yes"
        }, true);
        setLoading(false);
    };

    const onScheduleFinish = async (values) => {
        setLoading(true);
        const selectedDateTime = values.datetime;
        if (selectedDateTime <= new Date()) {
            message.error("Selected time has already passed. Please select a future time.");
        } else {
            const formattedDate = new Date(values.datetime).toISOString().split('.')[0] + "Z";
            const initiatedBy = localStorage.getItem('adminName');
            const meta = JSON.stringify({ expertId: values.expert, userId: values.user, initiatedBy });
            await RaxiosPost('/create_scheduled_job',
                { job_type: 'CALL', job_time: formattedDate, status: 'PENDING', request_meta: meta, user_requested: values.user_requested === "Yes" },
                true
            );
            fetchSchedules();
        }
        setLoading(false);
    };

    const CallScheduleForm = ({ onFinish, loading, fields }) => {
        return (
            <Form
                name="call-schedule-form"
                className="grid grid-cols-2 gap-2 mt-3"
                onFinish={onFinish}
            >
                {fields.filter(field => !field.actionText).map((field, index) => (
                    <Form.Item
                        key={index}
                        name={field.name}
                        rules={field.rules}
                    >
                        {field.type === "select" ? (
                            <Select
                                className="w-full" showSearch
                                placeholder={field.placeholder} optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {field.generateOption ? generateOptions(field.options, field.optionKey) :
                                    field.options?.map((option, index) => (
                                        <Option key={index} value={option}>{option}</Option>
                                    ))
                                }
                            </Select>
                        ) : field.type === "datetime" ? (
                            <DatePicker
                                className="w-full"
                                format="YYYY-MM-DD HH:mm"
                                showTime
                            />
                        ) : null}
                    </Form.Item>
                ))}
                <Button loading={loading} htmlType="submit" className="w-full col-span-2">
                    {fields.find(field => field.actionText)?.actionText}
                </Button>
            </Form>
        );
    };

    const requiredRule = (message) => [{ required: true, message }];
    const actionField = (actionText) => ({ actionText });

    const userFormField = {
        name: "user", type: "select", placeholder: "Select User",
        showSearch: true, options: users, optionKey: "name", generateOption: true,
        rules: requiredRule("Please select a user")
    };
    const expertFormField = {
        name: "expert", type: "select", placeholder: "Select Expert",
        showSearch: true, options: experts, optionKey: "name", generateOption: true,
        rules: requiredRule("Please select an expert")
    };

    const userRequestedFormField = { name: "user_requested", type: "select", placeholder: "Select User Requested", options: ["Yes", "No"], rules: requiredRule("Please select if user requested or not") };

    const callFormFields = [userFormField, expertFormField, userRequestedFormField, actionField("Connect Now")];
    const scheduleFormFields = [
        userFormField,
        expertFormField,
        { name: "datetime", type: "datetime", rules: requiredRule("Please select a date and time"), },
        { name: "duration", type: "select", placeholder: "Select Duration", options: ["30", "60"], rules: requiredRule("Please select a duration") },
        userRequestedFormField, actionField("Schedule Call")
    ];

    return (
        <LazyLoad>
            <div className="flex items-center justify-center gap-4 h-full">
                <SchedulesTable schedules={schedules} loading={rLoading} />
                <div className="flex flex-col h-full border-l-2 dark:border-lightBlack pl-2 justify-center">
                    <div className="flex w-full justify-between">
                        <h1 className="text-2xl font-bold mb-3">Connect a Call</h1>
                        <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={disable} />
                    </div>
                    <CallScheduleForm onFinish={handleCallTrigger} loading={loading} fields={callFormFields} />

                    <h1 className="text-2xl font-bold mt-4">Schedule a Call</h1>
                    <CallScheduleForm onFinish={onScheduleFinish} loading={loading} fields={scheduleFormFields} />
                </div>
            </div>
        </LazyLoad>
    );
};

export default SchedulerTab;