import React, { useState } from 'react';
import S3Uploader from '../../Upload';
import { Modal, Button } from 'antd';
import { MaxiosPost } from '../../../services/fetchData';

const BulkUploadPopup = ({ visible, setVisible }) => {
    const [fileUrl, setFileUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const templateUrl = 'https://sukoon-media.s3.amazonaws.com/bulk_template.csv'

    const handleSubmit = async () => {
        try {
            await MaxiosPost('/flask/bulk_users', { file_url: fileUrl }, true, setLoading);
            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            title="Bulk Upload"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setVisible(false)}>
                    Cancel
                </Button>,
                <Button loading={loading} key="submit" type="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            ]}
        >
            <div className='flex flex-col w-full h-full gap-5 py-5'>
                {['Download the template file. Make sure date format is being followed else current time will be assumed.', 'Upload a CSV file to bulk upload users'].map((text, index) => (
                    <div key={index} className='flex w-full h-full items-center justify-center'>
                        <div className='w-full h-full flex items-center justify-start'>
                            <p>{text}</p>
                        </div>
                        {index === 1 ? (
                            <S3Uploader setFileUrl={setFileUrl} finalFileUrl={fileUrl} />
                        ) : (
                            <Button href={templateUrl} target='_blank'>Download</Button>
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default BulkUploadPopup;
