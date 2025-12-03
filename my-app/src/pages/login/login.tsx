import React, { useState } from "react";
import { Card, TextField, Button, Alert } from '@mui/material';
import './login.css';
import { login } from "../../loginapi/auth";
import { useNavigate } from "react-router-dom";


function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");
    const [err, setErr] = useState(false);
    const handleLogin = async () => {
        if (!username || !password) {
            setErr(true);
            setErrormsg("Please fill out username and password");
            return;
        }

        try {
            await login(username, password);
            setErr(false);
            setErrormsg("");
            navigate("choosecollection")
        } catch (err: any) {
            setErr(true);
            setErrormsg("Enter correct email or password");
        }
    };


    return (
        <div className="loginbox">
            <Card variant="outlined" className="logininfo"> 
                <h1>Login to Not Board</h1>
                <TextField label="email" variant="outlined" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                <TextField label="Password" type="password" variant="outlined" required value={password} onChange={(e) => setPassword(e.target.value)} />
                {err && <Alert severity="error">{errormsg}</Alert>}
                <Button variant="contained" onClick={handleLogin}> Log In </Button>
                <Button variant="outlined" size="small" onClick={() => navigate("/create")}> Create Account </Button>
            </Card>
        </div>
    );
}

export default Login;
