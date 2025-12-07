import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  AppBar, 
  Toolbar, 
  Typography,
  Stack,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import LogoutIcon from "@mui/icons-material/Logout"; 
import SearchIcon from "@mui/icons-material/Search";
import './addgame.css';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";
import GameDetailsModal from "../gamedetails/gamedetails";

function createData(name: string, minplayer: number, maxplayer: number, genre: Array<string>) {
    return { name, minplayer, maxplayer, genre };
}

function Addgame() {
    const navigate = useNavigate();
    const { setSelectedGameName, setEmail, setCollection } = useAppContext();

    const [games, setGames] = useState([
        createData('Pollen', 2, 4, ['Strategy', 'Cozy']),
        createData('Connect 4', 2, 2, ['Strategy']),
        createData('Battleship', 2, 2, ['War', 'Strategy']),
        createData('Candy Land', 2, 4, ['Children']),
      ]);

    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [genreFilter, setGenreFilter] = useState("All");
    const [minPlayers, setMinPlayers] = useState<number | "">("");
    const [maxPlayers, setMaxPlayers] = useState<number | "">("");
    const [showDetails, setShowDetails] = useState(false);

    const handleOpenDetails = (gameName: string) => {
        setSelectedGameName(gameName);
        setShowDetails(true);
    };

    const handleCloseDetails = () => {
        setShowDetails(false);
        setSelectedGameName("");
    };

    const addGame = (gameName: string) => {
        setSelectedGame(gameName);
        setOpen(true);
    };

    const handleConfirm = () => {
        console.log("Email entered:", emailInput);
        setGames(prev => prev.filter(game => game.name !== selectedGame));
        setEmailInput("");
        setSelectedGame(null);
        setOpen(false);
    };

    const handleLogout = () => {
        setEmail("");
        setCollection("");
        navigate("/");
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
            {/*nav*/}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" className="navbar-title">
                        Not Board
                    </Typography>
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
                
                {/*filter */}
                <Paper elevation={0} className="filter-bar-container">
                    <Stack 
                        direction={{ xs: 'column', md: 'row' }} 
                        spacing={2} 
                        alignItems="center"
                    >
                        {/* search bar */}
                        <Box className="filter-box-search">
                            <TextField 
                                fullWidth 
                                size="small" 
                                placeholder="Search games..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="filter-input-bg"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>

                        {/* fenre filter */}
                        <Box className="filter-box-genre">
                            <FormControl fullWidth size="small" className="filter-input-bg">
                                <InputLabel>Genre</InputLabel>
                                <Select
                                    value={genreFilter}
                                    label="Genre"
                                    onChange={(e) => setGenreFilter(e.target.value)}
                                >
                                    <MenuItem value="All">All Genres</MenuItem>
                                    <MenuItem value="Strategy">Strategy</MenuItem>
                                    <MenuItem value="Cozy">Cozy</MenuItem>
                                    <MenuItem value="War">War</MenuItem>
                                    <MenuItem value="Children">Children</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {}
                        <Box className="filter-box-number">
                            <TextField
                                label="Min Players"
                                type="number"
                                size="small"
                                fullWidth
                                value={minPlayers}
                                onChange={(e) => setMinPlayers(e.target.value === "" ? "" : Number(e.target.value))}
                                className="filter-input-bg"
                            />
                        </Box>

                        {}
                        <Box className="filter-box-number">
                            <TextField
                                label="Max Players"
                                type="number"
                                size="small"
                                fullWidth
                                value={maxPlayers}
                                onChange={(e) => setMaxPlayers(e.target.value === "" ? "" : Number(e.target.value))}
                                className="filter-input-bg"
                            />
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
                            {filteredGames.map((row) => (
                                <TableRow key={row.name} className="addgame-row">
                                    <TableCell component="th" scope="row">
                                        <Button 
                                            onClick={() => handleOpenDetails(row.name)}
                                            className="game-name-link"
                                        >
                                            {row.name}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{row.minplayer}</TableCell>
                                    <TableCell>{row.maxplayer}</TableCell>
                                    <TableCell>{row.genre.join(", ")}</TableCell>
                                    <TableCell> 
                                        <IconButton aria-label="add" size="large" onClick={() => addGame(row.name)}>
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
                            label="Email" 
                            fullWidth 
                            value={emailInput} 
                            onChange={(e) => setEmailInput(e.target.value)} 
                            className="dialog-input"
                        />
                    </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirm} disabled={emailInput.trim() === ""}>
                        Add Game
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Addgame;