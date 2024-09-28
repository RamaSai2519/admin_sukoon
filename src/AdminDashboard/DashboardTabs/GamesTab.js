import React, { useState, useEffect } from 'react';
import { Form, Radio, Input, Cascader, Select, Button, message, Upload, Tooltip } from 'antd';
import LazyLoad from '../../components/LazyLoad/lazyload';
import { BASE_URL } from '../../services/axiosHelper';
import Loading from '../../components/Loading/loading';
import { PlusOutlined } from '@ant-design/icons';
import { beforeUpload } from '../../Utils/antSelectHelper';
import Gamelinks from '../../components/Gamelinks';
import Faxios from '../../services/raxiosHelper';

const GamesTab = () => {
    const [game, setGame] = useState(localStorage.getItem('game') || 'games');
    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        Faxios.get('/games/quizQuestions')
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

        Faxios.post('/games/addQuestion', formData)
            .then((res) => {
                window.location.reload();
            })
            .catch((err) => {
                alert(err.response.data.message);
                console.log(err);
            });
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            setUploadedImageUrl(info.file.response.file_url);
            message.success(`${info.file.name} file uploaded successfully`);
            setReady(true);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    };

    const uniqueLevels = [...new Set(questions.map(question => question.level))];

    return (
        <LazyLoad>
            <div className="w-full min-h-screen">
                <Radio.Group
                    className='pt-1'
                    value={game}
                    onChange={(e) => {
                        localStorage.setItem("game", e.target.value);
                        setGame(e.target.value);
                    }}
                >
                    <Radio.Button value="games">Games</Radio.Button>
                    <Radio.Button value="quiz">Quiz</Radio.Button>
                    <Radio.Button disabled value="cards">Match Cards</Radio.Button>
                    <Radio.Button disabled value="colour">Colour Trap</Radio.Button>
                </Radio.Group>
                {game === "quiz" && (<div className="flex w-full h-max justify-between pt-1">
                    <div className="w-1/2 p-2 px-5">
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
                                    action={`${BASE_URL}/service/upload`}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                    maxCount={1}
                                >
                                    <PlusOutlined />
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" disabled={!ready}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="border-l-2 border-lightBlack h-max w-1/2 p-2">
                        <h1 className="text-center text-2xl">Questions</h1>
                        {questions.length > 0 ?
                            <Cascader.Panel
                                className='w-full h-full'
                                options={[
                                    {
                                        value: "quiz",
                                        label: "Quiz",
                                        children: uniqueLevels.map(level => ({
                                            value: level,
                                            label: (
                                                <Tooltip title={level}>
                                                    <span>
                                                        {level.length > 40 ? `${level.substring(0, 37)}...` : level}
                                                    </span>
                                                </Tooltip>
                                            ),
                                            children: questions.filter(question => question.level === level).map(question => ({
                                                value: question.question,
                                                label: (
                                                    <Tooltip title={question.question}>
                                                        <span className="inline-block max-w-full whitespace-nowrap overflow-hidden text-ellipsis">
                                                            {question.question.length > 40 ? `${question.question.substring(0, 37)}...` : question.question}
                                                        </span>
                                                    </Tooltip>
                                                ),
                                                children: question.options.map(option => ({
                                                    value: option.key,
                                                    label: (
                                                        <Tooltip title={option.value}>
                                                            <span>
                                                                {option.value.length > 40 ? `${option.value.substring(0, 37)}...` : option.value}
                                                            </span>
                                                        </Tooltip>
                                                    ),
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
                </div>)}
                {game === "games" &&
                    <Gamelinks />
                }
            </div>
        </LazyLoad>
    );
};

export default GamesTab;
