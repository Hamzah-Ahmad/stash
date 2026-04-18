import { type NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";

const Note = () => {
  const { handleUpsertNote, selectedNote } = useStorageContext();

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

  if (!selectedNote) return null;
  return (
    <div className="flex flex-col justify-center items-center p-10">
      <input
        className="title__input"
        onChange={(e) => {
          handleChange("title", e.target.value);
        }}
        defaultValue={selectedNote?.title}
      />
    </div>
  );
};

export default Note;
