import React, { useState, useEffect } from 'react';
import { Modal, Button, Input } from 'antd';

const SingleInputPopup = ({ visible, setVisible, placeholder, handleCreate, title }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (visible) {
            setName('');
        }
    }, [visible]);

    return (
        <Modal
            title={title}
            open={visible}
            onCancel={() => setVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setVisible(false)}>
                    Cancel
                </Button>,
                <Button key="create" type="primary" onClick={() => handleCreate(name)}>
                    Create
                </Button>
            ]}
        >
            <div className='flex flex-col w-full h-full gap-5 py-5'>
                <div className='flex w-full h-full items-center justify-center'>
                    <div className='w-full h-full flex items-center justify-start'>
                        <Input placeholder={placeholder} type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default SingleInputPopup;