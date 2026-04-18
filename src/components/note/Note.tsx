import { type NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";

const Note = () => {
  const { handleUpsertNote, selectedNote, notes } = useStorageContext();

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
        <input
          className="title__input w-full"
          onChange={(e) => {
            handleChange("title", e.target.value);
          }}
          value={selectedNote?.title}
        />
      )}
    </div>
  );
};

export default Note;
