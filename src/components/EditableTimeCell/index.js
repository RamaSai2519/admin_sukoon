import React, { useState } from 'react';
import { Select, Form } from 'antd';

const { Option } = Select;

const timeOptions = Array.from({ length: 24 }, (_, i) => `${i < 10 ? '0' : ''}${i}:00`);

const EditableTimeCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ key: record.day, field: dataIndex, value: values[dataIndex] });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form form={form} style={{ margin: 0 }}>
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[{ required: true, message: `${title} is required.` }]}
                >
                    <Select onBlur={save} onChange={save}>
                        {timeOptions.map(time => (
                            <Option key={time} value={time}>
                                {time}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export default EditableTimeCell;
