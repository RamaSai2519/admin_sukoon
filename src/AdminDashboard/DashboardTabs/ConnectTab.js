/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PostCallForm from "../../components/PostCallForm";
import LazyLoad from "../../components/LazyLoad/lazyload";
import InternalToggle from "../../components/InternalToggle";
import SchedulesTable from "../../components/SchedulesTable";
import { generateOptions } from "../../Utils/antSelectHelper";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";
import { useUsers, useExperts, useAdmin } from "../../contexts/useData";
import { Select, DatePicker, Form, Button, message, Switch, TimePicker } from "antd";

const ConnectTab = () => {
    const { admin } = useAdmin();
    const { users, fetchUsers } = useUsers();
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const { experts, fetchExperts } = useExperts();
    const [schedules, setSchedules] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [rLoading, setRLoading] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [showReForm, setShowReForm] = useState(false);
    const [internalView, setInternalView] = useState(
        localStorage.getItem('internalView') === 'true' ? true : false
    );
    const { Option } = Select;

    const fetchSchedules = async () => {
        raxiosFetchData(null, null, setSchedules, null, '/actions/schedules', { isDeleted }, setRLoading);
    };

    const fetchUsersAndExperts = async () => {
        setDisable(true);
        await fetchUsers();
        await fetchExperts(internalView);
        setDisable(false);
    };

    useEffect(() => { fetchSchedules(); }, [isDeleted]);
    useEffect(() => { fetchUsersAndExperts(); }, [internalView]);

    const handleCallTrigger = async (values) => {
        setLoading(true);
        const response = await RaxiosPost('/actions/call', {
            user_id: values.user,
            expert_id: values.expert,
            user_requested: values.user_requested === "Yes"
        }, true);
        if (response.status === 200) {
            const formData = { user_id: values.user, call_id: response.data.call_id };
            localStorage.setItem('formData', JSON.stringify(formData));
            setShowForm(true);
        }
        setLoading(false);
    };

    const checkExpertAvailability = (expertId, selectedDateTime, schedules) => {
        const selectedTime = new Date(selectedDateTime).getTime();
        const timeWindow = 15 * 60 * 1000;
        const isConflict = schedules.some(schedule => {
            const scheduleMeta = JSON.parse(schedule.requestMeta);
            if ((scheduleMeta?.expertId || '') === expertId && !schedule.isDeleted) {
                const scheduleTime = new Date(schedule.scheduledJobTime).getTime();
                return Math.abs(scheduleTime - selectedTime) <= timeWindow;
            }
            return false;
        });
        return isConflict;
    };

    const onScheduleFinish = async (values) => {
        setLoading(true);
        const selectedDateTime = values.datetime;
        const expertId = values.expert;

        if (selectedDateTime <= new Date()) {
            message.error("Selected time has already passed. Please select a future time.");
        } else if (checkExpertAvailability(expertId, selectedDateTime, schedules)) {
            message.error("The expert already has a schedule within 15 minutes of the selected t ime.");
        } else {
            const formattedDate = new Date(selectedDateTime).toISOString().split('.')[0] + "Z";
            const initiatedBy = admin.name;
            const meta = JSON.stringify({ expertId, userId: values.user, initiatedBy });
            let status = 'WAPENDING';
            const tooLateSchedule = new Date(selectedDateTime).getTime() - new Date().getTime() < 30 * 60 * 1000;
            if (tooLateSchedule) status = 'PENDING';

            const response = await RaxiosPost('/actions/create_scheduled_job',
                {
                    job_type: 'CALL',
                    status: status,
                    request_meta: meta,
                    job_time: formattedDate,
                    user_requested: values.user_requested === "Yes"
                },
                true
            );
            if (response.status === 200) {
                if (tooLateSchedule) message.warning('No notification will be sent as the call is scheduled within 30 minutes.', 20);
                fetchSchedules();
            }
        }
        setLoading(false);
    };

    const onReScheduleFinish = async (values) => {
        const JobTime = values.time.format('HH:mm');
        const days = values.days.map(day => day.toLowerCase());
        const frequency = values.frequency.toLowerCase();
        console.log("🚀 ~ onReScheduleFinish ~ values:", values, "days:", days);
    }

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
                            <TimePicker className="w-full" placeholder={field.placeholder} />
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
    const daysField = {
        name: "days", type: "days", placeholder: "Select Days",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], rules: requiredRule("Please select days")
    };
    const timeField = { name: "time", type: "time", placeholder: "Select Time", rules: requiredRule("Please select a time") };
    const expiryField = { name: "expiring", type: "datetime", placeholder: "Select Expiry Date" };
    const frequencyField = { name: "frequency", type: "select", placeholder: "Select Frequency", options: ["Weekly", "Monthly", "BiWeekly"], rules: requiredRule("Please select a frequency") };

    const userRequestedFormField = { name: "user_requested", type: "select", placeholder: "Is this User Requested?", options: ["Yes", "No"], rules: requiredRule("Please select if user requested or not") };

    const callFormFields = [userFormField, expertFormField, userRequestedFormField, actionField("Connect Now")];
    const scheduleFormFields = [
        userFormField,
        expertFormField,
        { name: "datetime", type: "datetime", rules: requiredRule("Please select a date and time"), },
        userRequestedFormField, actionField("Schedule Call")
    ];
    const reFormFields = [userFormField, expertFormField, timeField, daysField, expiryField, frequencyField, userRequestedFormField, actionField("Schedule Call")];

    return (
        <LazyLoad>
            <div className="flex items-center justify-center gap-4 h-full">
                {showForm
                    ? <PostCallForm setShowForm={setShowForm} />
                    : <SchedulesTable schedules={schedules} loading={rLoading} setIsDeleted={setIsDeleted} isDeleted={isDeleted} />
                }
                <div className="flex flex-col h-full border-l-2 dark:border-lightBlack pl-10 justify-center">
                    {!showReForm && <div className="flex items-center justify-end gap-2">
                        <Switch className="w-fit mb-3" unCheckedChildren="Schedule a Repeat Call" checked={showReForm} onChange={() => setShowReForm(true)} />
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
                                <Button danger onClick={() => setShowReForm(false)}>Cancel</Button>
                            </div>
                        </>
                    }
                </div>
            </div>
        </LazyLoad>
    );
};

export default ConnectTab;