import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollBottom from '../AdminDashboard/ScrollBottom';
import axios from 'axios';
import './CallDetails.css';

const CallDetails = () => {
    const { callId } = useParams();
    const [call, setCall] = useState(null);
    const [showBreakup, setShowBreakup] = useState(false);
    const [editConversationScore, setEditConversationScore] = useState(false);
    const [newConversationScore, setNewConversationScore] = useState('');

    useEffect(() => {
        axios.get(`/api/calls/${callId}`)
            .then(response => {
                setCall(response.data);
                setNewConversationScore(response.data.ConversationScore);
            })
            .catch(error => {
                console.error('Error fetching call details:', error);
            })
    }, [callId]);

    const handleScoreChange = () => {
        axios.put(`/api/calls/${callId}`, {
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
        return value.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const toggleBreakup = () => {
        setShowBreakup(!showBreakup);
    };

    return (
        <div className="whole-container">
            <h2>Call Details</h2>
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
                    <p>Recording URL: <a href={formattedRecordingURL} target="_blank" rel="noopener noreferrer">{formattedRecordingURL}</a></p>
                </div>
                <div className="details-box">
                    <p>Transcript URL: <a href={call.transcript_url} target="_blank" rel="noopener noreferrer">{call.transcript_url}</a></p>
                </div>
                <div className="details-box">
                    <p>Initiated Time: {call.initiatedTime}</p>
                </div>
            </div>
            <Link to="/experts" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 className="experts-button">View All Experts</h1>
            </Link>
            <Link to="/calls" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 className="calls-button">View All Calls</h1>
            </Link>
            <Link to="/users" style={{ textDecoration: 'none', color: 'inherit' }}>
                <h1 className="users-button">View All Users</h1>
            </Link>
            <ScrollBottom />
        </div>
    );
}

export default CallDetails;
