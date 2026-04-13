import { useEffect, useState } from "react";
import { type NoteType } from "../utils/db";
import { noteService } from "../services/notesService";

const useStorage = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleGetNotes() {
    setIsLoading(true);
    try {
      const data = await noteService.getAll();
      setNotes(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleAddNote(note: Partial<NoteType>) {
    try {
      await noteService.create(note);
      const updatedNtoes = await noteService.getAll();
      setNotes(updatedNtoes);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(err as Error);
      }
      console.error("Error when creating note", err);
    }
  }

  async function handleGetNoteById(id: string) {
    try {
      const note = await noteService.getById(id);
      return note;
    } catch (err) {
      setError(err as Error);
      console.error("Error when creating note", err);
    }
  }
  useEffect(() => {
    handleGetNotes();
  }, []);

  return { notes, isLoading, error, handleAddNote, handleGetNoteById };
};

export default useStorage;
