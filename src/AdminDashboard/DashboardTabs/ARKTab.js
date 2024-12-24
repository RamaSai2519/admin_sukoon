import React, { useEffect, useState } from "react";
import { Select, Input, Button } from 'antd';
import Loading from "../../components/Loading/loading";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";

const { Option } = Select;

const ARKTab = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [newContent, setNewContent] = useState("");

    const fetchPrompts = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/actions/system_prompts', null, setLoading);
        setPrompts(response)
    }

    useEffect(() => {
        fetchPrompts();
    }, []);

    useEffect(() => {
        if (prompts.length > 0) {
            const prompt = prompts[0];
            setSelectedPrompt(prompt);
            setNewContent(prompt.content);
        }
    }, [prompts]);

    const updatePrompt = async () => {
        if (selectedPrompt) {
            await RaxiosPost('/actions/system_prompts', { context: selectedPrompt.context, content: newContent }, true, setLoading);
            fetchPrompts();
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="py-5 w-full flex-col justify-center items-center">
            <Select
                className="w-72"
                placeholder="Select a prompt"
                onChange={(value) => {
                    const prompt = prompts.find(p => p.context === value);
                    setSelectedPrompt(prompt);
                    setNewContent(prompt.content);
                }}
            >
                {prompts.map(prompt => (
                    <Option key={prompt.context} value={prompt.context}>
                        {prompt.context}
                    </Option>
                ))}
            </Select>
            {selectedPrompt && (
                <div className="mt-6 w-full">
                    <Input.TextArea
                        rows={30}
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                    />
                    <Button type="primary" onClick={updatePrompt} className="mt-4">
                        Update Prompt
                    </Button>
                </div>
            )}
        </div>
    );
};

export default ARKTab;