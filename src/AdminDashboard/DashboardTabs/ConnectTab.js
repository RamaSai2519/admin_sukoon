/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { RaxiosPost } from "../../services/fetchData";
import PostCallForm from "../../components/PostCallForm";
import LazyLoad from "../../components/LazyLoad/lazyload";
import InternalToggle from "../../components/InternalToggle";
import SchedulesTable from "../../components/SchedulesTable";
import { generateOptions } from "../../Utils/antSelectHelper";
import ReSchedulesTable from "../../components/ReSchedulesTable";
import { useUsers, useExperts, useAdmin } from "../../contexts/useData";
import { Select, DatePicker, Form, Button, message, Switch, TimePicker } from "antd";

const ConnectTab = () => {
    const { admin } = useAdmin();

    const { users, fetchUsers } = useUsers();
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const { experts, fetchExperts } = useExperts();
    const [showForm, setShowForm] = useState(false);
    const [showReForm, setShowReForm] = useState(
        localStorage.getItem('showReForm') === 'true' ? true : false
    );
    const [internalView, setInternalView] = useState(
        localStorage.getItem('internalView') === 'true' ? true : false
    );
    const { Option } = Select;

    const fetchUsersAndExperts = async () => {
        setDisable(true);
        await fetchUsers();
        await fetchExperts(internalView);
        setDisable(false);
    };

    useEffect(() => { fetchUsersAndExperts(); }, [internalView]);

    const handleCallTrigger = async (values) => {
        const response = await RaxiosPost('/actions/call', {
            user_id: values.user,
            expert_id: values.expert,
            user_requested: values.user_requested === "Yes"
        }, true, setLoading);
        if (response.status === 200) {
            const formData = { user_id: values.user, call_id: response.data.call_id };
            localStorage.setItem('formData', JSON.stringify(formData));
            setShowForm(true);
        }
    };

    const onScheduleFinish = async (values) => {
        setLoading(true);
        const selectedDateTime = values.datetime;
        const expertId = values.expert;

        if (selectedDateTime <= new Date()) {
            message.error("Selected time has already passed. Please select a future time.");
        } else {
            const formattedDate = new Date(selectedDateTime).toISOString().split('.')[0] + "Z";
            const initiatedBy = admin.name;
            let status = 'WAPENDING';
            const tooLateSchedule = new Date(selectedDateTime).getTime() - new Date().getTime() < 15 * 60 * 1000;
            if (tooLateSchedule) status = 'PENDING';

            const response = await RaxiosPost('/actions/schedules',
                {
                    initiatedBy,
                    job_type: 'CALL',
                    status: status,
                    user_id: values.user,
                    expert_id: expertId,
                    job_time: formattedDate,
                    user_requested: values.user_requested === "Yes"
                },
                true
            );
            if (response.status === 200) {
                if (tooLateSchedule) await message.warning('No notification will be sent as the call is scheduled within 15 minutes.', 10);
                window.location.reload();
            }
        }
        setLoading(false);
    };

    const onReScheduleFinish = async (values) => {
        const payload = {
            ...values,
            expert_id: values.expert, user_id: values.user,
            name: admin.name, job_time: values.job_time.format('HH:mm'),
            week_days: values?.week_days?.map(day => day.toLowerCase()), frequency: values.frequency.toLowerCase(),
            user_requested: values.user_requested === "Yes", job_type: 'CALL'
        }
        const response = await RaxiosPost('/actions/reschedules', payload, true, setLoading);
        if (response.status === 200) window.location.reload();
    };

    const CallScheduleForm = ({ onFinish, loading, fields }) => {
        return (
            <Form
                name="call-schedule-form"
                className="flex flex-col gap-2 mt-3"
                onFinish={onFinish}
            >
                {fields.filter(field => !field.actionText).map((field, index) => (
                    <Form.Item
                        key={index}
                        name={field.name}
                        {...field.rules && { rules: field.rules }}
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
                                placeholder={field.placeholder}
                            />
                        ) : field.type === "days" ? (
                            <Select
                                className="w-full" mode="multiple"
                                placeholder={field.placeholder}
                            >
                                {field.options?.map((option, index) => (
                                    <Option key={index} value={option}>{option}</Option>
                                ))}
                            </Select>
                        ) : field.type === "time" ? (
                            <TimePicker showSecond={false} className="w-full" placeholder={field.placeholder} />
                        ) : null}
                    </Form.Item>
                ))}
                <Button loading={loading} type="primary" htmlType="submit" className="w-full col-span-2">
                    {fields.find(field => field.actionText)?.actionText}
                </Button>
            </Form>
        );
    };

    const requiredRule = (message) => [{ required: true, message }];
    const actionField = (actionText) => ({ actionText });

    const userFormField = { name: "user", type: "select", placeholder: "Select User", showSearch: true, options: users, optionKey: "name", generateOption: true, rules: requiredRule("Please select a user") };
    const expertFormField = { name: "expert", type: "select", placeholder: "Select Expert", showSearch: true, options: experts, optionKey: "name", generateOption: true, rules: requiredRule("Please select an expert") };
    const userRequestedFormField = { name: "user_requested", type: "select", placeholder: "Is this User Requested?", options: ["Yes", "No"], rules: requiredRule("Please select if user requested or not") };
    const daysField = { name: "week_days", type: "days", placeholder: "Select Week Days", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] };
    const timeField = { name: "job_time", type: "time", placeholder: "Select Time", rules: requiredRule("Please select a time") };
    const expiryField = { name: "job_expiry", type: "datetime", placeholder: "Select Expiry Date", rules: requiredRule("Please select an expiry date") };
    const monthDaysField = { name: "month_days", type: "days", placeholder: "Select Month Days", options: Array.from({ length: 31 }, (_, i) => i + 1) };
    const frequencyField = { name: "frequency", type: "select", placeholder: "Select Frequency", options: ["Daily", "Weekly", "Monthly",], rules: requiredRule("Please select a frequency") };

    const callFormFields = [userFormField, expertFormField, userRequestedFormField, actionField("Connect Now")];
    const scheduleFormFields = [userFormField, expertFormField, { name: "datetime", type: "datetime", rules: requiredRule("Please select a date and time"), }, userRequestedFormField, actionField("Schedule Call")];
    const reFormFields = [userFormField, expertFormField, timeField, frequencyField, daysField, monthDaysField, expiryField, userRequestedFormField, actionField("Schedule Repeat Call")];

    const handleReFormChange = () => {
        setShowReForm(!showReForm);
        localStorage.setItem('showReForm', !showReForm);
    }

    return (
        <LazyLoad>
            <div className="flex items-center justify-center gap-4 h-full">
                {showForm
                    ? <PostCallForm setShowForm={setShowForm} />
                    : showReForm
                        ? <ReSchedulesTable reformChange={handleReFormChange} />
                        : <SchedulesTable />
                }
                <div className="flex flex-col h-full border-l-2 dark:border-lightBlack pl-10 justify-center">
                    {!showReForm && <div className="flex items-center justify-end gap-2">
                        <Switch className="w-fit mb-3" unCheckedChildren="Schedule a Repeat Call" checked={showReForm} onChange={handleReFormChange} />
                    </div>}
                    {!showReForm ?
                        <>
                            <div className="flex w-full justify-between items-center gap-5">
                                <h1 className="text-xl font-bold">Connect Call</h1>
                                <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={disable} />
                            </div>
                            <CallScheduleForm onFinish={handleCallTrigger} loading={loading} fields={callFormFields} />

                            <h1 className="text-xl font-bold mt-4">Schedule Call</h1>
                            <CallScheduleForm onFinish={onScheduleFinish} loading={loading} fields={scheduleFormFields} />
                        </> :
                        <>
                            <h1 className="text-xl font-bold">Schedule Repeat Call</h1>
                            <CallScheduleForm onFinish={onReScheduleFinish} loading={loading} fields={reFormFields} />
                            <div className="flex w-full justify-between items-center mt-4">
                                <InternalToggle internalView={internalView} setInternalView={setInternalView} disable={disable} />
                                <Button danger onClick={handleReFormChange}>Cancel</Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </LazyLoad>
    );
};

export default ConnectTab;