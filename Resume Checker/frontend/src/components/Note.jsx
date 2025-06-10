import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import config from '../config';
import '../styles/Note.css';
import Navbar from './Navbar';

const API_BASE_URL = config.API_BASE_URL;

const Note = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteCount, setNoteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch notes');
      setLoading(false);
    }
  };

  const fetchNoteCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/notes/count/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNoteCount(response.data.count);
    } catch (err) {
      console.error('Failed to fetch note count:', err);
    }
  };

  useEffect(() => {
    fetchNotes();
    fetchNoteCount();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      await axios.post(
        `${API_BASE_URL}/api/notes/`,
        { content: newNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewNote('');
      fetchNotes();
      fetchNoteCount();
    } catch (err) {
      setError('Failed to create note');
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/notes/${noteId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotes();
      fetchNoteCount();
    } catch (err) {
      setError('Failed to delete note');
    }
  };

  if (loading) return <div className="text-center p-4">Loading notes...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Navbar />
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Important Notes</h2>
        <p className="text-gray-600 mb-4">Total Notes: {noteCount}</p>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here..."
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Note
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-50 p-4 rounded-lg flex justify-between items-start"
            >
              <div className="flex-1">
                <p className="text-gray-800">{note.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Note;
