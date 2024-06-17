import React, { useState, useEffect } from 'react';
import {
    ConfigProvider, Form, Radio, theme,
    Input, Cascader, Select, Button, message, Upload
} from 'antd';
import LazyLoad from '../../components/LazyLoad/lazyload';
import Raxios from '../../services/axiosHelper';
import Loading from '../../components/Loading/loading';
import { PlusOutlined } from '@ant-design/icons';

const GamesTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [game, setGame] = useState(localStorage.getItem('game') || 'quiz');
    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    useEffect(() => {
        Raxios.get('/games/quizQuestions')
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onFormSubmit = (values) => {
        const formData = {
            ...values,
            imageUrl: uploadedImageUrl
        };

        Raxios.post('/games/addQuestion', formData)
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const beforeUpload = (file) => {
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

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            setUploadedImageUrl(info.file.response.file_url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const uniqueLevels = [...new Set(questions.map(question => question.level))];

    return (
        <LazyLoad>
            <ConfigProvider
                theme={{
                    algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                }}
            >
                <div className="w-full min-h-screen">
                    <Radio.Group
                        className='pt-1'
                        value={game}
                        onChange={(e) => {
                            localStorage.setItem("game", e.target.value);
                            setGame(e.target.value);
                        }}
                    >
                        <Radio.Button value="quiz">Quiz</Radio.Button>
                        <Radio.Button disabled value="cards">Match Cards</Radio.Button>
                        <Radio.Button disabled value="colour">Colour Trap</Radio.Button>
                    </Radio.Group>
                    <div className="flex w-full h-max justify-between pt-1">
                        <div className="w-1/2 p-2 px-5">
                            {game === "quiz" && (
                                <Form
                                    layout="vertical"
                                    onFinish={onFormSubmit}
                                >
                                    <Form.Item
                                        label="Select Level"
                                        name="level"
                                        rules={[{ required: true }]}
                                    >
                                        <Select placeholder="Select Level">
                                            {uniqueLevels.map((level) => (
                                                <Select.Option key={level} value={level}>
                                                    {level}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Question"
                                        name="question"
                                        rules={[{ required: true }]}
                                    >
                                        <Input placeholder="Enter question" />
                                    </Form.Item>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((option, index) => (
                                            <Form.Item
                                                key={index}
                                                label={`Option ${index + 1}`}
                                                name={`option${index + 1}`}
                                                rules={[{ required: true }]}
                                            >
                                                <Input
                                                    placeholder={`Enter Option ${index + 1}`}
                                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                                />
                                            </Form.Item>
                                        ))}
                                    </div>
                                    <Form.Item
                                        label="Correct Answer"
                                        name="correctAnswer"
                                        rules={[{ required: true }]}
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.options !== currentValues.options
                                        }
                                    >
                                        <Select
                                            placeholder="Select Correct Answer"
                                            disabled={options.length < 4}
                                        >
                                            {options.map((option, index) => (
                                                <Select.Option key={index} value={option}>
                                                    {option}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        label="Image"
                                        name="image"
                                        rules={[{ required: true, message: 'Please upload an image' }]}
                                    >
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            action="https://apiadmin.sukoon.love/admin/service/upload"
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            maxCount={1}
                                        >
                                            <PlusOutlined />
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            )}
                        </div>
                        <div className="border-l-2 border-lightBlack h-max w-1/2 p-2">
                            <h1 className="text-center text-2xl">Questions</h1>
                            {questions.length > 0 ?
                                <Cascader.Panel
                                    className='w-full h-full'
                                    onChange={(value) => console.log(value)}
                                    options={[
                                        {
                                            value: "quiz",
                                            label: "Quiz",
                                            children: uniqueLevels.map(level => ({
                                                value: level,
                                                label: level,
                                                children: questions.filter(question => question.level === level).map(question => ({
                                                    value: question.question,
                                                    label: question.question,
                                                    children: question.options.map(option => ({
                                                        value: option.key,
                                                        label: option.value,
                                                        children: [
                                                            {
                                                                value: option.key,
                                                                label: option.isCorrect ? "Correct" : "Incorrect"
                                                            }
                                                        ]
                                                    }))
                                                }))
                                            }))
                                        },
                                        {
                                            value: "cards",
                                            label: "Match Cards",
                                            children: [
                                                {
                                                    value: "xihu",
                                                    label: "West Lake",
                                                },
                                            ],
                                        },
                                        {
                                            value: "colour",
                                            label: "Colour Trap",
                                            children: [
                                                {
                                                    value: "xihu",
                                                    label: "West Lake",
                                                },
                                            ],
                                        }
                                    ]}
                                />
                                : <Loading />
                            }
                        </div>
                    </div>
                </div>
            </ConfigProvider>
        </LazyLoad>
    );
};

export default GamesTab;
