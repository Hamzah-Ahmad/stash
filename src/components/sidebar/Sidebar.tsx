import { useState } from "react";
import { useStorageContext } from "../../context/StorageContext";
import Row from "./Row";
import type { NoteType } from "../../utils/db";

const Sidebar = () => {
  const { notes, handleSelectNote, handleUpsertNote, handleReorder } =
    useStorageContext();

  const [draggedNote, setDraggedNote] = useState<NoteType | null>(null);

  const create = async () => {
    const newNote = await handleUpsertNote();
    if (newNote) handleSelectNote(newNote.id);
  };

  return (
    <div className="sidebar">
      <button className="sidebar__row w-full cursor-pointer" onClick={create}>
        Create Note
      </button>
      <div className="sidebar__items">
        {notes?.map((note) => (
          <Row
            note={note}
            handleSelectNote={handleSelectNote}
            handleReorder={handleReorder}
            key={note.id}
            draggedNote={draggedNote}
            setDraggedNote={setDraggedNote}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
