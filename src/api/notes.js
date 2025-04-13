import axios from "axios";

const API_URL = "http://localhost:5025/api";

// Notes API
export const notesApi = {
  // Get all notes
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/notes`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new Error("Failed to fetch notes");
    }
  },

  // Create a new note
  create: async (note) => {
    try {
      const response = await axios.post(`${API_URL}/notes`, note);
      return response.data;
    } catch (error) {
      console.error("Error creating note:", error);
      throw new Error("Failed to create note");
    }
  },

  // Update a note
  update: async (id, note) => {
    try {
      const response = await axios.put(`${API_URL}/notes/${id}`, note);
      return response.data;
    } catch (error) {
      console.error("Error updating note:", error);
      throw new Error("Failed to update note");
    }
  },

  // Delete a note
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw new Error("Failed to delete note");
    }
  },
};
