import React, { useState, useEffect } from 'react';
import Raxios from '../../services/axiosHelper';
import { Button } from 'antd';

const CreateEventPopup = ({ visible, setVisible }) => {
    const [name, setName] = useState('');
    const [mainTitle, setMainTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');
    const [slug, setSlug] = useState('');

    useEffect(() => {
        if (visible) {
            setName('');
            setMainTitle('');
            setSubTitle('');
        }
    }, [visible]);

    const handleCreate = () => {
        Raxios.post('/event/event', {
            name,
            mainTitle,
            subTitle,
            slug
        })
            .then(response => {
                window.alert('Event created successfully.');
                setVisible(false);
            })
            .catch(error => {
                console.error('Error creating event:', error);
                window.alert('Error creating event:', error);
            });
        window.alert('Event created successfully.'); 
        setVisible(false);
    };

    return (
        <div className={`fixed left-0 top-0 overflow-auto w-full h-full bg-black bg-opacity-50 ${visible ? 'visible' : ''}`}>
            <div className="p-10 rounded-5 rounded-10 shadow-md min-w-1/2 max-w-90 max-h-90 overflow-y-auto relative">
                <div className='container w-1/2 mx-auto h-auto'>
                    <div className="flex flex-row w-full m-5 px-5 justify-between">
                        <h1>Create Event</h1>
                        <button className="pback-button" onClick={() => setVisible(false)}>X</button>
                    </div>
                    <div className='grid items-center justify-stretch m-5 w-full'>
                        <div className='grid-tile'>
                            <h3>Title</h3>
                            <input type="text" value={mainTitle} onChange={(e) => setMainTitle(e.target.value)} />
                        </div>
                        <div className='grid-tile'>
                            <h3>Subtitle</h3>
                            <input type="text" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} />
                        </div>
                        <div className='grid-tile'>
                            <h3>Author Name</h3>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='grid-tile'>
                            <h3>Slug</h3>
                            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
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

export default CreateEventPopup;