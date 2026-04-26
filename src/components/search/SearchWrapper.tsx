import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Search from "./Search";
import useStorage from "../../hooks/useStorage";
import type { NoteType } from "../../utils/db";
import { NoteCategory } from "../note/Note";

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
  const { notes } = useStorage();

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
              startIndex: Math.max(index - 10, 0),
              endIndex: Math.min(
                String(note?.[field] ?? "").length - 1,
                index + 10,
              ),
              query,
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
