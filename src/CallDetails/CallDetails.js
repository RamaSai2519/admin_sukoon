import React, { useEffect, useState } from 'react';
import { raxiosFetchData } from '../services/fetchData';
import Loading from '../components/Loading/loading';
import { formatTime } from '../Utils/formatHelper';
import { useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from 'antd';
import './CallDetails.css';

const CallDetails = () => {
    const { callId } = useParams();
    const [call, setCall] = useState(null);
    const [showBreakup, setShowBreakup] = useState(false);

    const fetchCall = async () => {
        await raxiosFetchData(null, null, setCall, null, `/call`, {
            callId, dest: 'search'
        });
    };

    useEffect(() => {
        fetchCall();
        // eslint-disable-next-line
    }, [callId]);

    if (!call) return <Loading />;

    const formattedRecordingURL = call?.recording_url?.replace(/%3D/g, '=') || null;

    const formatValue = (value) => {
        if (!value) return null;
        if (typeof value === 'object') {
            value = JSON.stringify(value, null, 2);
            // eslint-disable-next-line
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
                    <h1>{call.user}</h1>
                </div>
                <div className="details-box">
                    <h3>Saarthi</h3>
                    <h1>{call.expert}</h1>
                </div>
                {call.conversationScore && <div className="details-box">
                    <h3>Conversation Score</h3>
                    <h1>{call.conversationScore}</h1>
                </div>}
                <div className="small-tiles">
                    {call.scoreBreakup && <div className="details-box">
                        <button onClick={toggleBreakup} className='popup-button'>Score Breakup</button>
                        {showBreakup && (
                            <div className="popup">
                                <div className="popup-content">
                                    <span className="close" onClick={toggleBreakup}>&times;</span>
                                    <p>{formatValue(call.scoreBreakup)}</p>
                                </div>
                            </div>
                        )}
                    </div>}
                    <div className="details-box">
                        <p>Duration: {call.duration}</p>
                    </div>
                </div>
                {call.Summary && <div className="details-box">
                    <h2>Summary</h2>
                    <p>{formatValue(call.Summary)}</p>
                </div>}
                {call.sarathiFeedback && <div className="details-box">
                    <h2>Saarthi Feedback</h2>
                    <p>{formatValue(call.sarathiFeedback)}</p>
                </div>}
                {call.userCallback && <div className="details-box">
                    <h2>User Callback</h2>
                    <p>{formatValue(call.userCallback)}</p>
                </div>}
                {call.Topics && <div className="details-box">
                    <h2>Topics</h2>
                    <p>{formatValue(call.Topics)}</p>
                </div>}
                <div className="details-box">
                    <p>Initiated Time: {formatTime(call.initiatedTime)}</p>
                </div>
                {formattedRecordingURL && <Button style={{ margin: '10px' }} type="primary" href={formattedRecordingURL}>
                    Download Recording
                </Button>}
                {call.transcript_url && <Button style={{ margin: '10px' }} type="primary" href={call.transcript_url} target="_blank" rel="noopener noreferrer">
                    Download Transcript
                </Button>}
            </div>
        </div>
    );
}

export default CallDetails;
