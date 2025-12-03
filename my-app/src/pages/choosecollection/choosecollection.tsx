import React, { useState } from "react";
import { Card, TextField, Button, Alert } from '@mui/material';
import './choosecollection.css';
import { useNavigate } from "react-router-dom";


function Choosecollection() {
    const navigate = useNavigate();
    return (
        <div>
            <Button variant="contained" onClick={() => navigate("/showcollection")}>TEMP BUTTON TO NAVIGATE TO SHOW COLLECTION </Button>
        </div>
    );
}

export default Choosecollection;
