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
}: {
  result: SearchResult;
  isFocused: boolean;
}) => {
  const { endIndex, field, note, query, startIndex } = result;
  const substring = (note?.[field] as string)?.substring(
    startIndex,
    endIndex + 1,
  );
  const stringArr = substring.split(new RegExp(`(${query})`, "gi"));
  return (
    <div
      className={`p-4 hover:bg-surface mb-2 ${isFocused ? "bg-surface" : ""}`}
    >
      <div>{note?.title || "Untitled"}</div>
      <small>
        ...
        {stringArr?.map((item) => (
          <>
            {item?.toLowerCase() === query?.toLowerCase() ? (
              <span className="bg-red-300">{item}</span>
            ) : (
              <>{item}</>
            )}
          </>
        ))}
        ...
      </small>
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

  useOnClickOutside(ref, handleOnClickOutside);
  return (
    <div className="search__modal" ref={ref}>
      <input autoFocus onChange={handleSearch} onKeyDown={onKeyDown} />
      {results?.length ? (
        <div className="h-fit max-h-96 w-full bg-surface-2 overflow-y-auto">
          {results.map((result: SearchResult, index) => (
            <ResultRow
              result={result}
              key={result?.note?.id}
              isFocused={index === focusedNoteIndx}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Search;
