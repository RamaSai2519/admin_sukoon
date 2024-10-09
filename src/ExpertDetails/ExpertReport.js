// import React, { useState, useEffect } from 'react';
// import Faxios from '../services/axiosHelper';
// import { useParams, Link } from 'react-router-dom';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import { FaArrowLeft } from 'react-icons/fa';
// import 'react-circular-progressbar/dist/styles.css';

// const EditableField = ({ label, value, onChange, type = "text" }) => (
//   <div>
//     <p>{label}</p>
//     <p><input type={type} value={value} onChange={(e) => onChange(e.target.value)} /></p>
//   </div>
// );

// const ProgressCircle = ({ label, value, maxValue }) => (
//   <div className='score-container'>
//     <h2>{label}</h2>
//     <div className='progress-circle'>
//       <CircularProgressbar
//         value={value}
//         text={`${value}`}
//         maxValue={maxValue}
//         circleRatio={0.75}
//         styles={buildStyles({
//           rotation: 0.625,
//           strokeLinecap: "round",
//           textSize: '25px',
//           pathColor: '#1fe01f',
//           trailColor: '#141414',
//         })}
//       />
//     </div>
//     <p>*{maxValue}</p>
//   </div>
// );

// const ScoreGridTile = ({ editMode, label, value, onChange, maxValue, inputType = "number" }) => (
//   <div className='report-grid-tile'>
//     {editMode ? (
//       <EditableField label={label} type={inputType} value={value} onChange={onChange} />
//     ) : (
//       <ProgressCircle label={label} value={value} maxValue={maxValue} />
//     )}
//   </div>
// );

// const ExpertDetails = () => {
//   const { expertId } = useParams();
//   const [expert, setExpert] = useState(null);
//   const [name, setName] = useState('');
//   const [flow, setFlow] = useState('');
//   const [probability, setProbability] = useState('');
//   const [timeSpent, setTimeSpent] = useState('');
//   const [timeSplit, setTimeSplit] = useState('');
//   const [tonality, setTonality] = useState('');
//   const [userSentiment, setUserSentiment] = useState('');
//   const [openingGreeting, setOpeningGreeting] = useState('');
//   const [closingGreeting, setClosingGreeting] = useState('');
//   const [score, setScore] = useState('');
//   const [repeatScore, setRepeatScore] = useState('');
//   const [callsShare, setCallsShare] = useState('');
//   const [editMode, setEditMode] = useState(false);

//   useEffect(() => {
//     Faxios.get(`/expert/experts/${expertId}`)
//       .then(response => {
//         const data = response.data;
//         setExpert(data);
//         setName(data.name);
//         setCallsShare(data.calls_share);
//         setScore(data.score);
//         setRepeatScore(data.repeat_score);
//         setFlow(data.flow);
//         setProbability(data.probability);
//         setTimeSpent(data.timeSpent);
//         setTimeSplit(data.timeSplit);
//         setTonality(data.tonality);
//         setUserSentiment(data.userSentiment);
//         setOpeningGreeting(data.openingGreeting);
//         setClosingGreeting(data.closingGreeting);
//       })
//       .catch(error => {
//         console.error('Error fetching expert details:', error);
//       });
//   }, [expertId]);

//   const handleUpdate = () => {
//     Faxios.put(`/expert/experts/${expertId}`, {
//       name,
//       score,
//       flow,
//       probability,
//       timeSpent,
//       timeSplit,
//       tonality,
//       userSentiment,
//       openingGreeting,
//       closingGreeting,
//       calls_share: callsShare,
//       repeat_score: repeatScore
//     })
//       .then(response => {
//         setExpert(response.data);
//         setEditMode(false);
//         window.alert('Expert details updated successfully!');
//       })
//       .catch(error => {
//         console.error('Error updating expert details:', error);
//       });
//   };

//   return (
//     <div className='details-container'>
//       {expert && (
//         <div className='report-content-container'>
//           <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '20px' }}>
//             <h1>Detailed Scores</h1>
//             <button className='back-button' onClick={() => window.history.back()}>
//               <FaArrowLeft className="back-icon" />
//             </button>
//           </div>
//           <div className="report-grid-container">
//             <div className="report-grid-item">
//               <div className='report-grid-tile'>
//                 {editMode ? (
//                   <EditableField label="Name" value={name} onChange={setName} />
//                 ) : (
//                   <h1>{name}</h1>
//                 )}
//               </div>
//               <div className='report-grid'>
//                 <ScoreGridTile editMode={editMode} label="Conversation Score" value={score} onChange={setScore} maxValue={5} />
//                 <ScoreGridTile editMode={editMode} label="Repeat Rate" value={repeatScore} onChange={setRepeatScore} maxValue={100} />
//                 <ScoreGridTile editMode={editMode} label="Share of Calls" value={callsShare} onChange={setCallsShare} maxValue={7.69} />
//               </div>
//               <div className='divider'></div>
//             </div>
//           </div>

//           <div className="report-grid-container">
//             <div className="report-grid-item">
//               <h2>scoreBreakup</h2>
//               <div className='report-grid-2'>
//                 <ScoreGridTile editMode={editMode} label="Opening Greeting" value={openingGreeting} onChange={setOpeningGreeting} maxValue={5} />
//                 <ScoreGridTile editMode={editMode} label="Flow Score" value={flow} onChange={setFlow} maxValue={10} />
//                 <ScoreGridTile editMode={editMode} label="Tonality Score" value={tonality} onChange={setTonality} maxValue={10} />
//                 <ScoreGridTile editMode={editMode} label="Time Split Score" value={timeSplit} onChange={setTimeSplit} maxValue={15} />
//                 <ScoreGridTile editMode={editMode} label="User Sentiment Score" value={userSentiment} onChange={setUserSentiment} maxValue={20} />
//                 <ScoreGridTile editMode={editMode} label="Time Spent Score" value={timeSpent} onChange={setTimeSpent} maxValue={15} />
//                 <ScoreGridTile editMode={editMode} label="userCallback Probability" value={probability} onChange={setProbability} maxValue={20} />
//                 <ScoreGridTile editMode={editMode} label="Closing Greeting" value={closingGreeting} onChange={setClosingGreeting} maxValue={5} />
//               </div>
//               <div className='divider'></div>
//             </div>
//           </div>
//           <div className='edit-button-container'>
//             {editMode ? (
//               <>
//                 <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
//                 <button className='update-button' onClick={handleUpdate}>Update Details</button>
//               </>
//             ) : (
//               <>
//                 <button className='update-button' onClick={() => setEditMode(true)}>Edit Details</button>
//               </>
//             )}
//             <Link
//               to={{
//                 pathname: `/admin/experts/${expertId}/report`
//               }}
//               style={{ textDecoration: 'none', color: 'inherit' }}
//             >
//             </Link>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ExpertDetails;
