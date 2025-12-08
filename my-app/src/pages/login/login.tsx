import React, { useState } from "react";
import { Card, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import './login.css';
import { login } from "../../loginapi/auth";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

function Login() {
    const navigate = useNavigate();
    const { email, setEmail } = useAppContext();
    
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "warning" | "info">("error");

    const handleLogin = async () => {
        if (!email || !password) {
            setSnackbarMessage("Please enter both email and password.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            setLoading(false);
            navigate("/choosecollection");
        } catch (err: any) {
            setLoading(false);
            setSnackbarMessage("Invalid email or password. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    return (
        <div className="login-page-root">
            <Card className="auth-card"> 
                <Typography variant="h4" className="auth-header">Welcome Back</Typography>
                <Typography variant="body1" className="auth-subheader">Enter your details to access Not Board</Typography>

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
                    
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        onClick={handleLogin}
                        className="auth-button"
                        disabled={loading}
                    > 
                        {loading ? "Signing In..." : "Sign In"}
                    </Button>
                </div>

                <div className="auth-toggle-container">
                    <Typography variant="body2" className="auth-toggle-text">Don't have an account?</Typography>
                    <Button 
                        variant="text" 
                        onClick={() => navigate("/create")}
                        className="auth-toggle-btn"
                        disableRipple
                    >
                        Create account
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

export default Login;