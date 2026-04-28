import {
  upsertNote,
  getNoteById,
  getNotes,
  deletNote,
  type NoteType,
} from "../utils/db";

export const noteService = {
  getAll: async (): Promise<NoteType[]> => {
    try {
      const data = await getNotes();
      return data;
    } catch (err) {
      throw new Error("Failed to fetch notes", { cause: err });
    }
  },

  upsert: async (note: Partial<NoteType> | undefined): Promise<void> => {
    try {
      return await upsertNote(note);
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

  delete: async (id: string): Promise<void> => {
    try {
      await deletNote(id);
    } catch (err) {
      throw new Error("Failed to create note", { cause: err });
    }
  },
};
