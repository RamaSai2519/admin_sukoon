import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export const generateOptions = (data, key) => data.map(item => (
    <Option key={item._id} value={item._id}>
        {item[key] || item["phoneNumber"]}
    </Option>
));