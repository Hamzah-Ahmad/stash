import {
  useState,
  type Dispatch,
  type DragEvent,
  type SetStateAction,
} from "react";
import type { NoteType } from "../../utils/db";
import { CheckIcon, CloseIcon, TrashIcon } from "../shared/Icons";
import IconButton from "../shared/IconButton";

interface RowProps {
  note: NoteType;
  handleSelectNote: (id: string) => Promise<void>;
  handleReorder: (draggedNote: NoteType, targetNote: NoteType) => Promise<void>;
  draggedNote: NoteType | null;
  setDraggedNote: Dispatch<SetStateAction<NoteType | null>>;
  isSelectedNote: boolean;

  handleDelete: (id: string, rowIndex: number) => Promise<void>;
  rowIndex: number;
}

const Row = ({
  note,
  handleReorder,
  handleSelectNote,
  draggedNote,
  setDraggedNote,
  isSelectedNote,
  handleDelete,
  rowIndex,
}: RowProps) => {

  
  const [markToDelete, setMarkToDelete] = useState(false);

  function handleDragStart(_: DragEvent<HTMLDivElement>, note: NoteType) {
    setDraggedNote(note);
  }

  function handleDragEnd(_: DragEvent<HTMLDivElement>, __: NoteType) {
    setDraggedNote(null);
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
      className={`sidebar__row ${isSelectedNote ? "bg-deeper" : ""}`}
      onClick={() => handleSelectNote(note.id)}
      onDragStart={(e) => handleDragStart(e, note)}
      onDragEnd={(e) => handleDragEnd(e, note)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, note)}
      draggable
    >
      <div className="flex justify-between items-center">
        <span className="max-w-[80%] truncate">
          {markToDelete ? "Are you sure?" : note.title || `Enter a title`}
        </span>
        {markToDelete ? (
          <div className="flex justify-between gap-5">
            <IconButton
              className="fill-red"
              icon={CloseIcon}
              onClick={(e) => {
                e.stopPropagation();
                setMarkToDelete(false);
              }}
            />
            <IconButton
              className="fill-green"
              icon={CheckIcon}
              onClick={async (e) => {
                e.stopPropagation();
                handleDelete(note.id, rowIndex);
              }}
            />
          </div>
        ) : (
          <IconButton
            className="fill-red"
            icon={TrashIcon}
            onClick={(e) => {
              e.stopPropagation();
              setMarkToDelete(true);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Row;
