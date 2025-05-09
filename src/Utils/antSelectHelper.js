import React from 'react';
import { message, Select, Upload } from 'antd';

const { Option } = Select;

export const generateOptions = (data, key) => data.map(item => {
    const userName = item[key] ? `${item[key]} (${item["phoneNumber"]})` : item["phoneNumber"];
    return (
        <Option key={item._id} value={item._id}>
            {userName}
        </Option>
    )
});

export const generateNewOptions = (data, key) => data.map(item => {
    return (
        <Option key={item._id} value={item._id}>
            {item[key]}
        </Option>
    )
});

export const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
        return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
    }
    return true;
};