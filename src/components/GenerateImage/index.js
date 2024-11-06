import React from "react";
import { Button, Input, message } from "antd";
import { raxiosFetchData } from "../../services/fetchData";
import axios from "axios";

const GenerateImage = () => {
    const [image, setImage] = React.useState("");
    const [auth, setAuth] = React.useState(false);
    const [prompt, setPrompt] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const generateImage = async () => {
        const response = await raxiosFetchData(null, null, null, null, '/dall_image', { prompt }, setLoading, true);
        if (!response.url) return;
        setImage(response.url);
    }

    const downloadImage = async () => {
        try {
            const response = await axios.get(image, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "download.png");
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Image download failed:', error);
            message.error('Image download failed');
        }
    }

    const handleAuth = () => {
        if (prompt === process.env.REACT_APP_GEN_PASS) {
            setAuth(true);
            setPrompt("");
        } else {
            message.error('Incorrect password');
        }
    }

    if (!auth) return (
        <div className="flex max-h-screen items-center justify-center gap-5 pt-2">
            <Input.Password
                placeholder="Enter password"
                className="w-96"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
                loading={loading}
                onClick={handleAuth}
                type="primary"
            >
                Authenticate
            </Button>
        </div>
    )

    return (
        <div className="flex max-h-screen items-center justify-center gap-5 pt-2">
            <Input.TextArea
                placeholder="Enter text to generate image"
                className="w-96"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex flex-col gap-1">
                <Button
                    loading={loading}
                    onClick={generateImage}
                    type="primary"
                >
                    Generate
                </Button>
                {image && <Button onClick={downloadImage}>Download</Button>}
            </div>
            {image && <img src={image} alt={prompt} className="h-min" />}
        </div>
    )
};

export default GenerateImage;