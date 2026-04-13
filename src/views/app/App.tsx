import { useEffect, useState } from "react";
import Note from "../../components/note";
import { addNote, getNotes, type NoteType } from "../../utils/db";

function App() {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [noteId, setdNoteId] = useState<string | undefined>(
    notes?.[0]?.id || undefined,
  );

  async function fetchNotes() {
    try {
      const result = await getNotes();
      setNotes(result);
    } catch (err) {
      setNotes([]);
    }
  }

  async function handleCreateNote() {
    const id = crypto.randomUUID();

    await addNote({
      id,
    });
    setdNoteId(id);
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div>
      <button onClick={handleCreateNote}>Add New Note</button>

      {noteId && <Note id={noteId} />}

      <h1>Notes</h1>

      <hr />
      <p>Selected Note</p>
      {notes?.map((note) => (
        <div onClick={() => setdNoteId(note.id)}>
          {note.id} - {note.title}
        </div>
      ))}
    </div>
  );
}

export default App;
