import { useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useStorageContext } from "../../context/StorageContext";
import Row from "./Row";
import type { NoteType } from "../../utils/db";
import { throttle } from "../../utils/helpers";
import IconButton from "../shared/IconButton";
import { CloseIcon } from "../shared/Icons";

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    notes,
    handleSelectNote,
    handleUpsertNote,
    handleReorder,
    selectedNote,
    deleteNote,
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

  async function handleDelete(id: string, rowIndex: number) {
    await deleteNote(id);
    if (notes?.length) {
      if (notes[rowIndex + 1]) handleSelectNote(notes[rowIndex + 1].id);
      else if (notes[rowIndex - 1]) handleSelectNote(notes[rowIndex - 1].id);
      else handleSelectNote(""); // Set selected note as undefined
    }
  }

  const throttledScroll = throttle(handleScroll, 450);
  const filteredNotes = notes?.filter((note) => {
    if (!searchQuery) return true;
    return note.title?.toLowerCase()?.includes(searchQuery?.toLowerCase());
  });

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <IconButton
        className="block lg:hidden absolute top-4 right-4"
        icon={CloseIcon}
        onClick={() => setIsCollapsed(true)}
      />

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
        {filteredNotes?.map((note, index) => (
          <Row
            note={note}
            handleSelectNote={handleSelectNote}
            handleReorder={handleReorder}
            key={note.id}
            draggedNote={draggedNote}
            setDraggedNote={setDraggedNote}
            isSelectedNote={selectedNote?.id === note.id}
            handleDelete={handleDelete}
            rowIndex={index}
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
