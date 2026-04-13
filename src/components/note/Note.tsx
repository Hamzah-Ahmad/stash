import { useEffect, useState } from "react";
import { addNote, getNoteById, type NoteType } from "../../utils/db";

type NoteProps = {
  id?: string;
};

const Note = ({ id }: NoteProps) => {
  const [note, setNote] = useState<NoteType | undefined>();

  async function fetchNote() {
    if (!id) return;
    try {
      const result = await getNoteById(id);
      setNote(result);
    } catch (err) {
      console.log("Error occured while fetching note");
      setNote(undefined);
    }
  }

  async function handleChange(
    field: keyof NoteType,
    value: string,
  ): Promise<any> {
    await addNote({
      ...note,
      [field]: value,
    });
  }

  useEffect(() => {
    fetchNote();
  });

  return (
    <div>
      {id} - {note?.title}
      <input onChange={(e) => handleChange("title", e.target?.value)} />
    </div>
  );
};

export default Note;
