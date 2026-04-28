import { type NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";
import CategoryPicker from "./CategoryPicker";
import { useState } from "react";
import TableSection from "./TableSection";
import TextSection from "./TextSection";
import CodeSection from "./CodeSection";

const Empty = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <header className="text-text-2 text-6xl mb-4">Welcome to Stash!</header>
      <div className="text-text-2 text-2xl w-[75%] text-center mb-4">
        Click the Create button on the sidebar to create your first note All
        notes are saved automatically to your browser's storage
      </div>
      <small className="text-text-3 text-xl w-[75%] text-center">
        (By creating a note, you consent to storing your note data locally in
        your browser’s IndexedDB storage on this device.)
      </small>
    </div>
  );
};
// Typescript 5.8 doesn't like enums. refernce: https://www.totaltypescript.com/erasable-syntax-only
export const NoteCategory = {
  text: "text",
  table: "table",
  code: "code",
} as const;
export type NoteCategory = (typeof NoteCategory)[keyof typeof NoteCategory];

const Note = () => {
  const { handleUpsertNote, selectedNote } = useStorageContext();

  const [category, setCategory] = useState<NoteCategory>(NoteCategory.text);
  async function handleChange(
    field: keyof NoteType,
    value: string,
  ): Promise<any> {
    if (!selectedNote) return;

    await handleUpsertNote({
      ...selectedNote,
      [field]: value,
    });
  }

  return (
    <div className="flex flex-2 h-[stretch] flex-col mx-4 md:mx-12 lg:max-30 bg-surface border border-thin rounded-radius p-6 my-10 overflow-x-auto">
      <div className="text-right text-xs mb-4 text-text-2">
        <span className="bg-dark px-2 py-1 rounded-xs">Shift + Space</span> for
        global search by text or code content.
      </div>
      {!selectedNote ? <Empty /> : (
        <>
          <input
            className="title__input w-full mb-8"
            onChange={(e) => {
              handleChange("title", e.target.value);
            }}
            value={selectedNote?.title || ""}
          />
          <CategoryPicker category={category} setCategory={setCategory} />
          {category === NoteCategory.text && (
            <TextSection
              key="text"
              handleChange={handleChange}
              selectedNote={selectedNote}
            />
          )}
          {category === NoteCategory.table && (
            <TableSection
              key="table"
              selectedNote={selectedNote}
              handleChange={handleChange}
            />
          )}
          {category === NoteCategory.code && (
            <CodeSection
              key="code-editor"
              onChange={(val: string) => handleChange("code", val)} //handleChange("code", e.target?.value)
              selectedNote={selectedNote}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Note;
