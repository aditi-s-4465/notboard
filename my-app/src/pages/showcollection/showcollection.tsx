import React, { useState } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./showcollection.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

type Game = {
  id: string;
  name: string;
  minPlayers: number;
  maxPlayers: number;
  genre: string;
  ownedBy: string;
  averageRating: number;
};

const ALL_GAMES: Game[] = [
  {
    id: "pollen",
    name: "Pollen",
    minPlayers: 2,
    maxPlayers: 4,
    genre: "Strategy",
    ownedBy: "Aditi",
    averageRating: 8.3,
  },
  {
    id: "funemployed",
    name: "Funemployed",
    minPlayers: 2,
    maxPlayers: 8,
    genre: "Party",
    ownedBy: "Rose",
    averageRating: 7.1,
  },
  {
    id: "werewolf",
    name: "Werewolf",
    minPlayers: 4,
    maxPlayers: 7,
    genre: "Social Deduction",
    ownedBy: "Erica",
    averageRating: 7.8,
  },
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
  const { collection } = useAppContext();
  const [search, setSearch] = useState("");

  if (!collection) {
    return (
      <>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6">Not Board</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md" className="show-collection-root">
          <Typography variant="h5" gutterBottom>
            No collection selected
          </Typography>
          <Alert severity="info" style={{ marginBottom: 16 }}>
            Please go back and choose a collection first.
          </Alert>
          <Button variant="outlined" onClick={() => navigate("/choosecollection")}>
            Back to collections
          </Button>
        </Container>
      </>
    );
  }

  const gamesInCollection = gamesByCollection[collection] ?? [];
  const hasGames = gamesInCollection.length > 0;

  const filteredGames = gamesInCollection.filter((game) => {
    const q = search.toLowerCase();
    return (
      game.name.toLowerCase().includes(q) ||
      game.genre.toLowerCase().includes(q) ||
      game.ownedBy.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6">Not Board</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="show-collection-root">
        <div className="show-layout">
          {/* Sidebar */}
          <aside className="show-sidebar">
            <Typography variant="h6" className="show-sidebar-title">
              {collection}
            </Typography>

            {sidebarCodes.map((code) => (
              <Typography
                key={code}
                variant="body2"
                color="text.secondary"
                className="show-sidebar-code"
              >
                {code}
              </Typography>
            ))}

            <Button
              size="small"
              variant="text"
              startIcon={<ArrowBackIcon fontSize="small" />}
              className="show-back-button"
              onClick={() => navigate("/choosecollection")}
            >
              Back to collections
            </Button>
          </aside>

          {/* Main column */}
          <main className="show-main">
            {!hasGames ? (
              <div className="show-empty">
                <Typography variant="h5" gutterBottom>
                  No Games In Collection
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ marginBottom: 16 }}
                >
                  Add your first game to start building this collection.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/addgame")}
                >
                  Add Game
                </Button>
              </div>
            ) : (
              <>
                {/* TOP: search + scrollable table */}
                <div className="show-main-top">
                  <div className="show-search-row">
                    <TextField
                      size="small"
                      placeholder="Search games"
                      fullWidth
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <span className="show-search-icon-wrapper">
                            <SearchIcon fontSize="small" />
                          </span>
                        ),
                      }}
                    />
                    <IconButton aria-label="filter">
                      <FilterListIcon />
                    </IconButton>
                    <IconButton
                      aria-label="add game"
                      onClick={() => navigate("/addgame")}
                    >
                      <AddIcon />
                    </IconButton>
                  </div>

                  <div className="show-table-wrapper">
                    <Paper className="show-table-paper">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell># of Players</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Owned By</TableCell>
                            <TableCell>Average Rating</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredGames.map((game) => (
                            <TableRow key={game.id} hover>
                              <TableCell>{game.name}</TableCell>
                              <TableCell>
                                {game.minPlayers}-{game.maxPlayers}
                              </TableCell>
                              <TableCell>{game.genre}</TableCell>
                              <TableCell>{game.ownedBy}</TableCell>
                              <TableCell>{game.averageRating}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </div>
                </div>

                {/* BOTTOM: recommendations anchored to bottom */}
                <div className="show-main-bottom">
                  <Typography variant="subtitle1" className="show-reco-title">
                    Recommendations
                  </Typography>
                  <div className="show-reco-row">
                    {recommendations.map((rec) => (
                      <Card key={rec} className="show-reco-card">
                        <CardContent>
                          <Typography align="center" style={{ marginBottom: 8 }}>
                            {rec}
                          </Typography>
                          <div className="show-reco-add-wrapper">
                            <IconButton size="small">
                              <AddIcon fontSize="small" />
                            </IconButton>
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
    </>
  );
};

export default Showcollection;
