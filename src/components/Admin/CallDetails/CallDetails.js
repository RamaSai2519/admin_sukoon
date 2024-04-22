// src/components/Admin/CallDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './CallDetails.css'; // Import CSS file

const CallDetails = () => {
    const { callId } = useParams();
    const [call, setCall] = useState(null);
    const [showBreakup, setShowBreakup] = useState(false); // State for pop-up visibility

    useEffect(() => {
        // Fetch details of the specific call using callId
        axios.get(`http://15.206.127.248/api/calls/${callId}`)
            .then(response => {
                setCall(response.data);
            })
            .catch(error => {
                console.error('Error fetching call details:', error);
            });
    }, [callId]);

    if (!call) {
        return <div>Loading...</div>;
    }

    // Replace %3D with =
    const formattedRecordingURL = call.recording_url.replace(/%3D/g, '=');

    // Helper function to format values with \n for line breaks
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
        <div className="whole-container"> {/* Add class for flex container */}
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
                    <h1>{call["Conversation Score"]}</h1>
                </div>
                <div className="small-tiles"> {/* Change to column layout */}
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
                    <p>User Callback: {formatValue(call["User Callback"])}</p>
                </div>
                <div className="details-box">
                    <p>Recording URL: <a href={formattedRecordingURL} target="_blank" rel="noopener noreferrer">{formattedRecordingURL}</a></p>
                </div>
                <div className="details-box">
                    <p>Initiated Time: {call.initiatedTime}</p>
                </div>
            </div>
        </div>
    );
}

export default CallDetails;
