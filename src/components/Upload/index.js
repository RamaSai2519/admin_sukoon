import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import Raxios from '../../services/axiosHelper';
import { Upload, message, Button, Spin } from 'antd';
import axios from 'axios';

const S3Uploader = ({ setFileUrl, finalFileUrl, show = true, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const getPresignedUrl = async (file) => {
        try {
            const response = await Raxios.post('/actions/upload', {
                file_name: file.name,
                file_type: file.type
            });

            return response?.data?.url || null;
        } catch (error) {
            console.error('Error getting pre-signed URL:', error);
            message.error('Failed to get upload URL. Please try again.');
            return null;
        }
    };

    const handleUpload = async ({ file }) => {
        if (!file) {
            message.error('No file selected.');
            return;
        }
        const allowedTypes = [
          'image/png',
          'image/jpeg',
          'image/jpg',
          'image/webp',
          'text/csv'
        ];
        const maxSize = 1 * 1024 * 1024; 

        if (!allowedTypes.includes(file.type)) {
            message.error('Only PNG, JPG, and WEBP images are allowed.');
            return;
        }

        if (file.size > maxSize) {
            message.error('File size exceeds 5MB limit.');
            return;
        }

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
            console.error('Upload failed:', error);
            message.error(`Failed to upload ${file.name}.`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <Upload disabled={disabled} customRequest={handleUpload} showUploadList={false}>
                <Button disabled={disabled || uploading} icon={<UploadOutlined />}>
                    {uploading ? <Spin size="small" /> : 'Upload Image'}
                </Button>
            </Upload>

            {finalFileUrl && show && (
                <img
                    src={finalFileUrl}
                    alt="Uploaded File"
                    className="w-full mt-2 max-h-52 rounded shadow"
                />
            )}
        </div>
    );
};

export default S3Uploader;
