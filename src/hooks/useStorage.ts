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
        order: (notes?.length ?? 0) + 1, // Order should start from 1. 0 causes bugs like when trying to caclulate the lowest order dynamically (0/2 is 0. More explanation below)
      };

      await noteService.upsert(noteToSave);

      await handleGetNotes();

      // If dragged note is the current selectedNote, update selectedNote with the updated info
      if (noteDto?.id === selectedNote?.id) {
        setSelectedNote(noteDto);
      }

      // await handleGetNotes()
      return noteToSave;
    } catch (err) {
      const error = err instanceof Error ? err : (err as Error);
      setError(error);
      console.error("Error when upserting note", err);
    }
  }

  async function deleteNote(id: string) {
    try {
      await noteService.delete(id);
      await handleGetNotes();
    } catch (err) {
      setError(err as Error);
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

  async function handleSelectNote(id: string) {
    if(!id) setSelectedNote(undefined); // Sending empty id to deselect notes. Useful when deleting final note
    const foundNote = await handleGetNoteById(id);
    if (foundNote) setSelectedNote(foundNote);
  }

  async function handleReorder(draggedNote: NoteType, targetNote: NoteType) {
    // Explanation of calculating new order of dragged note:
    // Using an interview question technique I heard from a collegue to reorder.
    // If we want to move note at order A after note at order D, we get the midpoint of order D and E and set that as the order of
    // the original note (i.e. the note originally with order A). This allows to reorder withiut changing order of other notes.
    // For example, if note originally has order 4 and user moves it after 9, we set the new order of the note as (9 + 10) / 2
    // Getting note adjacent to target note.

    let adjacentNote;
    let newOrder;

    // Case when draggedNote order is originally greater than target note (so dragging the draggedNote "down". Example note with order 4 is being dragged to note with order 3.)
    if (draggedNote.order > targetNote.order) {
      adjacentNote =
        notes[notes.findIndex((note) => note.id === targetNote.id) + 1]; // +1 as we are in desscending order and note is being dragged down so we get midppoint between target note and the note after that in descending order. Example, note with order 4 being dragged down to note with order 3, and the next item will be note with order 2. So dragged row order will change to 2.5 ((3+2) / 2)

      // Calculating new order of dragged note accorrding to logic written above
      // Explanation for the else ternary is at the bottom of the file
      newOrder = adjacentNote
        ? (adjacentNote?.order + targetNote.order) / 2
        : notes?.[notes?.length - 1]?.order / 2;
    } else {
      // Else block logic explained below
      adjacentNote =
        notes[notes.findIndex((note) => note.id === targetNote.id) - 1];
      newOrder = adjacentNote
        ? (adjacentNote?.order + targetNote.order) / 2
        : notes?.[0]?.order + 1;
    }

    await handleUpsertNote({ ...draggedNote, order: newOrder });
  }

  useEffect(() => {
    handleGetNotes();
  }, []);

  useEffect(() => {
    if (!selectedNote) setSelectedNote(notes?.[0]);
  }, [notes]);

  return {
    notes,
    isLoading,
    error,
    handleUpsertNote,
    handleGetNoteById,
    selectedNote,
    handleSelectNote,
    handleReorder,
    deleteNote,
  };
};

export default useStorage;

// Explanation of ternary insid ethe handleReorder (i.e       : notes?.[notes?.length]?.order / 2;)
// Our notes are ordered in a descending manner in the global state. Example:

// [
//      {
//     "id": "cc7f9129-5a36-461b-b9ce-a68c1ed830d8",
//     "order": 1,
//     "title": "3"
// },
// {
//     "id": "0794591e-98cb-4d10-b95d-18cef8da16b5",
//     "order": 0,
//     "title": "4"
// },
// {
//     "id": "110e7ef5-c522-42ef-98ac-67c491813700",
//     "order": 0,
//     "title": "1"
// },
// {
//     "id": "170d144c-1f10-4272-8720-f57ecda846b6",
//     "order": null,
//     "title": "2"
// }
//   ]

// If we don't find a noteAfterTargetNote, that implies that we want to drag the selectedNote to the bottom. So we need to find the last note and change the order of the dragged note lesser than the last note
// We subtracted 1 from notes.length (notes?.length - 1) because our order is 1 based, not 0 based

// Else block logic
// else {
//       adjacentNote =
//         notes[notes.findIndex((note) => note.id === targetNote.id) - 1];
//       newOrder = adjacentNote
//         ? (adjacentNote?.order + targetNote.order) / 2
//         : notes?.[0]?.order + 1;
//     }

// Getting adjacentNote
