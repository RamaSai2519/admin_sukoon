import React, { useState, useEffect } from 'react';
import { Form, Radio, Input, Cascader, Select, Button, Tooltip } from 'antd';
import { raxiosFetchData, RaxiosPost } from '../../services/fetchData';
import LazyLoad from '../../components/LazyLoad/lazyload';
import Loading from '../../components/Loading/loading';
import S3Uploader from '../../components/Upload';

const GamesTab = () => {
    const [game, setGame] = useState(localStorage.getItem('game') || 'games');
    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    const fetchData = async () => {
        await raxiosFetchData(null, null, setQuestions, null, '/actions/quiz_questions');
    };

    useEffect(() => { fetchData() }, []);

    const onFormSubmit = async (values) => {
        const formData = { ...values, imageUrl: uploadedImageUrl };
        const response = await RaxiosPost('/actions/quiz_questions', formData);
        if (response.status === 200) { window.location.reload(); }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
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
                            <div className="grid grid-cols-2 gap-2">
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
                                    label="Category"
                                    name="category"
                                    rules={[{ required: true }]}
                                >
                                    <Input placeholder="Enter category" />
                                </Form.Item>
                            </div>
                            <Form.Item
                                label="Image" name="image"
                            >
                                <S3Uploader setFileUrl={setUploadedImageUrl} finalFileUrl={uploadedImageUrl} />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
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
            </div>
        </LazyLoad>
    );
};

export default GamesTab;
