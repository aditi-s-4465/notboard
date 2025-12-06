import React from "react";
import { Dialog, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { useAppContext } from "../../context/useappcontext";
import './gamedetails.css';

interface GameDetailsModalProps {
    open: boolean;
    onClose: () => void;
}

const GameDetailsModal: React.FC<GameDetailsModalProps> = ({ open, onClose }) => {
    const { selectedGameName } = useAppContext();

    if (!selectedGameName) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogContent className="game-modal-content">
                <Box className="game-left">
                    <Typography variant="h4" className="game-title">{selectedGameName}</Typography>
                    <Box className="game-image-placeholder">
                        Image Rectangle
                    </Box>
                </Box>

                <Box className="game-right">
                    <Typography variant="h6">Description</Typography>
                    <Box className="game-description-placeholder">
                        Placeholder description for the game.
                    </Box>

                    <Box className="game-stats">
                        <Box className="stat-box">
                            <Typography variant="subtitle2">Min Players</Typography>
                            <Box className="stat-value">2</Box>
                        </Box>
                        <Box className="stat-box">
                            <Typography variant="subtitle2">Max Players</Typography>
                            <Box className="stat-value">4</Box>
                        </Box>
                        <Box className="stat-box">
                            <Typography variant="subtitle2">Rating</Typography>
                            <Box className="stat-value">5/5</Box>
                        </Box>
                    </Box>

                    <Box className="game-genres">
                        <Typography variant="subtitle2">Genres:</Typography>
                        <Typography>Strategy, Cozy</Typography>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default GameDetailsModal;
