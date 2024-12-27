import React, { useEffect, useState } from "react";
import { Modal, Select, Input, Button } from 'antd';
import Loading from "../../components/Loading/loading";
import { raxiosFetchData, RaxiosPost } from "../../services/fetchData";

const { Option } = Select;

const ARKTab = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newContext, setNewContext] = useState("");
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        await addPrompt(newContext);
        setIsModalVisible(false);
        setNewContext("");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setNewContext("");
    };

    const fetchPrompts = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/actions/system_prompts', null, setLoading);
        setPrompts(response)
    }

    useEffect(() => {
        fetchPrompts();
    }, []);

    useEffect(() => {
        if (prompts.length > 0 && !selectedPrompt) {
            setSelectedPrompt(prompts[0]);
        }
    }, [prompts, selectedPrompt]);

    const updatePrompt = async () => {
        if (selectedPrompt) {
            await RaxiosPost('/actions/system_prompts', { context: selectedPrompt.context, content: selectedPrompt.content }, true, setLoading);
            fetchPrompts();
        }
    }

    const addPrompt = async (context) => {
        await RaxiosPost('/actions/system_prompts', { context, content: "" }, true, setLoading);
        fetchPrompts();
    };

    if (loading) return <Loading />;

    return (
        <div className="py-5 w-full flex-col justify-center items-center">
            <div className="flex gap-3">
                <Select
                    className="w-72"
                    placeholder="Select a prompt"
                    onChange={(value) => {
                        const prompt = prompts.find(p => p.context === value);
                        setSelectedPrompt(prompt);
                    }}
                    value={selectedPrompt?.context}
                >
                    {prompts.map(prompt => (
                        <Option key={prompt.context} value={prompt.context}>
                            {prompt.context}
                        </Option>
                    ))}
                </Select>

                <Button type="primary" onClick={showModal}>
                    Add New Prompt
                </Button>
                <Modal
                    title="Add New Prompt"
                    open={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <Input
                        placeholder="Enter context"
                        value={newContext}
                        onChange={(e) => setNewContext(e.target.value)}
                    />
                </Modal>
            </div>
            {selectedPrompt && (
                <div className="mt-6 w-full">
                    <Input.TextArea
                        rows={30}
                        value={selectedPrompt.content}
                        onChange={(e) => setSelectedPrompt({ ...selectedPrompt, content: e.target.value })}
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