import { type NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";
import CategoryPicker from "./CategoryPicker";
import { useState } from "react";
import TableSection from "./TableSection";
import TextSection from "./TextSection";
import CodeSection from "./CodeSection";

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
    <div className="flex flex-2 h-[stretch] flex-col mx-30 bg-surface border border-thin rounded-radius p-6 my-10 overflow-x-auto">
      {!selectedNote ? null : (
        <>
          <input
            className="title__input w-full mb-8"
            onChange={(e) => {
              handleChange("title", e.target.value);
            }}
            value={selectedNote?.title || "Untitled"}
          />
          <CategoryPicker category={category} setCategory={setCategory} />
          {category === NoteCategory.text && (
            <TextSection
              key="text"
              handleChange={handleChange}
              value={selectedNote?.text || ""}
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
              value={selectedNote?.code}
              selectedNote={selectedNote}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Note;
