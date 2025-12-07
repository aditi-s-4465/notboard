import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Card,
  CardContent,
  Alert,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Stack,
  Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import "./showcollection.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";
import GameDetailsModal from "../gamedetails/gamedetails";

type Game = {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  genre: string;
  ownedBy: string;
  averageRating: number;
};

// Initial Data
const ALL_GAMES: Game[] = [
  { id: "pollen", name: "Pollen", minPlayers: 2, maxPlayers: 4, genre: "Strategy", ownedBy: "Aditi", averageRating: 8.3 },
  { id: "funemployed", name: "Funemployed", minPlayers: 2, maxPlayers: 8, genre: "Party", ownedBy: "Rose", averageRating: 7.1 },
  { id: "werewolf", name: "Werewolf", minPlayers: 4, maxPlayers: 7, genre: "Social Deduction", ownedBy: "Erica", averageRating: 7.8 },
];

const gamesByCollection: { [name: string]: Game[] } = {
  "Collection 1": [ALL_GAMES[0]],
  "Collection 2": [ALL_GAMES[1], ALL_GAMES[2]],
  "Collection 3": [],
};

const sidebarCodes = ["aditi12", "rose11", "erica54"];
const recommendations = ["Splendor", "Codenames", "Azul"];

const Showcollection: React.FC = () => {
  const navigate = useNavigate();
  const { collection, setSelectedGameName, setEmail, setCollection } = useAppContext();
  
  const [currentGames, setCurrentGames] = useState<Game[]>([]);

  useEffect(() => {
    if (collection) {
      setCurrentGames(gamesByCollection[collection] ?? []);
    }
  }, [collection]);

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [minPlayers, setMinPlayers] = useState<number | "">("");
  const [maxPlayers, setMaxPlayers] = useState<number | "">("");

  const [showDetails, setShowDetails] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  const handleOpenDetails = (gameName: string) => {
    setSelectedGameName(gameName);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedGameName("");
  };

  const handleDeleteClick = (id: string) => {
    setGameToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (gameToDelete) {
      setCurrentGames((prev) => prev.filter((g) => g.id !== gameToDelete));
    }
    setDeleteDialogOpen(false);
    setGameToDelete(null);
  };

  const handleLogout = () => {
    setEmail("");
    setCollection("");
    navigate("/");
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
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" className="navbar-title">Not Board</Typography>
          <Button color="inherit" onClick={() => navigate("/choosecollection")} className="navbar-back-btn">
            Back to Collections
          </Button>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="show-collection-root">
        <div className="show-layout">
          <aside className="show-sidebar">
            <Typography variant="h6" className="show-sidebar-title">{collection}</Typography>
            {sidebarCodes.map((code) => (
              <Typography key={code} variant="body2" color="text.secondary" className="show-sidebar-code">{code}</Typography>
            ))}
          </aside>

          <main className="show-main">
            {!hasGames ? (
              <div className="show-empty">
                <Typography variant="h5" gutterBottom>No Games In Collection</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/addgame")} size="large">
                  Add Your First Game
                </Button>
              </div>
            ) : (
              <>
                <div className="show-main-top">
                  
                  <Paper elevation={0} className="filter-bar-container">
                    <Stack 
                      direction={{ xs: 'column', md: 'row' }} 
                      spacing={2} 
                      alignItems="center"
                      className="stack-full-width"
                    >
                      <Box className="filter-box-search">
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Search games or owners..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="filter-input-bg"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

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
                            <MenuItem value="Party">Party</MenuItem>
                            <MenuItem value="Social Deduction">Social Deduction</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Box className="filter-box-number">
                        <TextField
                          label="Min"
                          type="number"
                          size="small"
                          fullWidth
                          value={minPlayers}
                          onChange={(e) => setMinPlayers(e.target.value === "" ? "" : Number(e.target.value))}
                          className="filter-input-bg"
                        />
                      </Box>
                      
                      <Box className="filter-box-number">
                        <TextField
                          label="Max"
                          type="number"
                          size="small"
                          fullWidth
                          value={maxPlayers}
                          onChange={(e) => setMaxPlayers(e.target.value === "" ? "" : Number(e.target.value))}
                          className="filter-input-bg"
                        />
                      </Box>

                      <Box className="filter-box-button">
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                          onClick={() => navigate("/addgame")}
                          className="add-game-button"
                        >
                          Add Game
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>

                  <div className="show-table-wrapper">
                    <Paper className="show-table-paper" elevation={0} variant="outlined">
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
                            <TableRow key={game.name} hover>
                              <TableCell>
                                <Button 
                                  onClick={() => handleOpenDetails(game.name)} 
                                  className="game-name-link"
                                  disableRipple
                                >
                                  {game.name}
                                </Button>
                              </TableCell>
                              <TableCell>{game.minPlayers}-{game.maxPlayers}</TableCell>
                              <TableCell>
                                <Chip label={game.genre} size="small" className="genre-chip" />
                              </TableCell>
                              <TableCell>{game.ownedBy}</TableCell>
                              <TableCell>{game.averageRating}</TableCell>
                              <TableCell>
                                <IconButton size="small" className="delete-icon-btn" onClick={() => handleDeleteClick(game.id)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </div>
                </div>

                <div className="show-main-bottom">
                  <Typography variant="h6" className="show-reco-title">Recommended for you</Typography>
                  <div className="show-reco-row">
                    {recommendations.map((rec) => (
                      <Card key={rec} className="show-reco-card reco-card-hover" variant="outlined">
                        <CardContent>
                          <Typography align="center" className="reco-card-text">{rec}</Typography>
                          <div className="show-reco-add-wrapper">
                             <Button size="small" startIcon={<AddIcon />}>Add</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </Container>
      
      <GameDetailsModal open={showDetails} onClose={handleCloseDetails} />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Remove Game?</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this game from the collection?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Remove</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Showcollection;