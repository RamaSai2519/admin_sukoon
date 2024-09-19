import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ScrollBottom from '../components/ScrollBottom';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from 'antd';
import Raxios from '../services/axiosHelper';
import './CallDetails.css';

const CallDetails = () => {
    const { callId } = useParams();
    const [call, setCall] = useState(null);
    const [showBreakup, setShowBreakup] = useState(false);
    const [editConversationScore, setEditConversationScore] = useState(false);
    const [newConversationScore, setNewConversationScore] = useState('');

    useEffect(() => {
        Raxios.get(`/call/calls/${callId}`)
            .then(response => {
                setCall(response.data);
                setNewConversationScore(response.data.ConversationScore);
            })
            .catch(error => {
                console.error('Error fetching call details:', error);
            })
    }, [callId]);

    const handleScoreChange = () => {
        Raxios.put(`/call/calls/${callId}`, {
            ConversationScore: newConversationScore
        })
            .then(response => {
                setCall(prevCall => ({
                    ...prevCall,
                    "Conversation Score": response.newConversationScore
                }));
                setEditConversationScore(false);
                window.alert("Conversation Score updated successfuly!");
                window.location.reload();
            })
            .catch(error => {
                console.error('Error updating Conversation Score:', error);
            });
    };

    const cancelEdit = () => {
        setNewConversationScore(call.ConversationScore);
        setEditConversationScore(false);
    };

    if (!call) {
        return <div>Loading...</div>;
    }

    const formattedRecordingURL = call.recording_url.replace(/%3D/g, '=');

    const formatValue = (value) => {
        if (!value) return null;
        if (typeof value === 'object') {
            value = JSON.stringify(value, null, 2);
            value = value.replace(/\"/g, '');
        }
        try {
            return value.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line.replace('**', '').replace('**', '')}
                    <br />
                </React.Fragment>
            ));
        } catch (error) {
            console.error('Error formatting value:', error);
            return value;
        }
    };

    const toggleBreakup = () => {
        setShowBreakup(!showBreakup);
    };

    return (
        <div className="whole-container min-h-screen">
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '20px' }}>
                <h1>Call Details</h1>
                <button className='back-button' onClick={() => window.history.back()}>
                    <FaArrowLeft className="back-icon" />
                </button>
            </div>
            <div className="details-container">
                <div className="details-box">
                    <h3>User</h3>
                    <h1>{call.userName}</h1>
                </div>
                <div className="details-box">
                    <h3>Saarthi</h3>
                    <h1>{call.expertName}</h1>
                </div>
                <div className="details-box">
                    <h3>Conversation Score</h3>
                    <div className='ScoreEdit'>
                        {editConversationScore ? (
                            <>
                                <input
                                    type="number"
                                    value={newConversationScore}
                                    onChange={(e) => setNewConversationScore(e.target.value)}
                                />
                                <button className='popup-button' onClick={handleScoreChange}>Update</button>
                                <button className='popup-button' onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h1>{call.ConversationScore}</h1>
                                <button className='popup-button' onClick={() => setEditConversationScore(true)}>Edit</button>
                            </>
                        )}
                    </div>
                </div>
                <div className="small-tiles">
                    <div className="details-box">
                        <button onClick={toggleBreakup} className='popup-button'>Score Breakup</button>
                        {showBreakup && (
                            <div className="popup">
                                <div className="popup-content">
                                    <span className="close" onClick={toggleBreakup}>&times;</span>
                                    <p>{formatValue(call["Score Breakup"])}</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="details-box">
                        <p>Duration: {call.duration}</p>
                    </div>
                </div>
                <div className="details-box">
                    <h2>Summary</h2>
                    <p>{formatValue(call.Summary)}</p>
                </div>
                <div className="details-box">
                    <h2>Saarthi Feedback</h2>
                    <p>{formatValue(call["Saarthi Feedback"])}</p>
                </div>
                <div className="details-box">
                    <h2>User Callback</h2>
                    <p>{formatValue(call["User Callback"])}</p>
                </div>
                <div className="details-box">
                    <h2>Topics</h2>
                    <p>{formatValue(call.Topics)}</p>
                </div>
                <div className="details-box">
                    <p>Initiated Time: {call.initiatedTime}</p>
                </div>
                <Button style={{ margin: '10px' }} type="primary" href={formattedRecordingURL}>
                    Download Recording
                </Button>
                <Button style={{ margin: '10px' }} type="primary" href={call.transcript_url} target="_blank" rel="noopener noreferrer">
                    Download Transcript
                </Button>
            </div>
            <ScrollBottom />
        </div>
    );
}

export default CallDetails;
