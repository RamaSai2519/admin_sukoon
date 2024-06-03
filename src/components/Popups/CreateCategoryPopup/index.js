import React, { useState, useEffect } from 'react';
import Raxios from '../../../services/axiosHelper';
import { Button } from 'antd';

const CreateCategoryPopup = ({ visible, setVisible }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (visible) {
            setName('');
        }
    }, [visible]);

    const handleCreate = () => {
        Raxios.post('/data/categories', {
            name,
        })
            .then(response => {
                window.alert('Category created successfully.');
                setVisible(false);
            })
            .catch(error => {
                console.error('Error creating Category:', error);
                window.alert('Error creating Category:', error);
            });
        setVisible(false);
    };

    return (
        <div className={`fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ${visible ? 'visible' : ''}`}>
            <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative ">
                <div className='container w-1/2 p-5 mx-auto '>
                    <div className="flex flex-row w-full m-5 px-5 justify-between">
                        <h1>Create Expert</h1>
                        <button className="pback-button" onClick={() => setVisible(false)}>X</button>
                    </div>
                    <div className='grid items-center justify-stretch m-5 w-full'>
                        <div className='grid-tile'>
                            <h3>Category</h3>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='grid-tile'>
                            <Button className='w-full h-full' onClick={handleCreate}>
                                <h1>Create</h1>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCategoryPopup;