import React from 'react';
import { message, Select, Upload } from 'antd';

const { Option } = Select;

export const generateOptions = (data, key) => data.map(item => (
    <Option key={item._id} value={item._id}>
        {item[key] || item["phoneNumber"] || "Unknown"}
    </Option>
));

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