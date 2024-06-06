import React, { useState, useEffect, useRef } from 'react';
import Raxios from '../services/axiosHelper';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useCategories } from '../services/useData';
import { Select, ConfigProvider, theme } from 'antd';
import './ExpertDetails.css';

const { Option } = Select;

const ExpertDetails = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [topics, setTopics] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [profile, setProfile] = useState('');
  const [status, setStatus] = useState('');
  const [languages, setLanguages] = useState([]);
  const [score, setScore] = useState('');
  const [repeatScore, setRepeatScore] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [callsShare, setCallsShare] = useState('');
  const [editMode, setEditMode] = useState(false);
  const { allCategories, fetchCategories } = useCategories();
  const dropdownRef = useRef(null);
  const darkMode = localStorage.getItem('darkMode') === 'true';

  useEffect(() => {
    fetchCategories();
    Raxios.get(`/expert/experts/${expertId}`)
      .then(response => {
        setExpert(response.data);
        setName(response.data.name);
        setPhoneNumber(response.data.phoneNumber);
        setTopics(response.data.topics);
        setDescription(response.data.description);
        setCategories(response.data.categories);
        setProfile(response.data.profile);
        setStatus(response.data.status);
        setCallsShare(response.data.calls_share);
        setLanguages(response.data.languages);
        setScore(response.data.score);
        setRepeatScore(response.data.repeat_score);
        setTotalScore(response.data.total_score);
      })
      .catch(error => {
        console.error('Error fetching expert details:', error);
      });
  }, [expertId]);

  const handleCategoryChange = (value) => {
    setCategories(value);
  };

  const handleUpdate = (newStatus) => {
    Raxios.put(`/expert/experts/${expertId}`, {
      name,
      phoneNumber,
      topics,
      description,
      categories,
      profile,
      status: newStatus,
      languages,
      score,
      calls_share: callsShare,
      repeat_score: repeatScore,
      total_score: totalScore
    })
      .then(response => {
        setExpert(response.data);
        setStatus(newStatus);
        window.alert('Expert details updated successfully!');
        setEditMode(false);
      })
      .catch(error => {
        window.alert('Error updating expert details:', error);
        console.error('Error updating expert details:', error);
      });
  };

  const handleDelete = () => {
    Raxios.delete(`/expert/experts/${expertId}`)
      .then(() => {
        window.alert('Expert deleted successfully!');
        window.location.href = '/admin/experts';
      })
      .catch(error => {
        console.error('Error deleting expert:', error);
        window.alert('Error deleting expert:', error);
      });
  };

  return (
    <ConfigProvider theme={
      {
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }
    }>
      <div className='details-container'>
        {expert && (
          <div className='content-container'>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', margin: '20px' }}>
              <h1>Expert Details</h1>
              <button className='back-button' onClick={() => window.history.back()}>
                <FaArrowLeft className="back-icon" />
              </button>
            </div>
            <div className="grid-container">
              <div className="grid-tile-2">
                <img src={profile} alt="Expert Profile" />
              </div>
              <div className="grid-item">
                <div className='grid-tile'>
                  <h3>Name</h3>
                  {editMode ? (
                    <p><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
                  ) : (
                    <h2>{name}</h2>
                  )}
                </div>
                <div className='grid-tile'>
                  <h3>Phone Number</h3>
                  {editMode ? (
                    <p><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
                  ) : (
                    <h2>{phoneNumber}</h2>
                  )}
                </div>
                <div className='grid grid-cols-4'>
                  <div className='grid-tile'>
                    <h3>Score</h3>
                    {editMode ? (
                      <p><input type="number" value={score} onChange={(e) => setScore(e.target.value)} /></p>
                    ) : (
                      <h2>{score}</h2>
                    )}
                  </div>
                  <div className='grid-tile'>
                    <h3>Repeat Score</h3>
                    {editMode ? (
                      <p><input type="number" value={repeatScore} onChange={(e) => setRepeatScore(e.target.value)} /></p>
                    ) : (
                      <h2>{repeatScore}</h2>
                    )}
                  </div>
                  <div className='grid-tile'>
                    <h3>Calls Share</h3>
                    {editMode ? (
                      <p><input type="number" value={callsShare} onChange={(e) => setCallsShare(e.target.value)} /></p>
                    ) : (
                      <h2>{callsShare}%</h2>
                    )}
                  </div>
                  <div className='grid-tile'>
                    <h3>Total Score</h3>
                    {editMode ? (
                      <p><input type="number" value={totalScore} onChange={(e) => setTotalScore(e.target.value)} /></p>
                    ) : (
                      <h2>{totalScore}</h2>
                    )}
                  </div>
                </div>
                <div className='grid-tile'>
                  <h3>Categories</h3>
                  <div ref={dropdownRef}>
                    <div>
                      {editMode ? (
                        <Select
                          mode="multiple"
                          style={{ width: '100%' }}
                          placeholder="Select Categories"
                          onChange={handleCategoryChange}
                          value={categories}
                        >
                          {allCategories.map(category => (
                            <Option key={category._id} value={category}>
                              {category.name}
                            </Option>
                          ))}
                        </Select>
                      ) : (
                        <h2>{categories.length > 0 ? categories.join(', ') : 'No categories'}</h2>
                      )}
                    </div>
                  </div>
                </div>
                <div className='grid-tile'>
                  <h3>Status</h3>
                  <div className="toggle-container">
                    <h2 className="status-label">{status === 'online' ? 'Online' : 'Offline'}</h2>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={status === 'online'}
                        onChange={() => handleUpdate(status === 'offline' ? 'online' : 'offline')}
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                <div className='grid-tile'>
                  <h3>Languages</h3>
                  {editMode ? (
                    <p><input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} /></p>
                  ) : (
                    <h2>{languages}</h2>
                  )}
                </div>
                <div className='grid-tile'>
                  <h3>Topics</h3>
                  {editMode ? (
                    <p><input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} /></p>
                  ) : (
                    <h2>{topics}</h2>
                  )}
                </div>
                <div className='grid-tile'>
                  <h3>Description</h3>
                  {editMode ? (
                    <p><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /></p>
                  ) : (
                    <h2>{description}</h2>
                  )}
                </div>
                <div className='edit-button-container'>
                  {editMode ? (
                    <>
                      <button className='update-button' onClick={() => setEditMode(false)}>Cancel</button>
                      <button className='update-button' onClick={() => handleUpdate(status)}>Update Details</button>
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
                    <button className='update-button'>View Detailed Scores</button>
                  </Link>
                  <button className='update-button' style={{ backgroundColor: 'red' }} onClick={handleDelete}>Delete Expert</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );

};

export default ExpertDetails;
