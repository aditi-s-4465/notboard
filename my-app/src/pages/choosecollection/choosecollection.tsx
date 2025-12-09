import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Container, Card, CardActionArea, CardContent,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
  IconButton, Divider, Alert, CircularProgress, Box
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import "./choosecollection.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

type BackendCollection = {
  _id: string;
  name: string;
  code: string;
  members: string[];
};

const Choosecollection: React.FC = () => {
  const navigate = useNavigate();
  const { setCollection, setEmail, email } = useAppContext();

  const [collections, setCollections] = useState<BackendCollection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");
  const [dialogError, setDialogError] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/");
      return;
    }

    const fetchCollections = async () => {
      try {
        const res = await fetch(`https://notboard.onrender.com/api/collections?email=${email}`);
        if (!res.ok) throw new Error("Failed to load collections");
        const data = await res.json();
        setCollections(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Could not connect to server.");
        setLoading(false);
      }
    };

    fetchCollections();
  }, [email, navigate]);

  const handleSelectCollection = (col: BackendCollection) => {
    setCollection(col.name);
    navigate("/showcollection");
  };

  const handleLogout = () => {
    setEmail(""); 
    setCollection("");
    navigate("/"); 
  };

  const handleOpenDialog = () => {
    setDialogError("");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setJoinCode("");
    setNewName("");
    setNewCode("");
    setDialogError("");
  };

  const handleConfirmAction = async () => {
    const nameInput = newName.trim();
    const joinCodeInput = joinCode.trim();
    const createCodeInput = newCode.trim();
    if (joinCodeInput && !nameInput && !createCodeInput) {
    } 
    else if (nameInput && createCodeInput && !joinCodeInput) {
    } 
    else {
        setDialogError("Please fill out 'Code to Join' OR both 'Name' and 'New Code' to create.");
        return;
    }

    try {
      if (joinCodeInput) {
        const res = await fetch("https://notboard.onrender.com/api/collections/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: joinCodeInput, email })
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Invalid code");
        }
        const joinedCol = await res.json();
        setCollections(prev => [...prev, joinedCol]);
        setCollection(joinedCol.name);

      } else {
        const res = await fetch("https://notboard.onrender.com/api/collections", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                name: nameInput, 
                code: createCodeInput, 
                email 
            })
        });

        if (!res.ok) {
            throw new Error("Failed to create. Code might be taken.");
        }
        const newCol = await res.json();
        setCollections(prev => [...prev, newCol]);
        setCollection(newCol.name);
      }

      handleCloseDialog();
      navigate("/showcollection");

    } catch (err: any) {
      setDialogError(err.message || "Action failed");
    }
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={0} className="app-bar">
        <Toolbar>
          <Typography variant="h5" component="div" className="navbar-title">
            Not Board
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <div className="choose-page-wrapper">
        <Container maxWidth="lg" className="choose-collection-container">
          <div className="choose-header-section">
            <Typography variant="h3" className="choose-title">
              Your Collections
            </Typography>
            <Typography variant="h6" className="choose-description">
              Select a dashboard to manage your board games or start a new group.
            </Typography>
          </div>

          {error && <Alert severity="error" className="error-alert">{error}</Alert>}

          {loading ? <CircularProgress className="loading-spinner" /> : (
            <div className="collection-cards-grid">
              {collections.map((col) => (
                <Card key={col._id} className="collection-card">
                  <CardActionArea className="collection-card-action" onClick={() => handleSelectCollection(col)}>
                    <CardContent className="collection-card-content">
                      <div className="card-icon-placeholder">{col.name.charAt(0).toUpperCase()}</div>
                      <Typography variant="h5" className="collection-card-title">{col.name}</Typography>
                      <Box className="code-badge">
                        Code: {col.code}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              ))}

              <Card className="collection-card new-collection-card">
                <CardActionArea className="collection-card-action" onClick={handleOpenDialog}>
                  <CardContent className="collection-card-content">
                    <div className="collection-new-inner">
                      <div className="plus-icon-circle">
                        <AddIcon fontSize="large" />
                      </div>
                      <Typography variant="h6" className="collection-new-text">Create or Join</Typography>
                    </div>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          )}
        </Container>
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} PaperProps={{ className: "choose-dialog-paper" }}>
        <DialogTitle className="choose-dialog-title">
          <div className="choose-dialog-title-row">
            <IconButton size="small" onClick={handleCloseDialog} className="choose-dialog-close-button"><CloseIcon fontSize="small" /></IconButton>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>Add Collection</Typography>
          </div>
        </DialogTitle>

        <DialogContent className="choose-dialog-content">
          {dialogError && <Alert severity="error" className="error-alert">{dialogError}</Alert>}
          <div className="choose-dialog-fields">
            <TextField 
                label="Enter Code to Join" 
                placeholder="e.g. existing-code" 
                size="medium" 
                value={joinCode} 
                onChange={(e) => setJoinCode(e.target.value)} 
                fullWidth 
                disabled={newName.length > 0 || newCode.length > 0}
            />
            
            <Divider className="choose-dialog-divider">OR CREATE NEW</Divider>
            
            <TextField 
                label="New Collection Name" 
                size="medium" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                fullWidth 
                disabled={joinCode.length > 0}
            />
            <TextField 
                label="New Collection Code" 
                size="medium" 
                value={newCode} 
                onChange={(e) => setNewCode(e.target.value)} 
                fullWidth 
                disabled={joinCode.length > 0}
            />
          </div>
        </DialogContent>

        <DialogActions className="choose-dialog-actions">
          <Button variant="contained" fullWidth size="large" onClick={handleConfirmAction} style={{ fontWeight: 'bold' }}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Choosecollection;