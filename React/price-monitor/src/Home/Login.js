import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [username, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    localStorage.setItem('isAuthenticated', 'false');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            username,
            password,
        }
        

        try {
            const response = await axios.post('http://localhost:8080/login', formData);
            if (response.status === 200) {
                localStorage.setItem('isAuthenticated', 'true');
                navigate('/user/index/0');
            }
        } catch (error) {
            console.log("Login Failed", error);
            alert("Login failed!");
        }
        
    };

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" id="username" value={username} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
