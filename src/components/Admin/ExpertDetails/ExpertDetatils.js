import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ExpertDetails = () => {
  const { expertId } = useParams();
  const [expert, setExpert] = useState(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [topics, setTopics] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState('');
  const [profile, setProfile] = useState('');
  const [languages, setLanguages] = useState([]);
  const [score, setScore] = useState('');
  const [repeatScore, setRepeatScore] = useState('');
  const [totalScore, setTotalScore] = useState('');

  useEffect(() => {
    // Fetch expert details
    axios.get(`/api/experts/${expertId}`)
      .then(response => {
        setExpert(response.data);
        setName(response.data.name);
        setPhoneNumber(response.data.phoneNumber);
        setTopics(response.data.topics);
        setDescription(response.data.description);
        setCategories(response.data.categories.join(', '));
        setProfile(response.data.profile);
        setLanguages(response.data.languages.join(', '));
        setScore(response.data.score);
        setRepeatScore(response.data.repeat_score);
        setTotalScore(response.data.total_score);
      })
      .catch(error => {
        console.error('Error fetching expert details:', error);
      });
  }, [expertId]);

  const handleUpdate = () => {
    axios.put(`/api/experts/${expertId}`, {
      name,
      phoneNumber,
      topics,
      description,
      categories: categories.split(', ').map(cat => cat.trim()),
      profile,
      languages: languages.split(',').map(lang => lang.trim()),
      score,
      repeat_score: repeatScore,
      total_score: totalScore
    })
      .then(response => {
        setExpert(response.data);
        console.log('Expert details updated successfully.');
      })
      .catch(error => {
        console.error('Error updating expert details:', error);
      });
  };

  return (
    <div>
      {expert && (
        <div>
          <h2>Expert Details</h2>
          <p>Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)} /></p>
          <p>Phone Number: <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} /></p>
          <p>Topics: <input type="text" value={topics} onChange={(e) => setTopics(e.target.value)} /></p>
          <p>Description: <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /></p>
          <p>Categories: <input type="text" value={categories} onChange={(e) => setCategories(e.target.value)} /></p>
          <p>Languages: <input type="text" value={languages} onChange={(e) => setLanguages(e.target.value)} /></p>
          <p>Score: <input type="number" value={score} onChange={(e) => setScore(e.target.value)} /></p>
          <p>Repeat Score: <input type="number" value={repeatScore} onChange={(e) => setRepeatScore(e.target.value)} /></p>
          <p>Total Score: <input type="number" value={totalScore} onChange={(e) => setTotalScore(e.target.value)} /></p>
          <button onClick={handleUpdate}>Update Details</button>
        </div>
      )}
    </div>
  );
};

export default ExpertDetails;