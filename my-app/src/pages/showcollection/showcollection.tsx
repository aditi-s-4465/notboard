import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Container, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow,
  TextField, IconButton, Card, CardContent, Alert, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, FormControl, InputLabel, Select, Chip, Stack, Box, CircularProgress, Snackbar, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import "./showcollection.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";
import GameDetailsModal from "../gamedetails/gamedetails";

interface FrontendGame {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  genre: string;
  ownedBy: string;
  averageRating: number;
}

interface RecommendedGame {
  id: string;
  name: string;
  image: string;
  rating: string;
  genre: string;
}

const Showcollection: React.FC = () => {
  const navigate = useNavigate();
  const { collection, setSelectedGameName, setEmail, setCollection, email } = useAppContext();
  
  const [currentGames, setCurrentGames] = useState<FrontendGame[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendedGame[]>([]);
  
  const [collectionId, setCollectionId] = useState<string | null>(null);
  const [collectionCode, setCollectionCode] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [minPlayers, setMinPlayers] = useState<number | "">("");
  const [maxPlayers, setMaxPlayers] = useState<number | "">("");

  // modal &dialog states
  const [showDetails, setShowDetails] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [gameToAdd, setGameToAdd] = useState<string | null>(null);
  const [ownerInput, setOwnerInput] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // fetch
  useEffect(() => {
    if (!collection) return;

    const loadData = async () => {
        try {
            if (refreshTrigger === 0) setLoading(true);
            
            const colListRes = await fetch(`http://localhost:5000/api/collections?email=${email}`);
            const colList = await colListRes.json();
            const targetCol = colList.find((c: any) => c.name === collection);

            if (!targetCol) {
                setLoading(false);
                return;
            }

            setCollectionId(targetCol._id);
            setCollectionCode(targetCol.code);
            setMembers(targetCol.members);

            const detailRes = await fetch(`http://localhost:5000/api/collections/${targetCol._id}`);
            const detailData = await detailRes.json();
            
            const mappedGames: FrontendGame[] = detailData.games.map((item: any) => {
                const g = item.game;
                let primaryGenre = "General";
                Object.keys(g).forEach(k => { 
                    if(k.startsWith("Cat:") && g[k]===1) primaryGenre = k.replace("Cat:", ""); 
                });

                return {
                    id: g._id,
                    name: g.Name,
                    minPlayers: g.MinPlayers,
                    maxPlayers: g.MaxPlayers,
                    genre: primaryGenre,
                    ownedBy: item.ownedBy || "Unknown",
                    averageRating: Number(g.AvgRating).toFixed(1)
                };
            });
            setCurrentGames(mappedGames);

            const allGamesRes = await fetch(`http://localhost:5000/api/games`);
            const allGames = await allGamesRes.json();
            
            const ownedIds = new Set(mappedGames.map(mg => mg.id));
            
            const recs = allGames
                .filter((g: any) => !ownedIds.has(g._id))
                .sort((a: any, b: any) => b.AvgRating - a.AvgRating)
                .slice(0, 3)
                .map((g: any) => {
                    let genre = "General";
                    Object.keys(g).forEach(k => { if(k.startsWith("Cat:") && g[k]===1) genre = k.replace("Cat:", ""); });
                    
                    return { 
                        id: g._id, 
                        name: g.Name,
                        image: g.ImagePath,
                        rating: Number(g.AvgRating).toFixed(1),
                        genre: genre
                    };
                });

            setRecommendations(recs);
            setLoading(false);

        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    loadData();
  }, [collection, email, refreshTrigger]);


  const handleOpenDetails = (gameId: string) => {
    setSelectedGameName(gameId); 
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedGameName("");
  };

  const handleAddRecClick = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation(); 
    setGameToAdd(gameId);
    setAddDialogOpen(true);
  };

  const confirmAddGame = async () => {
    if (!gameToAdd || !collectionId) return;

    try {
        const response = await fetch(`http://localhost:5000/api/collections/${collectionId}/games`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gameId: gameToAdd,
                ownedBy: ownerInput
            })
        });

        if (response.ok) {
            setSnackbarMessage("Game added to collection successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setRefreshTrigger(prev => prev + 1);
        } else {
            const err = await response.json();
            setSnackbarMessage("Error: " + err.error);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    } catch (e) {
        console.error(e);
        setSnackbarMessage("Failed to connect to server");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
    setAddDialogOpen(false);
    setOwnerInput("");
    setGameToAdd(null);
  };

  const handleDeleteClick = (id: string) => {
    setGameToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (gameToDelete && collectionId) {
        try {
            await fetch(`http://localhost:5000/api/collections/${collectionId}/games/${gameToDelete}`, {
                method: 'DELETE'
            });
            setSnackbarMessage("Game removed from collection.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setRefreshTrigger(prev => prev + 1);
        } catch (e) {
            setSnackbarMessage("Failed to delete game.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    }
    setDeleteDialogOpen(false);
    setGameToDelete(null);
  };

  const handleLogout = () => {
    setEmail("");
    setCollection("");
    navigate("/");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (!collection) {
    return (
      <Container maxWidth="md" className="show-collection-root">
        <Alert severity="info" className="empty-alert">Please go back and choose a collection first.</Alert>
        <Button variant="outlined" onClick={() => navigate("/choosecollection")} className="empty-back-btn">Back</Button>
      </Container>
    );
  }

  const hasGames = currentGames.length > 0;

  const filteredGames = currentGames.filter((game) => {
    const matchesSearch =
      game.name.toLowerCase().includes(search.toLowerCase()) ||
      game.ownedBy.toLowerCase().includes(search.toLowerCase());
    
    const matchesGenre = genreFilter === "All" || game.genre.includes(genreFilter);
    const matchesMin = minPlayers === "" || game.minPlayers >= minPlayers;
    const matchesMax = maxPlayers === "" || game.maxPlayers <= maxPlayers;

    return matchesSearch && matchesGenre && matchesMin && matchesMax;
  });

  return (
    <>
      <AppBar position="static" color="default" elevation={0} className="app-bar">
        <Toolbar>
          <Typography variant="h5" className="navbar-title">Not Board</Typography>
          <Button color="inherit" onClick={() => navigate("/choosecollection")} className="navbar-back-btn">Collections Menu</Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>Log Out</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" className="show-collection-root">
        <div className="show-layout">
          <aside className="show-sidebar">
            <Typography className="show-sidebar-title">{collection}</Typography>
            <Typography variant="caption" display="block" color="text.secondary" className="show-sidebar-code-label">Code: <strong>{collectionCode}</strong></Typography>
            <Divider className="sidebar-divider" />
            <Typography variant="subtitle2" className="sidebar-members-title">Members</Typography>
            {members.map((m) => (
              <div key={m} className="show-sidebar-code">{m}</div>
            ))}
          </aside>

          <main className="show-main">
            {loading ? <CircularProgress className="loading-spinner" /> : !hasGames ? (
              <div className="show-empty">
                <Typography variant="h4" className="empty-title">No Games Yet!</Typography>
                <Typography variant="body1" color="text.secondary" className="empty-subtitle">Start building your collection by adding your first board game.</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/addgame")} size="large" className="add-game-button">
                  Add Your First Game
                </Button>
              </div>
            ) : (
              <>
                <div className="show-main-top">
                  
                  <Paper elevation={0} className="filter-bar-container">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" className="stack-full-width">
                      <Box className="filter-box-search">
                        <TextField fullWidth size="small" placeholder="Search collection..." value={search} onChange={(e) => setSearch(e.target.value)} className="filter-input-bg" InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>)}}/>
                      </Box>
                      <Box className="filter-box-genre">
                        <FormControl fullWidth size="small" className="filter-input-bg">
                          <InputLabel>Genre</InputLabel>
                          <Select value={genreFilter} label="Genre" onChange={(e) => setGenreFilter(e.target.value)}>
                            <MenuItem value="All">All Genres</MenuItem>
                            <MenuItem value="General">General</MenuItem>
                            <MenuItem value="Strategy">Strategy</MenuItem>
                            <MenuItem value="Family">Family</MenuItem>
                            <MenuItem value="Party">Party</MenuItem>
                            <MenuItem value="Thematic">Thematic</MenuItem>
                            <MenuItem value="Abstract">Abstract</MenuItem>
                            <MenuItem value="War">War</MenuItem>
                            <MenuItem value="Childrens">Childrens</MenuItem>
                            <MenuItem value="CGS">CGS</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box className="filter-box-number"><TextField label="Min" type="number" size="small" fullWidth value={minPlayers} onChange={(e) => setMinPlayers(e.target.value === "" ? "" : Number(e.target.value))} className="filter-input-bg"/></Box>
                      <Box className="filter-box-number"><TextField label="Max" type="number" size="small" fullWidth value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value === "" ? "" : Number(e.target.value))} className="filter-input-bg"/></Box>
                      <Box className="filter-box-button">
                        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate("/addgame")} className="add-game-button">Add Game</Button>
                      </Box>
                    </Stack>
                  </Paper>

                  <div className="show-table-wrapper">
                    <Paper className="show-table-paper" elevation={0}>
                      <Table size="medium">
                        <TableHead>
                          <TableRow>
                            <TableCell className="styled-table-header-cell">Name</TableCell>
                            <TableCell className="styled-table-header-cell">Players</TableCell>
                            <TableCell className="styled-table-header-cell">Genre</TableCell>
                            <TableCell className="styled-table-header-cell">Owned By</TableCell>
                            <TableCell className="styled-table-header-cell">Rating</TableCell>
                            <TableCell className="styled-table-header-cell" width={50}></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredGames.map((game) => (
                            <TableRow key={game.id} hover>
                              <TableCell className="game-name-cell">
                                <Button onClick={() => handleOpenDetails(game.id)} className="game-name-link" disableRipple>{game.name}</Button>
                              </TableCell>
                              <TableCell>{game.minPlayers}-{game.maxPlayers}</TableCell>
                              <TableCell><Chip label={game.genre} size="small" className="genre-chip" /></TableCell>
                              <TableCell>{game.ownedBy}</TableCell>
                              <TableCell>{game.averageRating}</TableCell>
                              <TableCell>
                                <IconButton size="small" className="delete-icon-btn" onClick={() => handleDeleteClick(game.id)}><DeleteIcon fontSize="small" /></IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </div>
                </div>

                <div className="show-main-bottom">
                  <Typography className="show-reco-title">Recommended For You</Typography>
                  <div className="show-reco-grid">
                    {recommendations.map((rec) => (
                      <div key={rec.id} className="reco-card" onClick={() => handleOpenDetails(rec.id)}>
                        <div className="reco-img-container">
                            {rec.image ? (
                                <img src={rec.image} alt={rec.name} className="reco-img" />
                            ) : (
                                <span className="reco-placeholder">No Image</span>
                            )}
                        </div>
                        <CardContent className="reco-content">
                          <Typography className="reco-title">{rec.name}</Typography>
                          <div className="reco-stats-row">
                              <span className="reco-rating">★ {rec.rating}</span>
                              <IconButton className="reco-add-btn" onClick={(e) => handleAddRecClick(e, rec.id)}>
                                <AddCircleRoundedIcon fontSize="small" />
                              </IconButton>
                          </div>
                        </CardContent>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </Container>
      
      <GameDetailsModal open={showDetails} onClose={handleCloseDetails} />

      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Enter Game Owner</DialogTitle>
        <DialogContent>
            <TextField 
                label="Owned By (Email/Name)" fullWidth 
                value={ownerInput} 
                onChange={(e) => setOwnerInput(e.target.value)} 
                className="dialog-input"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={confirmAddGame} disabled={ownerInput.trim() === ""}>
                Add to Collection
            </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Game?</DialogTitle>
        <DialogContent>Are you sure you want to remove this game from the collection?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Remove</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} className="snackbar-alert" variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Showcollection;