import React, { useState } from "react";
import { Card, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import './createaccount.css';
import { createAccount } from "../../loginapi/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

function Createaccount() {
    const navigate = useNavigate();
    const { email, setEmail } = useAppContext();
    
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [loading, setLoading] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("error");

    const handleCreate = async () => {
        if (!email || !password || !passwordAgain) {
            setSnackbarMessage("Please fill out all fields.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        if (password !== passwordAgain) {
            setSnackbarMessage("Passwords do not match.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        if (password.length < 6) {
            setSnackbarMessage("Password should be at least 6 characters.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            await createAccount(email, password);
            setLoading(false);
            setSnackbarMessage("Account created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            
            setTimeout(() => navigate("/choosecollection"), 1000);
        } catch (err: any) {
            setLoading(false);
            setSnackbarMessage("Error: " + err.message);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <div className="login-page-root">
            <Card className="auth-card"> 
                <Typography variant="h4" className="auth-header">Create Account</Typography>
                <Typography variant="body1" className="auth-subheader">Start your board game journey today</Typography>

                <div className="auth-form">
                    <TextField 
                        label="Email Address" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                    />
                    <TextField 
                        label="Password" 
                        type="password" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="auth-input"
                    />
                    <TextField 
                        label="Confirm Password" 
                        type="password" 
                        variant="outlined" 
                        fullWidth 
                        required 
                        value={passwordAgain} 
                        onChange={(e) => setPasswordAgain(e.target.value)} 
                        className="auth-input"
                        error={password !== "" && passwordAgain !== "" && password !== passwordAgain}
                        helperText={password !== "" && passwordAgain !== "" && password !== passwordAgain ? "Passwords do not match" : ""}
                    />
                    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        onClick={handleCreate}
                        className="auth-button"
                        disabled={loading}
                    > 
                        {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                </div>

                <div className="auth-toggle-container">
                    <Typography variant="body2" className="auth-toggle-text">Already have an account?</Typography>
                    <Button 
                        variant="text" 
                        onClick={() => navigate("/")}
                        className="auth-toggle-btn"
                        disableRipple
                    >
                        Log In
                    </Button>
                </div>
            </Card>

            <Snackbar 
                open={snackbarOpen} 
                autoHideDuration={4000} 
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" className="auth-alert">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Createaccount;