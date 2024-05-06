// AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = ({ onLogin }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (email === 'admin@sukoon.love' && password === 'Care@sukoon123') {
            onLogin();
            navigate('/admin/dashboard');
        } else {
            setError('Invalid email or password');
        }
    }

    return (
        <div className='login-page'>
            <div className="admin-login-container">
                <h1>Admin Login</h1>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin();
                            }
                        }}
                    />
                </div>
                <button onClick={handleLogin}>Login</button>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default AdminLogin;
