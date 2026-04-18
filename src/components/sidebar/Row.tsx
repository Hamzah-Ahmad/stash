import {
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";
import type { NoteType } from "../../utils/db";

interface RowProps {
  note: NoteType;
  handleSelectNote: (id: string) => Promise<void>;
  handleReorder: (draggedNote: NoteType, targetNote: NoteType) => Promise<void>;
  draggedNote: NoteType | null;
  setDraggedNote: Dispatch<SetStateAction<NoteType | null>>;
}
const Row = ({
  note,
  handleReorder,
  handleSelectNote,
  draggedNote,
  setDraggedNote,
}: RowProps) => {
  function handleDragStart(_: DragEvent<HTMLDivElement>, note: NoteType) {
    setDraggedNote(note);
  }

  function handleDragEnd(_: DragEvent<HTMLDivElement>, __: NoteType) {
    // setDraggedNote(null);
  }

  // Drag Over (and setting e.preventDefault) is required to make drop work.  Applies to Drop Target
  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  // Applies to Drop Target
  function handleDrop(_: DragEvent<HTMLDivElement>, note: NoteType) {
    if (draggedNote) {
      handleReorder(draggedNote, note);
    }
  }


  return (
    <div
      className="sidebar__row"
      onClick={() => handleSelectNote(note.id)}
      onDragStart={(e) => handleDragStart(e, note)}
      onDragEnd={(e) => handleDragEnd(e, note)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, note)}
      draggable
    >
      {note.title || "Untitled"}
    </div>
  );
};

export default Row;
