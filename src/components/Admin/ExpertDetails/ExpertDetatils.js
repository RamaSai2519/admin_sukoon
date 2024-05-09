import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './ExpertDetails.css';
import NavMenu from '../../NavMenu/NavMenu';
import { FaArrowLeft } from 'react-icons/fa';


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
  const [allCategories, setAllCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    axios.get(`/api/experts/${expertId}`)
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
        fetchAllCategories();
      })
      .catch(error => {
        console.error('Error fetching expert details:', error);
      });

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expertId, setExpert, setName, setPhoneNumber, setTopics, setDescription, setCategories, setProfile, setStatus, setCallsShare, setLanguages, setScore, setRepeatScore, setTotalScore]);

  const fetchAllCategories = () => {
    axios.get('/api/categories')
      .then(response => {
        setAllCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleCategoryChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCategories(prevCategories => [...prevCategories, value]);
    } else if (!checked) {
      setCategories(prevCategories => prevCategories.filter(category => category !== value));
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(prevShowDropdown => !prevShowDropdown);
  };

  const handleUpdate = (newStatus) => {
    axios.put(`/api/experts/${expertId}`, {
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
        setEditMode(false);
        setStatus(newStatus);
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
              <div className='grid-tile-1'>
                <h3>Name</h3>
                {editMode ? (
                  <p><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
                ) : (
                  <h2>{name}</h2>
                )}
              </div>
              <div className='grid-tile-1'>
                <h3>Phone Number</h3>
                {editMode ? (
                  <p><input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
                ) : (
                  <h2>{phoneNumber}</h2>
                )}
              </div>
              <div className='grid'>
                <div className='grid-tile-1'>
                  <h3>Score</h3>
                  {editMode ? (
                    <p><input type="number" value={score} onChange={(e) => setScore(e.target.value)} /></p>
                  ) : (
                    <h2>{score}</h2>
                  )}
                </div>
                <div className='grid-tile-1'>
                  <h3>Repeat Score</h3>
                  {editMode ? (
                    <p><input type="number" value={repeatScore} onChange={(e) => setRepeatScore(e.target.value)} /></p>
                  ) : (
                    <h2>{repeatScore}</h2>
                  )}
                </div>
                <div className='grid-tile-1'>
                  <h3>Calls Share</h3>
                  {editMode ? (
                    <p><input type="number" value={callsShare} onChange={(e) => setRepeatScore(e.target.value)} /></p>
                  ) : (
                    <h2>{callsShare}%</h2>
                  )}
                </div>
                <div className='grid-tile-1'>
                  <h3>Total Score</h3>
                  {editMode ? (
                    <p><input type="number" value={totalScore} onChange={(e) => setTotalScore(e.target.value)} /></p>
                  ) : (
                    <h2>{totalScore}</h2>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='grid-container-2'>
            <div className='grid-tile-1'>
              <h3>Categories</h3>
              <div ref={dropdownRef}>
                <div>
                  {editMode ? (
                    <span onClick={toggleDropdown} className="dropdown-span">
                      {categories.length > 0 ? categories.join(', ') : 'Select Categories'}
                    </span>
                  ) : (
                    <h2>{categories.length > 0 ? categories.join(', ') : 'No categories'}</h2>
                  )}
                  {showDropdown && editMode && (
                    <div className='dropdown'>
                      {allCategories.map(category => (
                        <label className='dropdown-item' key={category}>
                          <input type="checkbox" value={category} checked={categories.includes(category)} onChange={handleCategoryChange} />
                          <span className="category-text">{category}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className='grid-tile-1'>
              <h3>Languages</h3>
              {editMode ? (
                <p><input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} /></p>
              ) : (
                <h2>{languages}</h2>
              )}
            </div>
            <div className='grid-tile-1'>
              <h3>Topics</h3>
              {editMode ? (
                <p><input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} /></p>
              ) : (
                <h2>{topics}</h2>
              )}
            </div>
            <div className='grid-tile-1'>
              <h3>Description</h3>
              {editMode ? (
                <p><input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /></p>
              ) : (
                <h2>{description}</h2>
              )}
            </div>
            <div className='grid-tile-1'>
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
                pathname: `/experts/${expertId}/report`
              }}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <button className='update-button'>View Detailed Scores</button>
            </Link>
          </div>
        </div>
      )}
      <NavMenu />
    </div>
  );
};

export default ExpertDetails;
