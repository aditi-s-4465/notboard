import React, { useState } from "react";
import { Card, TextField, Button } from '@mui/material';
import './login.css';
import { login } from "../../loginapi/auth";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = async () => {
        if (!username || !password) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            await login(username, password);
            alert("Logged in!");
        } catch (err: any) {
            alert("Login failed: " + err.message);
        }
    };


    return (
        <div className="loginbox">
            <Card variant="outlined" className="logininfo"> 
                <h1>Login to Not Board</h1>
                <TextField label="email" variant="outlined" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                <TextField label="Password" type="password" variant="outlined" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button variant="contained" onClick={handleLogin}> Log In </Button>
                <Button variant="outlined" size="small" onClick={() => navigate("/create")}> Create Account </Button>
            </Card>
        </div>
    );
}

export default Login;
