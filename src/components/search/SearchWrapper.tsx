import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Search from "./Search";
import type { NoteType } from "../../utils/db";
import { useStorageContext } from "../../context/StorageContext";

export type SearchResult = {
  index: number;
  note: NoteType;
  field: keyof NoteType;
  startIndex: number;
  endIndex: number;
  query: string;
};
export default function SearchWrapper() {
  const [showModal, setShowModal] = useState(false);

  // Adding search functionality here instead of the bar because this component renderes once.
  const { notes } = useStorageContext();

  function search(query: string): SearchResult[] {
    const trimmedQuery = query.toLowerCase()?.trim();
    if (!trimmedQuery) return [];

    const SEARCH_FIELDS: Array<keyof NoteType> = ["title", "text", "code"];
    const results = notes
      ?.map((note) => {
        let index;
        for (const field of SEARCH_FIELDS) {
          index = String(note?.[field] ?? "")
            .toLowerCase()
            .indexOf(trimmedQuery);
          if (index != null && index !== -1) {
            return {
              index,
              note,
              field,
              startIndex: Math.max(index - 20, 0), // want to show some text before nad after the highlighted text. This method is crude but gets the job done
              endIndex: Math.min(
                String(note?.[field] ?? "").length - 1,
                index + 20,
              ),
              query: trimmedQuery,
            };
          }
        }
      })
      ?.filter((item) => item !== undefined); // filter(Boolean) would work as well but typescript wasn't happy.
    return results;
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
      }

      if (e.key === " " && e.shiftKey) {
        setShowModal(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <> 
      {showModal &&
        createPortal(
          <Search onClose={() => setShowModal(false)} search={search} />,
          document.body,
        )}
    </>
  );
}
