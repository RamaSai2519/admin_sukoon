import React, { useEffect, useState } from "react";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";
import { Button, Form, Input, InputNumber, message, Select } from "antd";
import Loading from "../Loading/loading";


const UpsertPlanForm = ({ plan, setPlan }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [planTypes, setPlanTypes] = useState([]);

    const fetchPlans = async () => {
        await raxiosFetchData(null, null, setPlanTypes, null, '/actions/user_status_options', { type: 'pay_types' }, setLoading);
    };

    useEffect(() => {
        fetchPlans();
        form.setFieldsValue({
            name: plan?.name,
            price: plan?.price,
            free_events: plan?.free_events,
            paid_events: plan?.paid_events,
            expert_calls: plan?.expert_calls,
            sarathi_calls: plan?.sarathi_calls
        });
    }, [plan, form]);

    const handleUpsert = async (values) => {
        const response = await RaxiosPost('/actions/sub_plans', values);
        if (response.status === 200) {
            await message.success(response.msg);
            window.location.reload();
        } else {
            message.error(response.msg);
        }
    };

    const createFormItem = (label, name, component, rules) => ({ label, name, component, rules });

    const formItems = [
        createFormItem("Name", "name", <Input />, [{ required: true, message: 'Please enter the name' }]),
        createFormItem("Price", "price", <InputNumber accept="" />, [{ required: true, message: 'Please enter the price' }]),
        createFormItem("Meta", "meta", <Input.TextArea />, [{ required: true, message: 'Please enter the meta' }])
    ]
    const formItems1 = [
        createFormItem("Free Events", "free_events", <InputNumber />, [{ required: true, message: 'Please enter the free events' }]),
        createFormItem("Paid Events", "paid_events", <InputNumber />, [{ required: true, message: 'Please enter the paid events' }]),
        createFormItem("Expert Calls", "expert_calls", <InputNumber />, [{ required: true, message: 'Please enter the expert calls' }]),
        createFormItem("Sarathi Calls", "sarathi_calls", <InputNumber />, [{ required: true, message: 'Please enter the sarathi calls' }])
    ]

    const typeFormItem = createFormItem(
        "Plan Type", "type",
        <Select className="min-w-14" options={planTypes.map(type => ({ value: type?.type || '', label: type?.desc || '' }))} />,
        [{ required: true, message: 'Please select the plan type' }]
    );

    const RenderFormItem = ({ item }) => {
        return (
            <Form.Item
                className="w-full"
                label={item.label} name={item.name}
                rules={item.rules} key={item.name}
            >
                {item.component}
            </Form.Item>
        )
    }

    if (loading) return <Loading />;

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleUpsert}
            className="w-full"
        >
            <div className="flex justify-center gap-5">{formItems.map(item => <RenderFormItem item={item} />)}</div>
            <div className="flex justify-center gap-5">{formItems1.map(item => <RenderFormItem item={item} />)}</div>
            <Form.Item
                className="w-full"
                label={typeFormItem.label}
                name={typeFormItem.name}
                rules={typeFormItem.rules}
                key={typeFormItem.name}
            >
                {typeFormItem.component}
            </Form.Item>
            <Form.Item>
                <div className="w-full justify-between flex">
                    <Button onClick={() => setPlan({})} className="btn btn-secondary">Cancel</Button>
                    <Button type="primary" htmlType="submit" className="btn btn-primary">Submit</Button>
                </div>
            </Form.Item>
        </Form >
    )
}

export default UpsertPlanForm;