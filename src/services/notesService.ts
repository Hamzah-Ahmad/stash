import { addNote, getNoteById, getNotes, type NoteType } from "../utils/db";

export const noteService = {
  getAll: async (): Promise<NoteType[]> => {
    try {
      const data = await getNotes();
      return data;
    } catch (err) {
      throw new Error("Failed to fetch notes", { cause: err });
    }
  },

  create: async (note: Partial<NoteType>): Promise<void> => {
    try {
      return await addNote(note);
    } catch (err) {
      throw new Error("Failed to create note", { cause: err });
    }
  },

  getById: async (id: string): Promise<NoteType | undefined> => {
    try {
      return await getNoteById(id);
    } catch (err) {
      throw new Error("Failed to create note", { cause: err });
    }
  },
};
