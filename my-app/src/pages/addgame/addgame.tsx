import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './addgame.css';
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

function createData(name: string, minplayer: number, maxplayer: number, genre: Array<string>) {
    return { name, minplayer, maxplayer, genre };
}

const rows = [
    createData('Pollen', 2, 4, ['Strategy','Cozy']),
    createData('Connect 4', 2, 2, ['Strategy']),
    createData('Battleship', 2, 2, ['War', 'Strategy']),
    createData('Candy Land', 2, 4, ['Children']),
];

function Addgame() {
    const navigate = useNavigate();
    const { collection, setCollection } = useAppContext();

    return (
        <div className="addgame-container">
            <h1>Add Game to Collection</h1>
            <TableContainer component={Paper} className="addgame-table">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Game</TableCell>
                            <TableCell>Min Players</TableCell>
                            <TableCell>Max Players</TableCell>
                            <TableCell>Genre</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} className="addgame-row">
                                <TableCell component="th" scope="row">{row.name}</TableCell>
                                <TableCell>{row.minplayer}</TableCell>
                                <TableCell>{row.maxplayer}</TableCell>
                                <TableCell>{row.genre.join(", ")}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Addgame;
