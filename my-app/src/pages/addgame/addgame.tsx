import React, {useState} from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem} from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import './addgame.css';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";
import GameDetailsModal from "../gamedetails/gamedetails";

function createData(name: string, minplayer: number, maxplayer: number, genre: Array<string>) {
    return { name, minplayer, maxplayer, genre };
}

function Addgame() {
    const navigate = useNavigate();
    const { setSelectedGameName } = useAppContext();
    const { collection, setCollection } = useAppContext();

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

        setGames(prev =>
            prev.filter(game => game.name !== selectedGame)
        );

        setEmailInput("");
        setSelectedGame(null);
        setOpen(false);
    };
    const filteredGames = games.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
        const matchesGenre = genreFilter === "All" || game.genre.includes(genreFilter);
        const matchesMin = minPlayers === "" || game.minplayer >= minPlayers;
        const matchesMax = maxPlayers === "" || game.maxplayer <= maxPlayers;
        return matchesSearch && matchesGenre && matchesMin && matchesMax;
    });
    
    return (
        <div className="addgame-container">
            <Button variant="outlined" onClick={() => navigate("/showcollection")} className="back-button">
                Back to Collection
            </Button>
            <h1>Add Game to Collection</h1>
            <div className="filters">
                <TextField label="Search games" size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <TextField select label="Genre" size="small" value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Strategy">Strategy</MenuItem>
                    <MenuItem value="Cozy">Cozy</MenuItem>
                    <MenuItem value="War">War</MenuItem>
                    <MenuItem value="Children">Children</MenuItem>
                </TextField>
                <TextField label="Min Players" type="number" size="small" value={minPlayers} onChange={(e) => setMinPlayers(e.target.value === "" ? "" : Number(e.target.value))}/>
                <TextField label="Max Players" type="number" size="small" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value === "" ? "" : Number(e.target.value))}/>
            </div>
            <TableContainer component={Paper} className="addgame-table">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Game</TableCell>
                            <TableCell>Min Players</TableCell>
                            <TableCell>Max Players</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredGames.map((row) => (
                            <TableRow key={row.name} className="addgame-row">
                                <TableCell component="th" scope="row">{
                                <Button
                                onClick={() => handleOpenDetails(row.name)}
                            >
                                {row.name}
                            </Button>
                                }</TableCell>
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
            <GameDetailsModal open={showDetails} onClose={handleCloseDetails} />
            <Dialog open={open} onClose={() => setOpen(false)} className="blur-dialog">
                <DialogTitle>Enter Game Owner</DialogTitle>
                    <DialogContent>
                        <TextField label="Email" fullWidth value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleConfirm} disabled={emailInput.trim() === ""}>
                        Add Game
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Addgame;
