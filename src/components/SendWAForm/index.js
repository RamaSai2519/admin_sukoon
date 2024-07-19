import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Select, Input } from 'antd';
import { generateOptions } from '../../Utils/antSelectHelper';
import { fetchData } from '../../services/fetchData';
import Loading from '../Loading/loading';

const SendWAForm = () => {
    const [templates, setTemplates] = useState([]);
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputs, setInputs] = useState({});
    const [selectedType, setSelectedType] = useState("");
    const [selectedCity, setSelectedCity] = useState("mumbai");
    const [messagePreview, setMessagePreview] = useState('');

    useEffect(() => {
        fetchData(setTemplates, setLoading, '/wa/templates');
    }, []);

    useEffect(() => {
        if (template) {
            setMessagePreview(template.message);
            const initialInputs = {};
            const placeholders = template.message.match(/<\w+>/g) || [];
            placeholders.forEach((placeholder) => {
                initialInputs[placeholder] = '';
            });
            setInputs(initialInputs);
        }
    }, [template]);

    const handleInputChange = (placeholder, value) => {
        const updatedInputs = { ...inputs, [placeholder]: value };
        setInputs(updatedInputs);

        let updatedMessage = template.message;
        Object.keys(updatedInputs).forEach((key) => {
            updatedMessage = updatedMessage.replace(key, updatedInputs[key] || key);
        });
        setMessagePreview(updatedMessage);
    };

    if (loading) return <Loading />;

    return (
        <div className='flex w-full gap-2'>
            <div className='flex flex-col w-full gap-2'>
                <Select
                    allowClear
                    showSearch
                    className='w-full'
                    placeholder="Select Template"
                    optionFilterProp='children'
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                        const selectedTemplate = templates.find(template => template._id === value);
                        setTemplate(selectedTemplate);
                        console.log('selectedTemplate:', selectedTemplate);
                    }}
                    onClear={() => {
                        setTemplate(null);
                        setMessagePreview('');
                        setInputs({});
                    }}
                >
                    {generateOptions(templates, 'name')}
                </Select>

                <Select
                    allowClear
                    placeholder="Select Type"
                    onChange={(value) => console.log('value:', value)}
                >
                    <Select.Option value="partial">Partial Signups</Select.Option>
                    <Select.Option value="full">Complete Signups</Select.Option>
                    <Select.Option value="all">All Users</Select.Option>
                </Select>

                <Select
                    allowClear
                    placeholder="Select City"
                    onChange={(value) => setSelectedCity(value)}
                    value={selectedCity}
                >
                    <Select.Option value="delhi">Delhi</Select.Option>
                    <Select.Option value="mumbai">Mumbai</Select.Option>
                    <Select.Option value="bangalore">Bangalore</Select.Option>
                </Select>

                {template && Object.keys(inputs).map((placeholder, index) => (
                    <div className='flex gap-2 my-1' key={index}>
                        <Card size='small'><p>{placeholder}</p></Card>
                        <Input
                            placeholder="Enter value"
                            value={inputs[placeholder]}
                            onChange={(e) => handleInputChange(placeholder, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <Card
                title="Preview"
                className='w-full h-fit'
            >
                <span className='whitespace-pre-wrap'>{messagePreview}</span>
            </Card>
        </div>
    );
};

export default SendWAForm;
