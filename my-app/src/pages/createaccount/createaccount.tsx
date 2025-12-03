import React, { useState } from "react";
import { Card, TextField, Button } from '@mui/material';
import './createaccount.css';
import { createAccount } from "../../loginapi/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

function Createaccount() {
    const navigate = useNavigate();
    const {email, setEmail} = useAppContext();
    const [password, setPassword] = useState("");
    const [passwordagain, setPasswordagain] = useState("");
    const handleCreate = async () => {
        if (!email || !password || !passwordagain) {
            alert("Please fill out all fields.");
            return;
        }

        if (password !== passwordagain) {
            alert("Passwords do not match."); 
            return;
        }

        try {
            await createAccount(email, password); 
            navigate("addcollection")
        } catch (err: any) {
            alert("Error creating account: " + err.message); 
        }
    };

    return (
        <div className="loginbox">
            <Card variant="outlined" className="logininfo"> 
                <h1>Login to Not Board</h1>

                <TextField label="Username" variant="outlined" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                <TextField label="Password" type="password" variant="outlined" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <TextField label="Password again" type="passwordagain" variant="outlined" required value={passwordagain} onChange={(e) => setPasswordagain(e.target.value)} />
                <Button variant="contained" onClick={handleCreate}> Create Account </Button>
            </Card>
        </div>
    );
}

export default Createaccount;
