const DB_NAME = "stash_storage";
const DB_VERSION = 1;
const STORE_NAME = "stash_items";

export type NoteType = {
  id: string;
  order: number;
  title?: string;
  text?: string;
  code?: string;
  table?: string;
};

export async function setupDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        // store.createIndex("text", "text", { unique: false }); // Not creating indexed because we want to search via partial word as well which isnt possible with indexed values
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getNotes(searchQuery?: string): Promise<NoteType[]> {
  const db = await setupDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    // const notes = request.result?.filter(());

    request.onsuccess = () => {
      let results = request.result as NoteType[];
      if (searchQuery) {
        results = results.filter((note) => {
          if (!note.title) return false;
          return note.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }

      resolve(results);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getNoteById(id: string): Promise<NoteType | undefined> {
  if (!id) return;
  const db = await setupDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function upsertNote(
  noteDto: Partial<NoteType> = {},
): Promise<void> {
  const db = await setupDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    if (!noteDto.id) noteDto.id = crypto.randomUUID();
    const request = store.put(noteDto);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deletNote(id: string): Promise<void> {
  if (!id) return;
  const db = await setupDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
