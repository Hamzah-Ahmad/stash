import { useRef, useState } from "react";
import { useStorageContext } from "../../context/StorageContext";
import Row from "./Row";
import type { NoteType } from "../../utils/db";
import { throttle } from "../../utils/helpers";

const Sidebar = () => {
  const { notes, handleSelectNote, handleUpsertNote, handleReorder } =
    useStorageContext();

  const sidebarRef = useRef<HTMLDivElement>(null);

  const [draggedNote, setDraggedNote] = useState<NoteType | null>(null);

  const create = async () => {
    const newNote = await handleUpsertNote();
    if (newNote) handleSelectNote(newNote.id);
  };

  function handleScroll(dir: string) {
    sidebarRef.current?.scrollBy({
      [dir]: 100, // scroll down 100px
      behavior: "smooth",
    });
  }

  const throttledScroll = throttle(handleScroll, 450);

  return (
    <div className="sidebar">
      <button className="sidebar__row w-full cursor-pointer" onClick={create}>
        Create Note
      </button>
      <div
        onDragOver={() => {
          if (draggedNote?.id) {
            throttledScroll("bottom");
          }
        }}
      ></div>
      <div className="sidebar__items" ref={sidebarRef}>
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
      <div
        className="h-5"
        onDragOver={() => {
          if (draggedNote?.id) {
            throttledScroll("top");
          }
        }}
      />
    </div>
  );
};

export default Sidebar;
