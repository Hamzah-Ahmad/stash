import { type NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";
import Textpad from "../shared/Textpad";
import CategoryPicker from "./CategoryPicker";
import { useState } from "react";
import TableSection from "./TableSection";

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
    <div className="flex flex-2 h-[stretch] flex-col mx-30 bg-surface border border-thin rounded-radius p-6 my-10">
      {!selectedNote ? null : (
        <>
          <input
            className="title__input w-full mb-8"
            onChange={(e) => {
              handleChange("title", e.target.value);
            }}
            value={selectedNote?.title || "Untitled"}
          />
          <CategoryPicker setCategory={setCategory} />
          {category === NoteCategory.text && (
            <Textpad
              key="text"
              handleChange={handleChange}
              value={selectedNote?.text || ""}
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
            <textarea
              key="code-editor"
              className="border border-thin w-full rounded-radius p-3"
              onChange={(e) => handleChange("code", e.target?.value)}
              rows={5}
              value={selectedNote?.code}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Note;
