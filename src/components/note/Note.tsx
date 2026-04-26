import { type NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";
import Textpad from "../shared/Textpad";
import CategoryPicker from "./CategoryPicker";
import { useState } from "react";
import Table from "../shared/Table";
import TableSection from "./TableSection";

export const NoteCategory = { Text: "TEXT", Table: "TABLE" } as const;
export type NoteCategory = (typeof NoteCategory)[keyof typeof NoteCategory];

const Note = () => {
  const { handleUpsertNote, selectedNote } = useStorageContext();

  const [category, setCategory] = useState<NoteCategory>(NoteCategory.Text);
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
    <div className="flex flex-2 flex-col justify-center items-center p-10">
      {!selectedNote ? null : (
        <>
          <input
            className="title__input w-full mb-8"
            onChange={(e) => {
              handleChange("title", e.target.value);
            }}
            value={selectedNote?.title}
          />
          <CategoryPicker setCategory={setCategory} />
          {category === NoteCategory.Text && (
            <Textpad
              handleChange={handleChange}
              defaultValue={selectedNote?.text}
            />
          )}
          {/* {category === NoteCategory.Table && <Table columns={undefined} data={undefined} handleChange={handleChange} />} */}
          {category === NoteCategory.Table && <TableSection selectedNote={selectedNote} handleChange={handleChange} />}
        </>
      )}
    </div>
  );
};

export default Note;
