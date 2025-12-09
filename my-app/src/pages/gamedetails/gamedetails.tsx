import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, CircularProgress, Chip, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useAppContext } from "../../context/useappcontext";
import './gamedetails.css';

interface GameDetailsModalProps {
    open: boolean;
    onClose: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ open, onClose }) => {
    const { selectedGameName } = useAppContext();
    const [gameData, setGameData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && selectedGameName) {
            setLoading(true);
            fetch(`https://notboard.onrender.com/api/games/${selectedGameName}`)
                .then(res => res.json())
                .then(data => {
                    setGameData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to load game details", err);
                    setLoading(false);
                });
        }
    }, [open, selectedGameName]);

    if (!selectedGameName) return null;

    const getGenres = (data: any) => {
        if (!data) return [];
        const genres: string[] = [];
        
        Object.keys(data).forEach((key) => {
            if (key.startsWith("Cat:") && data[key] === 1) {
                genres.push(key.replace("Cat:", ""));
            }
        });

        //default to "General" if no categories found
        if (genres.length === 0) {
            genres.push("General");
        }
        
        return genres;
    };

    const genres = getGenres(gameData);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ style: { borderRadius: 12, overflow: 'hidden' } }}>
            <DialogContent className="game-modal-content">
                <IconButton onClick={onClose} style={{ position: 'absolute', right: 8, top: 8, zIndex: 10 }}>
                    <CloseIcon />
                </IconButton>

                {loading ? (
                    <div className="loading-box"><CircularProgress /></div>
                ) : gameData ? (
                    <div className="game-details-layout">
                        <div className="game-details-left">
                            {gameData.ImagePath ? (
                                <img src={gameData.ImagePath} alt={gameData.Name} className="game-poster-img" />
                            ) : (
                                <div className="no-image-placeholder">No Image</div>
                            )}
                        </div>

                        <div className="game-details-right">
                            <Typography variant="h3" className="game-header-title">{gameData.Name}</Typography>
                            
                            <div className="game-stats-grid">
                                <div className="stat-item">
                                    <div className="stat-value">{gameData.MinPlayers}-{gameData.MaxPlayers}</div>
                                    <div className="stat-label">Players</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{gameData.MfgPlaytime || 30}m</div>
                                    <div className="stat-label">Play Time</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">{Number(gameData.AvgRating).toFixed(1)}</div>
                                    <div className="stat-label">BGG Rating</div>
                                </div>
                            </div>

                            <div>
                                <Typography className="game-section-title">About this game</Typography>
                                <Typography className="game-description-text">
                                    {gameData.Description || "No description provided for this game."}
                                </Typography>
                            </div>

                            <div>
                                <Typography className="game-section-title">Genres</Typography>
                                <div className="game-genre-chips">
                                    {genres.map(g => (
                                        <Chip key={g} label={g} size="small" style={{ backgroundColor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="loading-box"><Typography>Game details not found.</Typography></div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default GameDetailsModal;