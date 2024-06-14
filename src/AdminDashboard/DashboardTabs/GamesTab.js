import React, { useState } from 'react';
import {
    ConfigProvider, Form, Radio, theme,
    Input, Cascader, Select, Button
} from 'antd';
import LazyLoad from '../../components/LazyLoad/lazyload';
import Raxios from '../../services/axiosHelper';
import Loading from '../../components/Loading/loading';

const GamesTab = () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    const [game, setGame] = useState(
        localStorage.getItem('game') || 'quiz'
    );
    const [options, setOptions] = useState([]);
    const [questions, setQuestions] = useState([]);

    React.useEffect(() => {
        Raxios.get('/games/quizQuestions')
            .then((res) => {
                setQuestions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const onFormSubmit = (values) => {
        Raxios.post('/games/addQuestion', values)
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
                                    defaultValue={[['quiz', 1, 'Quesss', '2', '2'] || []]}
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
