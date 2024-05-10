import React, { useState, useEffect } from 'react';
import Raxios from '../../../services/axiosHelper';
import { useParams, Link } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { FaArrowLeft } from 'react-icons/fa';
import 'react-circular-progressbar/dist/styles.css';
import './ExpertDetails.css';

const ExpertDetails = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [name, setName] = useState('');
  const [flow, setFlow] = useState('');
  const [probability, setProbability] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [timeSplit, setTimeSplit] = useState('');
  const [tonality, setTonaity] = useState('');
  const [userSentiment, setUserSentiment] = useState('');
  const [openingGreeting, setOpeningGreeting] = useState('');
  const [closingGreeting, setClosingGreeting] = useState('');
  const [score, setScore] = useState('');
  const [repeatScore, setRepeatScore] = useState('');
  const [callsShare, setCallsShare] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    Raxios.get(`/api/experts/${expertId}`)
      .then(response => {
        setExpert(response.data);
        setName(response.data.name);
        setCallsShare(response.data.calls_share);
        setScore(response.data.score);
        setRepeatScore(response.data.repeat_score);
        setFlow(response.data.flow);
        setProbability(response.data.probability);
        setTimeSpent(response.data.timeSpent);
        setTimeSplit(response.data.timeSplit);
        setTonaity(response.data.tonality);
        setUserSentiment(response.data.userSentiment);
        setOpeningGreeting(response.data.openingGreeting);
        setClosingGreeting(response.data.closingGreeting);
      })
      .catch(error => {
        console.error('Error fetching expert details:', error);
      });
    return () => {
    };
  }, [expertId]);

  const handleUpdate = () => {
    Raxios.put(`/api/experts/${expertId}`, {
      name,
      score,
      flow,
      probability,
      timeSpent,
      timeSplit,
      tonaity: tonality,
      userSentiment,
      openingGreeting,
      closingGreeting,
      calls_share: callsShare,
      repeat_score: repeatScore
    })
      .then(response => {
        setExpert(response.data);
        setEditMode(false);
        window.alert('Expert details updated successfully!');
        localStorage.removeItem('experts');
      })
      .catch(error => {
        console.error('Error updating expert details:', error);
      });
  };

  return (
    <div className='details-container'>
      {expert && (
        <div className='report-content-container'>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '20px'}}>
            <h1>Detailed Scores</h1>
            <button className='back-button' onClick={() => window.history.back()}>
              <FaArrowLeft className="back-icon" />
            </button>
          </div>
          <div className="report-grid-container">
            <div className="report-grid-item">
              <div className='report-grid-tile-1'>
                {editMode ? (
                  <div>
                    <p>Name</p>
                    <p><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
                  </div>
                ) : (
                  <h1>{name}</h1>
                )}
              </div>
              <div className='report-grid'>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Conversation Score</p>
                      <p><input type="number" value={score} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Calls Score</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={score * 20}
                          text={`${score * 20}`}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*100</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Repeat Rate</p>
                      <p><input type="number" value={repeatScore} onChange={(e) => setRepeatScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Repeat Rate</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={repeatScore}
                          text={repeatScore}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*100</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Share of Calls</p>
                      <p><input type="number" value={callsShare} onChange={(e) => setRepeatScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Calls Share</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          maxValue={7.69}
                          value={callsShare}
                          text={`${callsShare.toFixed(0)}%`}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*8</p>
                    </div>
                  )}
                </div>
              </div>
              <div className='divider'></div>
            </div>
          </div>

          <div className="report-grid-container">
            <div className="report-grid-item">
              <h2>Score Breakup</h2>
              <div className='report-grid-2'>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Opening Greeting</p>
                      <p><input type="number" value={openingGreeting} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Opening</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={openingGreeting}
                          text={`${openingGreeting}`}
                          maxValue={5}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*5</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Flow Score</p>
                      <p><input type="number" value={flow} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Flow</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={flow}
                          text={`${flow}`}
                          maxValue={10}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*10</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Tonality Score</p>
                      <p><input type="number" value={tonality} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Tonality</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={tonality}
                          text={`${tonality}`}
                          maxValue={10}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*10</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Time Split Score</p>
                      <p><input type="number" value={timeSplit} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Time Split</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={timeSplit}
                          text={`${timeSplit}`}
                          maxValue={15}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*15</p>
                    </div>
                  )}
                </div>

                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>User Sentiment Score</p>
                      <p><input type="number" value={userSentiment} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Sentiment</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={userSentiment}
                          text={`${userSentiment}`}
                          maxValue={20}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*20</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Time Spent Score</p>
                      <p><input type="number" value={timeSpent} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Time Spent</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={timeSpent}
                          text={`${timeSpent}`}
                          maxValue={15}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*15</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>User Callback Probability</p>
                      <p><input type="number" value={probability} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Probability</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={probability}
                          text={`${probability}`}
                          maxValue={20}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*20</p>
                    </div>
                  )}
                </div>
                <div className='report-grid-tile-1'>
                  {editMode ? (
                    <div>
                      <p>Closing Greeting</p>
                      <p><input type="number" value={closingGreeting} onChange={(e) => setScore(e.target.value)} /></p>
                    </div>
                  ) : (
                    <div className='score-container'>
                      <h2>Closing</h2>
                      <div className='progress-circle'>
                        <CircularProgressbar
                          value={closingGreeting}
                          text={`${closingGreeting}`}
                          maxValue={5}
                          circleRatio={0.75}
                          styles={buildStyles({
                            rotation: 0.625,
                            strokeLinecap: "round",
                            textSize: '25px',
                            pathColor: '#1fe01f',

                            trailColor: '#141414',
                          })}
                        />
                      </div>
                      <p>*5</p>
                    </div>
                  )}
                </div>
              </div>
              <div className='divider'></div>
            </div>

          </div>
          <div className='edit-button-container'>
            {editMode ? (
              <>
                <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
                <button className='update-button' onClick={handleUpdate}>Update Details</button>
              </>
            ) : (
              <>
                <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
              </>
            )}
            <Link
              to={{
                pathname: `/admin/experts/${expertId}/report`
              }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDetails;
