import { useRef, useState } from "react";
import { useStorageContext } from "../../context/StorageContext";
import Row from "./Row";
import type { NoteType } from "../../utils/db";
import { throttle } from "../../utils/helpers";

const Sidebar = () => {
  const {
    notes,
    handleSelectNote,
    handleUpsertNote,
    handleReorder,
    selectedNote,
  } = useStorageContext();

  const sidebarRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");

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
  const filteredNotes = notes?.filter((note) => {
    if (!searchQuery) return true;
    return note.title?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  });

  return (
    <div className="sidebar">
      <div className="mb-10 mx-7 mt-0 flex flex-col gap-10 justify-center">
        <input
          className="title__search__input"
          placeholder="Search a note by title"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="border border-thin py-3  cursor-pointer rounded-radius-lg bg-deep"
          onClick={create}
        >
          Create Note
        </button>
      </div>
      <div
        onDragOver={() => {
          if (draggedNote?.id) {
            throttledScroll("bottom");
          }
        }}
      ></div>
      <div className="sidebar__items" ref={sidebarRef}>
        {filteredNotes?.map((note) => (
          <Row
            note={note}
            handleSelectNote={handleSelectNote}
            handleReorder={handleReorder}
            key={note.id}
            draggedNote={draggedNote}
            setDraggedNote={setDraggedNote}
            isSelectedNote={selectedNote?.id === note.id}
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
