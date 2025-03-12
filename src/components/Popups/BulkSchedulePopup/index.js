import React, { useState } from 'react';
import S3Uploader from '../../Upload';
import { Modal, Button } from 'antd';
import { MaxiosPost } from '../../../services/fetchData';

const BulkSchedulePopup = ({ visible, setVisible }) => {
    const [fileUrl, setFileUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            await MaxiosPost('/flask/bulk_schedule', { file_url: fileUrl }, true, setLoading);
            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Modal
            title="Bulk Schedule"
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
                <div className='w-full h-full flex items-center justify-start'>
                    <p>The column names should be 'user' and 'saarthi'</p>
                </div>
                <S3Uploader setFileUrl={setFileUrl} finalFileUrl={fileUrl} />
            </div>
        </Modal>
    );
};

export default BulkSchedulePopup;
