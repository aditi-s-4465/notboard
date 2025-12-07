import React, { useState } from "react";
import { Card, TextField, Button, Alert } from '@mui/material';
import './login.css';
import { login } from "../../loginapi/auth";
import { useNavigate } from "react-router-dom";
// import for every file 
import { useAppContext } from "../../context/useappcontext";


function Login() {
    const navigate = useNavigate();
    // everytime you need to use email;
    const {email, setEmail} = useAppContext();
    const [password, setPassword] = useState("");
    const [errormsg, setErrormsg] = useState("");
    const [err, setErr] = useState(false);
    const handleLogin = async () => {
        if (!email || !password) {
            setErr(true);
            setErrormsg("Please fill out username and password");
            console.log(email);
            return;
        }

        try {
            await login(email, password);
            setErr(false);
            setErrormsg("");
            navigate("/choosecollection")
        } catch (err: any) {
            setErr(true);
            setErrormsg("Enter correct email or password");
        }
    };


    return (
        <div className="loginbox">
            <Card variant="outlined" className="logininfo"> 
                <h1>Login to Not Board</h1>
                <TextField label="email" variant="outlined" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField label="Password" type="password" variant="outlined" required value={password} onChange={(e) => setPassword(e.target.value)} />
                {err && <Alert severity="error">{errormsg}</Alert>}
                <Button variant="contained" onClick={handleLogin}> Log In </Button>
                <Button variant="outlined" size="small" onClick={() => navigate("/create")}> Create Account </Button>
            </Card>
        </div>
    );
}

export default Login;
