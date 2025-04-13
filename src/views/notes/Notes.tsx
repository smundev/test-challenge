import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { notesApi } from "../../api/notes";

interface Note {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}

interface FormErrors {
  title: string;
  description: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    title: "",
    description: "",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    noteId: string | null;
  }>({ open: false, noteId: null });

  const fetchNotes = async () => {
    try {
      const response = await notesApi.getAll();
      if (response.success) {
        setNotes(response.data);
      } else {
        showError("Failed to fetch notes");
      }
    } catch (err) {
      showError("An error occurred while fetching notes");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const validateForm = () => {
    const newErrors = { title: "", description: "" };
    let isValid = true;

    if (!newNote.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (newNote.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
      isValid = false;
    }

    if (!newNote.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (newNote.description.length < 1) {
      newErrors.description = "Description must be at least 1 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange =
    (field: keyof FormErrors) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setNewNote((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleCreateNote = async () => {
    if (!validateForm()) return;

    try {
      const response = await notesApi.create(newNote);
      if (response.success) {
        setNotes([...notes, response.data]);
        setNewNote({ title: "", description: "" });
        setOpenDialog(false);
      }
    } catch (err) {
      showError("Failed to create note");
      console.error("Error creating note:", err);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !validateForm()) return;

    try {
      const response = await notesApi.update(editingNote.id, {
        title: newNote.title,
        description: newNote.description,
      });
      if (response.success) {
        setNotes(
          notes.map((note) =>
            note.id === editingNote.id ? response.data : note
          )
        );
        setEditingNote(null);
        setNewNote({ title: "", description: "" });
        setOpenDialog(false);
      }
    } catch (err) {
      showError("Failed to update note");
      console.error("Error updating note:", err);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      const response = await notesApi.delete(id);
      if (response.success) {
        setNotes(notes.filter((note) => note.id !== id));
        setDeleteDialog({ open: false, noteId: null });
      }
    } catch (err) {
      showError("Failed to delete note");
      console.error("Error deleting note:", err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ open: true, noteId: id });
  };

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setNewNote({ title: note.title, description: note.description });
    } else {
      setEditingNote(null);
      setNewNote({ title: "", description: "" });
    }
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Notes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Note
        </Button>
      </Grid>

      {notes.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No notes found
        </Typography>
      ) : (
        <Paper elevation={2}>
          <List>
            {notes.map((note) => (
              <ListItem
                key={note.id}
                divider
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenDialog(note)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(note.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={note.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {note.description}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        Created: {new Date(note.createdAt).toLocaleString()}
                        {note.updatedAt &&
                          ` | Updated: ${new Date(
                            note.updatedAt
                          ).toLocaleString()}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editingNote ? "Edit Note" : "Create New Note"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={newNote.title}
              onChange={handleFieldChange("title")}
              margin="normal"
              error={!!errors.title}
              helperText={errors.title}
              required
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={newNote.description}
              onChange={handleFieldChange("description")}
              margin="normal"
              error={!!errors.description}
              helperText={errors.description}
              required
              multiline
              rows={4}
              inputProps={{ maxLength: 1000 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={editingNote ? handleUpdateNote : handleCreateNote}
            variant="contained"
            color="primary"
          >
            {editingNote ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!error}
        onClose={() => setError(null)}
        PaperProps={{
          sx: {
            minWidth: "300px",
            backgroundColor: "#ffebee",
            color: "#d32f2f",
          },
        }}
      >
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography>{error}</Typography>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, noteId: null })}
      >
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this note? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, noteId: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteNote(deleteDialog.noteId!)}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notes;
