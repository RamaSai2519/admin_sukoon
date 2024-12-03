import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import Raxios from '../../services/axiosHelper';
import { Upload, message, Button } from 'antd';
import axios from 'axios';

const S3Uploader = ({ setFileUrl, finalFileUrl, show = true }) => {
    const [uploading, setUploading] = useState(false);

    const getPresignedUrl = async (file) => {
        try {
            const response = await Raxios.post('/actions/upload', { file_name: file.name, file_type: file.type });
            return response.data.url;
        } catch (error) {
            message.error('Error getting pre-signed URL');
            return null;
        }
    };

    const handleUpload = async ({ file }) => {
        setUploading(true);
        const presignedUrl = await getPresignedUrl(file);
        if (!presignedUrl) {
            setUploading(false);
            return;
        }

        try {
            await axios.put(presignedUrl, file, { headers: { 'Content-Type': file.type } });
            const fileUrl = presignedUrl.split('?')[0];
            setFileUrl(fileUrl);
            message.success(`${file.name} uploaded successfully.`);
        } catch (error) {
            message.error(`Failed to upload ${file.name}`);
        }
        setUploading(false);
    };

    return (
        <div>
            <Upload
                customRequest={handleUpload}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />} loading={uploading}>
                    {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
            </Upload>
            {(finalFileUrl && show) && <img src={finalFileUrl} alt="File Uploaded" className='w-full mt-2 max-h-52' />}
        </div>
    );
};

export default S3Uploader;