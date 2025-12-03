import React, { useState } from "react";
import { Card, TextField, Button, Alert } from '@mui/material';
import './showcollection.css';
import { useNavigate } from "react-router-dom";


function Showcollection() {
    const navigate = useNavigate();
    return (
        <div>
            <Button variant="contained"> Create Account </Button>
        </div>
    );
}

export default Showcollection;
