import React from "react";
import '../styles/Note.css';

function Note({ note, onDelete }) {
    const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="note-item">
            <div className="note-header">
                <h3 className="note-title">{note.title}</h3>
                <button
                    onClick={() => onDelete(note.id)}
                    title="Delete note"
                    className="delete-btn"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
            
            <div className="note-content">
                {note.content}
            </div>
            
            <div className="note-date">
                Created: {formattedDate}
            </div>
        </div>
    );
}

export default Note;