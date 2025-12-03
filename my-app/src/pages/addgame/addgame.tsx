import React, { useState } from "react";
import { Card, TextField, Button, Alert } from '@mui/material';
import './addgame.css';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

function Addgame() {
    const navigate = useNavigate();
    const {collection, setCollection} = useAppContext();

    return (
        <div>
            <h1>Add Game to Collection</h1>
            

        </div>
    );
}

export default Addgame;
