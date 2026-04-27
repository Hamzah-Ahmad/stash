import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import type { SearchResult } from "./SearchWrapper";
import { useStorageContext } from "../../context/StorageContext";

type SearchProps = {
  onClose: () => void;
  search: (query: string) => any;
};

const ResultRow = ({
  result,
  isFocused,
  handleClick,
}: {
  result: SearchResult;
  isFocused: boolean;
  handleClick: (id: string) => void;
}) => {
  const { endIndex, field, note, query, startIndex } = result;
  let substring = (note?.[field] as string)?.substring(
    startIndex,
    endIndex + 1,
  );
  // React-quill saves the text as html.
  // The if block removes html like tags, and removes the &nbsp; with a space. Not perfect, but gets the job done
  if (field === "text") {
    substring = substring.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ");
  }
  const stringArr = substring.split(new RegExp(`(${query})`, "gi"));
  return (
    <div
      className={`p-4 hover:bg-surface mb-2 ${isFocused ? "bg-surface" : ""}`}
      onClick={() => handleClick(note.id)}
    >
      <div className="text-xl">{note?.title || "Untitled"}</div>
      <div className="text-base">
        ..
        {stringArr?.map((item) => (
          <>
            {item?.toLowerCase() === query?.toLowerCase() ? (
              <span className="font-extrabold text-secondary">{item}</span>
            ) : (
              <>{item}</>
            )}
          </>
        ))}
        ..
      </div>
    </div>
  );
};
const Search = ({ onClose, search }: SearchProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { handleSelectNote } = useStorageContext();

  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [focusedNoteIndx, setFocusedNoteIndx] = useState<number>(-1);

  function handleSearch(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const searchResults = search(e.target?.value);
    if (Array.isArray(searchResults)) {
      setResults(searchResults);
    }
  }

  useEffect(() => {
    setFocusedNoteIndx(-1);
  }, [results]);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      setFocusedNoteIndx((prev) => {
        if (prev === null || prev === -1) return prev;
        return prev - 1;
      });
    }

    if (e.key === "ArrowDown") {
      setFocusedNoteIndx((prev) => {
        if (!results?.length || prev === results?.length - 1) return prev;
        return prev + 1;
      });
    }

    if (e.key === "Enter") {
      const foundResult = results?.[focusedNoteIndx];
      if (foundResult && foundResult?.note) {
        handleSelectNote(foundResult.note?.id);
        onClose();
      }
    }
  }

  function handleOnClickOutside() {
    setResults([]);

    onClose();
  }

  function handleClickRow(noteId: string) {
    handleSelectNote(noteId);
    onClose();
  }

  useOnClickOutside(ref, handleOnClickOutside);
  return (
    <div className="search__overlay">
    <div className="search__bar" ref={ref}>
      <input autoFocus onChange={handleSearch} onKeyDown={onKeyDown} />
      {results?.length ? (
        <div className="h-fit max-h-52 w-full bg-surface-2 overflow-y-auto absolute mt-2 rounded-radius">
          {results.map((result: SearchResult, index) => (
            <ResultRow
              handleClick={handleClickRow}
              result={result}
              key={result?.note?.id}
              isFocused={index === focusedNoteIndx}
            />
          ))}
        </div>
      ) : null}
    </div>
    </div>
  );
};

export default Search;
