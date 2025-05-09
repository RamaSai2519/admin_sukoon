import React, { useState } from 'react';
import S3Uploader from '../../Upload';
import { MaxiosPost } from '../../../services/fetchData';
import { Modal, Button, Form, message, InputNumber } from 'antd';

const BulkSchedulePopup = ({ visible, setVisible }) => {
    const [fileUrl, setFileUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        if (!fileUrl) { message.error("Please upload a file"); return; }
        if (values.call_duration !== 30 && values.call_duration !== 60) { message.error("Call duration should be 30 or 60 minutes"); return; }
        try {
            const payload = { file_url: fileUrl, call_duration: values.call_duration };
            await MaxiosPost('/flask/bulk_schedule', payload, true, setLoading);
            setVisible(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="Bulk Schedule"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
        >
            <Form
                layout="vertical"
                onFinish={handleSubmit}
                className='flex flex-col w-full h-full gap-5 py-5'
            >
                <div className='w-full h-full flex items-center justify-start'>
                    <p>The column names should be 'user' and 'saarthi'</p>
                </div>
                <S3Uploader setFileUrl={setFileUrl} finalFileUrl={fileUrl} />
                <Form.Item
                    label="Call Duration"
                    name="call_duration"
                    rules={[{ required: true, message: 'Please input the call duration!' }]}
                >
                    <InputNumber className='w-full' placeholder='30/60 minutes' min={30} max={60} />
                </Form.Item>
                <Form.Item>
                    <div className='flex justify-end gap-2'>
                        <Button key="cancel" onClick={() => setVisible(false)}>
                            Cancel
                        </Button>
                        <Button loading={loading} key="submit" type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default BulkSchedulePopup;
