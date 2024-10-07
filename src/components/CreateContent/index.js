import React, { useState } from "react";
import Raxios from "../../services/axiosHelper";
import { Button, Input, message, Form } from "antd";

const CreateContent = () => {
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [content, setContent] = useState({ tags: [] });
    const [photos, setPhotos] = useState([]);
    const [query, setQuery] = useState("");
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const handleApiRequest = async (apiCall, successMessage, errorMessage) => {
        setLoading(true);
        try {
            await apiCall();
            if (successMessage) message.success(successMessage);
        } catch (error) {
            message.error(errorMessage);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const get_content = () => handleApiRequest(
        async () => {
            const response = await Raxios.post("/chat", { prompt });
            setContent(response.data);
        },
        null,
        "Error getting content"
    );

    const get_photos = () => handleApiRequest(
        async () => {
            const response = await Raxios.get("/photos", {
                params: { query, page: 1, per_page: 6 }
            });
            setPhotos(response.data);
        },
        null,
        "Error getting pictures"
    );

    const send_content = () => handleApiRequest(
        async () => {
            if (!content || !selectedPhoto) {
                message.error("Please select a photo and generate content first");
                return;
            }
            const photo = { slug: selectedPhoto.slug, description: selectedPhoto.alt_description, url: selectedPhoto.url }
            const response = await Raxios.post("/content", { content, photo });
            message.success(response.msg);
        },
        "Content sent successfully",
        "Error sending content"
    );

    const handlePhotoSelection = (photo) => {
        setSelectedPhoto(selectedPhoto === photo ? null : photo);
    };

    // For dynamic tags input, manipulating content.tags directly
    const handleTagChange = (index, value) => {
        const newTags = [...content.tags];
        newTags[index] = value;
        setContent({ ...content, tags: newTags });
    };

    const addTagInput = () => setContent({ ...content, tags: [...content.tags, ""] });

    const removeTagInput = (index) => {
        const newTags = content.tags.filter((_, i) => i !== index);
        setContent({ ...content, tags: newTags });
    };

    const renderFormInput = (label, value, setValue, type = "text", rows = 1) => (
        <Form.Item label={label}>
            {type === "textarea" ? (
                <Input.TextArea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    rows={rows}
                />
            ) : (
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            )}
        </Form.Item>
    );

    const renderButton = (onFinish, label) => (
        <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} className="mt-5">
                {label}
            </Button>
        </Form.Item>
    );

    return (
        <div className="p-5 pl-0 w-full overflow-auto flex md:flex-row flex-col h-max">
            <div className="md:w-1/2 mr-2">
                <div className="grid grid-cols-2">
                    {/* Generate Content Form */}
                    <div className="p-5 pl-0 flex flex-col">
                        <Form layout="vertical" onFinish={get_content}>
                            {renderFormInput("Generate Content", prompt, setPrompt)}
                            {renderButton(get_content, "Generate")}
                        </Form>
                    </div>

                    {/* Search Photos Form */}
                    <div className="p-5 flex flex-col">
                        <Form layout="vertical" onFinish={get_photos}>
                            {renderFormInput("Search Photos", query, setQuery)}
                            {renderButton(get_photos, "Get Pictures")}
                        </Form>
                    </div>
                </div>

                {/* Content Editing Form */}
                <Form layout="vertical" onFinish={send_content}>
                    {renderFormInput("Content", content.response, (val) => setContent(prevContent => ({ ...prevContent, response: val })), "textarea", 6)}
                    {renderFormInput("Category", content.category, (val) => setContent(prevContent => ({ ...prevContent, category: val })))}

                    {/* Dynamic Tags Input */}
                    <Form.Item label="Tags">
                        {content.tags.map((tag, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <Input
                                    value={tag}
                                    onChange={(e) => handleTagChange(index, e.target.value)}
                                    style={{ marginRight: '8px' }}
                                />
                                <Button type="danger" onClick={() => removeTagInput(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="dashed" onClick={addTagInput}>
                            Add Tag
                        </Button>
                    </Form.Item>

                    {renderButton(send_content, "Send Content")}
                </Form>
            </div>

            {/* Photos Grid */}
            <div className="flex md:mt-0 mt-5 md:w-1/2 pl-2 md:border-l-2 dark:md:border-lightBlack">
                <div className="grid grid-cols-2 w-full">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className={`p-2 ${selectedPhoto === photo ? 'border-2 border-blue-500' : ''}`}
                            onClick={() => handlePhotoSelection(photo)}
                        >
                            <img src={photo.url} alt={photo.alt_description} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CreateContent;