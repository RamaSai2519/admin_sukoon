import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import Raxios from '../../services/axiosHelper';
import { Upload, message, Button } from 'antd';
import axios from 'axios';

const S3Uploader = ({ setFileUrl, finalFileUrl }) => {
    const [uploading, setUploading] = useState(false);

    const getPresignedUrl = async (file) => {
        try {
            const response = await Raxios.post('/actions/upload', {
                file_name: file.name,
                file_type: file.type,
            });
            return response.data.url; // This is the pre-signed URL
        } catch (error) {
            message.error('Error getting pre-signed URL');
            return null;
        }
    };

    const handleUpload = async ({ file }) => {
        setUploading(true);

        // Step 1: Get the pre-signed URL from the backend
        const presignedUrl = await getPresignedUrl(file);

        if (!presignedUrl) {
            setUploading(false);
            return;
        }

        try {
            // Step 2: Upload the file to S3 using the pre-signed URL
            await axios.put(presignedUrl, file, {
                headers: {
                    'Content-Type': file.type,
                },
            });

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
            {finalFileUrl && <img src={finalFileUrl} alt="File Uploaded" className='w-full mt-2 max-h-52' />}
        </div>
    );
};

export default S3Uploader;