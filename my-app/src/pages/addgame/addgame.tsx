import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, MenuItem, AppBar, Toolbar, Typography, Stack, Box,
  InputAdornment, FormControl, InputLabel, Select, Chip, CircularProgress, Alert, Snackbar
} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LogoutIcon from "@mui/icons-material/Logout"; 
import SearchIcon from "@mui/icons-material/Search";
import './addgame.css';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";
import GameDetailsModal from "../gamedetails/gamedetails";

interface BackendGame {
    _id: string;
    Name: string;
    MinPlayers: number;
    MaxPlayers: number;
    [key: string]: any; 
}

interface FrontendGame {
    id: string;
    name: string;
    minplayer: number;
    maxplayer: number;
    genre: string[];
}

function Addgame() {
    const navigate = useNavigate();
    const { setSelectedGameName, setEmail, setCollection, collection, email } = useAppContext();

    const [games, setGames] = useState<FrontendGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    
    const [search, setSearch] = useState("");
    const [genreFilter, setGenreFilter] = useState("All");
    const [minPlayers, setMinPlayers] = useState<number | "">("");
    const [maxPlayers, setMaxPlayers] = useState<number | "">("");
    
    const [showDetails, setShowDetails] = useState(false);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    useEffect(() => {
        const loadData = async () => {
            try {
                const gamesRes = await fetch("http://localhost:5000/api/games");
                if (!gamesRes.ok) throw new Error("Failed to connect to server");
                const gamesData: BackendGame[] = await gamesRes.json();

                const colRes = await fetch(`http://localhost:5000/api/collections?email=${email}`);
                const colData = await colRes.json();
                const targetCol = colData.find((c: any) => c.name === collection);
                
                const existingGameIds = new Set();
                if (targetCol && targetCol.games) {
                    targetCol.games.forEach((g: any) => {
                        existingGameIds.add(g.game); 
                    });
                }

                const formattedGames: FrontendGame[] = gamesData
                    .filter(g => !existingGameIds.has(g._id))
                    .map((g) => {
                        const genres: string[] = [];
                        Object.keys(g).forEach((key) => {
                            if (key.startsWith("Cat:") && g[key] === 1) {
                                genres.push(key.replace("Cat:", "")); 
                            }
                        });

                        if (genres.length === 0) {
                            genres.push("General");
                        }

                        return {
                            id: g._id,
                            name: g.Name,
                            minplayer: g.MinPlayers,
                            maxplayer: g.MaxPlayers,
                            genre: genres
                        };
                    });

                setGames(formattedGames);
                setLoading(false);
            } catch (err: any) {
                console.error("Error loading data:", err);
                setError("Could not load games. Is the backend running?");
                setLoading(false);
            }
        };

        loadData();
    }, [collection, email]);

    const handleOpenDetails = (gameId: string) => {
        setSelectedGameName(gameId); 
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedGameName("");
    };

    const openAddDialog = (gameId: string) => {
        setSelectedGameId(gameId);
        setOpen(true);
    };

    const handleConfirmAdd = async () => {
        if (!selectedGameId || !collection) return;

        try {
            const colRes = await fetch(`http://localhost:5000/api/collections?email=${email}`);
            const allCollections = await colRes.json();
            const targetCol = allCollections.find((c: any) => c.name === collection);

            if (!targetCol) {
                setSnackbarMessage("Error: Collection not found.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }

            const response = await fetch(`http://localhost:5000/api/collections/${targetCol._id}/games`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gameId: selectedGameId,
                    ownedBy: emailInput 
                })
            });

            if (response.ok) {
                setSnackbarMessage("Game added to collection successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                
                setGames(prev => prev.filter(g => g.id !== selectedGameId));
                setEmailInput("");
                setSelectedGameId(null);
                setOpen(false);
            } else {
                const errData = await response.json();
                setSnackbarMessage(`Error: ${errData.error}`);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }

        } catch (error) {
            console.error("Failed to add game:", error);
            setSnackbarMessage("Failed to connect to server.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleLogout = () => {
        setEmail("");
        setCollection("");
        navigate("/");
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const filteredGames = games.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = genreFilter === "All" || game.genre.includes(genreFilter);
        const matchesMin = minPlayers === "" || game.minplayer >= minPlayers;
        const matchesMax = maxPlayers === "" || game.maxplayer <= maxPlayers;
        return matchesSearch && matchesGenre && matchesMin && matchesMax;
    });
    
    return (
        <>
            <AppBar position="static" color="default" elevation={0} className="app-bar">
                <Toolbar>
                    <Typography variant="h5" className="navbar-title">
                        Not Board
                    </Typography>
                    <Button color="inherit" onClick={() => navigate("/choosecollection")} className="navbar-back-btn">Collections Menu</Button>
                    <Button color="inherit" onClick={() => navigate("/showcollection")} className="navbar-back-btn">
                        Back to Collection
                    </Button>
                    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                        Log Out
                    </Button>
                </Toolbar>
            </AppBar>

            <div className="addgame-container">
                <Typography variant="h4" component="h1" gutterBottom className="addgame-header">
                    Add Game to Collection
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper elevation={0} className="filter-bar-container">
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <Box className="filter-box-search">
                            <TextField 
                                fullWidth size="small" placeholder="Search games..." 
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="filter-input-bg"
                                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>) }}
                            />
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
                        <Box className="filter-box-number">
                            <TextField label="Min Players" type="number" size="small" fullWidth value={minPlayers} onChange={(e) => setMinPlayers(e.target.value === "" ? "" : Number(e.target.value))} className="filter-input-bg" />
                        </Box>
                        <Box className="filter-box-number">
                            <TextField label="Max Players" type="number" size="small" fullWidth value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value === "" ? "" : Number(e.target.value))} className="filter-input-bg" />
                        </Box>
                    </Stack>
                </Paper>

                <TableContainer component={Paper} className="addgame-table">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className="table-header-cell">Game</TableCell>
                                <TableCell className="table-header-cell">Min Players</TableCell>
                                <TableCell className="table-header-cell">Max Players</TableCell>
                                <TableCell className="table-header-cell">Genre</TableCell>
                                <TableCell> </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredGames.map((row) => (
                                <TableRow key={row.id} className="addgame-row">
                                    <TableCell component="th" scope="row">
                                        <Button onClick={() => handleOpenDetails(row.id)} className="game-name-link">
                                            {row.name}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{row.minplayer}</TableCell>
                                    <TableCell>{row.maxplayer}</TableCell>
                                    <TableCell>
                                        {row.genre.slice(0, 3).map(g => (
                                            <Chip key={g} label={g} size="small" className="genre-chip" style={{marginRight: 4}} />
                                        ))}
                                    </TableCell>
                                    <TableCell> 
                                        <IconButton aria-label="add" size="large" onClick={() => openAddDialog(row.id)}>
                                            <AddCircleRoundedIcon fontSize="large" color="secondary"/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <GameDetailsModal open={showDetails} onClose={handleCloseDetails} />
            
            <Dialog open={open} onClose={() => setOpen(false)} className="blur-dialog">
                <DialogTitle>Enter Game Owner</DialogTitle>
                <DialogContent>
                    <TextField 
                        label="Owned By (Email/Name)" fullWidth 
                        value={emailInput} onChange={(e) => setEmailInput(e.target.value)} 
                        className="dialog-input"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirmAdd} disabled={emailInput.trim() === ""}>
                        Add to Collection
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} className="snackbar-alert" variant="filled">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Addgame;