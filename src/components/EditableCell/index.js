import React, { useState } from 'react';
import { Input, Form } from 'antd';
import './index.css';

const EditableCell = ({
    title,
    record,
    editable,
    children,
    dataIndex,
    handleSave,
    keyField = '_id',
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
            handleSave({ key: record[keyField], field: dataIndex, value: values[dataIndex] });
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
                >
                    <Input onBlur={save} onPressEnter={save} />
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

export default EditableCell;
