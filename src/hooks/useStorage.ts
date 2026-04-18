import { useEffect, useState } from "react";
import { type NoteType } from "../utils/db";
import { noteService } from "../services/notesService";

const useStorage = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteType | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleGetNotes() {
    setIsLoading(true);
    try {
      const data = await noteService.getAll();
      setNotes(
        (data || [])?.sort((a: NoteType, b: NoteType) => b.order - a.order),
      );
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }
  async function handleUpsertNote(
    noteDto?: NoteType,
  ): Promise<NoteType | undefined> {
    try {
      const noteToSave = noteDto ?? {
        id: crypto.randomUUID(),
        order: notes?.length || 0,
      };

      await noteService.upsert(noteToSave);

      await handleGetNotes();

      // If dragged note is the current selectedNote, update selectedNote with the updated info
      if(noteDto?.id === selectedNote?.id) {
        setSelectedNote(noteDto)
      }

      // await handleGetNotes()
      return noteToSave;
    } catch (err) {
      const error = err instanceof Error ? err : (err as Error);
      setError(error);
      console.error("Error when upserting note", err);
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

  async function handleSelectNote(id: string) {
    const foundNote = await handleGetNoteById(id);
    if (foundNote) setSelectedNote(foundNote);
  }

  async function handleReorder(draggedNote: NoteType, targetNote: NoteType) {
    // Explanation:
    // Using an interview question technique I heard from a collegue to reorder.
    // If we want to move note at order A after note at order D, we get the midpoint of order D and E and set that as the order of
    // the original note (i.e. the note originally with order A). This allows to reorder withiut changing order of other notes.
    // For example, if note originally has order 4 and user moves it after 9, we set the new order of the note as (9 + 10) / 2
    // Getting note adjacent to target note
    const noteAfterTargetNote =
      notes[(notes.findIndex((note) => note.id === targetNote.id) || 0) + 1];

    // Calculating new order of dragged note accorrding to logic written above
    const newOrder = ((noteAfterTargetNote?.order || 0) + targetNote.order) / 2;

    await handleUpsertNote({ ...draggedNote, order: newOrder });
    // setNotes(
    //   notes.map((note) => {
    //     if (note.id === draggedNote.id) return { ...note, order: newOrder };
    //     else return note;
    //   }),
    // );
  }

  useEffect(() => {
    handleGetNotes();
  }, []);

  return {
    notes,
    isLoading,
    error,
    handleUpsertNote,
    handleGetNoteById,
    selectedNote,
    handleSelectNote,
    handleReorder,
  };
};

export default useStorage;
