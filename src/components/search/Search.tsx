import { useRef, useState, type ChangeEvent } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import type { SearchResult } from "./SearchWrapper";

type SearchProps = {
  onClose: () => void;
  search: (query: string) => any;
};

const ResultRow = ({ result }: { result: SearchResult }) => {
  const { endIndex, field, note, query, startIndex } = result;
  const substring = (note?.[field] as string)?.substring(
    startIndex,
    endIndex + 1,
  );

  const stringArr = substring.split(new RegExp(`(${query})`, "gi"));
  console.log("LOGGER - stringArr: ", {stringArr, result})
  return (
    <div className="p-4">
      <div>{note?.title || "Untitled"}</div>
      <small>
        ...{stringArr?.map((item) => (
          <>
            {item?.toLowerCase() === query?.toLowerCase() ? (
              <span className="bg-red-300">{item}</span>
            ) : (
              <>{item}</>
            )}
          </>
        ))}...
      </small>
    </div>
  );
};
const Search = ({ onClose, search }: SearchProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [results, setResults] = useState<SearchResult[] | null>(null);

  function handleSearch(e: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    const searchResults = search(e.target?.value);
    if (Array.isArray(searchResults)) {
      setResults(searchResults);
    }
  }

  function handleOnClickOutside() {
    setResults([]);

    onClose();
  }

  useOnClickOutside(ref, handleOnClickOutside);
  return (
    <div className="search-modal" ref={ref}>
      <input autoFocus onChange={handleSearch} />
      {results?.length ? (
        <div className="h-fit w-full bg-surface-2">
          {results.map((result: SearchResult) => (
            <ResultRow result={result} key={result?.note?.id} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Search;
