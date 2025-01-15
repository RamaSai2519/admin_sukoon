import React, { useEffect } from "react";
import { RaxiosPost } from "../../services/fetchData";
import { Button, Form, Input, InputNumber, message } from "antd";


const UpsertPlanForm = ({ plan, setPlan }) => {
    const [form] = Form.useForm();

    useEffect(() => {
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
            message.success(response.msg);
            setPlan({});
        } else {
            message.error(response.msg);
        }
    };

    const createFormItem = (label, name, component, rules) => ({ label, name, component, rules });

    const formItems = [
        createFormItem("Name", "name", <Form.Item name="name"><Input /></Form.Item>, [{ required: true, message: 'Please enter the name' }]),
        createFormItem("Price", "price", <Form.Item name="price"><InputNumber accept="" /></Form.Item>, [{ required: true, message: 'Please enter the price' }])
    ]
    const formItems1 = [
        createFormItem("Free Events", "free_events", <Form.Item name="free_events"><InputNumber /></Form.Item>, [{ required: true, message: 'Please enter the free events' }]),
        createFormItem("Paid Events", "paid_events", <Form.Item name="paid_events"><InputNumber /></Form.Item>, [{ required: true, message: 'Please enter the paid events' }]),
        createFormItem("Expert Calls", "expert_calls", <Form.Item name="expert_calls"><InputNumber /></Form.Item>, [{ required: true, message: 'Please enter the expert calls' }]),
        createFormItem("Sarathi Calls", "sarathi_calls", <Form.Item name="sarathi_calls"><InputNumber /></Form.Item>, [{ required: true, message: 'Please enter the sarathi calls' }])
    ]

    const RenderFormItem = ({ item }) => {
        return (
            <Form.Item
                label={item.label} name={item.name}
                rules={item.rules} key={item.name}
            >
                {item.component}
            </Form.Item>
        )
    }

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleUpsert}
            className="w-full"
        >
            <div className="flex justify-center gap-5">{formItems.map(item => <RenderFormItem item={item} />)}</div>
            <div className="flex justify-center gap-5">{formItems1.map(item => <RenderFormItem item={item} />)}</div>
            <Form.Item>
                <div className="w-full justify-between flex">
                    <Button onClick={() => setPlan({})} className="btn btn-secondary">Cancel</Button>
                    <Button type="primary" htmlType="submit" className="btn btn-primary">Submit</Button>
                </div>
            </Form.Item>
        </Form>
    )
}

export default UpsertPlanForm;