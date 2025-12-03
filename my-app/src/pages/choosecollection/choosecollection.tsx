import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import "./choosecollection.css";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useappcontext";

type Collection = {
  id: string;
  name: string;
  code: string;
};

const initialCollections: Collection[] = [
  { id: "c1", name: "Collection 1", code: "aditi12" },
  { id: "c2", name: "Collection 2", code: "rose11" },
  { id: "c3", name: "Collection 3", code: "erica54" },
];

const Choosecollection: React.FC = () => {
  const navigate = useNavigate();
  const { setCollection } = useAppContext();

  const [collections, setCollections] =
    useState<Collection[]>(initialCollections);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCode, setNewCode] = useState("");

  const handleSelectCollection = (col: Collection) => {
    setCollection(col.name);
    navigate("/showcollection");
  };

  const handleOpenDialog = () => setDialogOpen(true);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setJoinCode("");
    setNewName("");
    setNewCode("");
  };

  const handleAddCollection = () => {
    if (!newName.trim() && !joinCode.trim()) return;

    let name = newName.trim();
    let code = newCode.trim();

    if (!name && joinCode.trim()) {
      name = `Collection ${collections.length + 1}`;
      code = joinCode.trim();
    }

    const newCollection: Collection = {
      id: `c-${Date.now()}`,
      name,
      code: code || "N/A",
    };

    setCollections((prev) => [...prev, newCollection]);
    setCollection(newCollection.name);
    handleCloseDialog();
    navigate("/showcollection");
  };

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div">
            Not Board
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className="choose-collection-root">
        <div className="choose-main">
          <Typography variant="h5" className="choose-title" gutterBottom>
            Choose a Collection
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="choose-description"
          >
            Select an existing collection or create a new one to start managing
            your board games.
          </Typography>

          <div className="collection-cards-row">
            {collections.map((col) => (
              <Card key={col.id} className="collection-card">
                <CardActionArea
                  className="collection-card-action"
                  onClick={() => handleSelectCollection(col)}
                >
                  <CardContent className="collection-card-content">
                    <Typography
                      variant="subtitle1"
                      align="center"
                      className="collection-card-title"
                    >
                      {col.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      align="center"
                      color="text.secondary"
                      className="collection-card-code"
                      display="block"
                    >
                      Code: {col.code}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}

            {/* "+" card */}
            <Card className="collection-card">
              <CardActionArea
                className="collection-card-action"
                onClick={handleOpenDialog}
              >
                <CardContent className="collection-card-content">
                  <div className="collection-new-inner">
                    <AddIcon fontSize="large" />
                    <Typography variant="subtitle1" align="center">
                      New Collection
                    </Typography>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
          </div>
        </div>
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{ className: "choose-dialog-paper" }}
      >
        <DialogTitle className="choose-dialog-title">
          <div className="choose-dialog-title-row">
            <IconButton
              size="small"
              onClick={handleCloseDialog}
              className="choose-dialog-close-button"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
            <Typography variant="subtitle1">Add Collection</Typography>
          </div>
        </DialogTitle>

        <DialogContent className="choose-dialog-content">
          <div className="choose-dialog-fields">
            <TextField
              label="Collection Code"
              placeholder="Join existing collection"
              size="small"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              fullWidth
            />

            <Divider className="choose-dialog-divider">or</Divider>

            <TextField
              label="New Collection Name"
              size="small"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              fullWidth
            />
            <TextField
              label="New Collection Code"
              size="small"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              fullWidth
            />
          </div>
        </DialogContent>

        <DialogActions className="choose-dialog-actions">
          <Button variant="contained" fullWidth onClick={handleAddCollection}>
            Add Collection
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Choosecollection;
