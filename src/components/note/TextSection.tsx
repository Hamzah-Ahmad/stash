import ReactQuill from "react-quill-new";
import type { NoteType } from "../../utils/db";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

import "react-quill-new/dist/quill.snow.css";

const TextSection = ({
  handleChange,
  value,
  selectedNote
}: {
  handleChange: (field: keyof NoteType, value: string) => Promise<any>;
  value?: string;
  selectedNote: NoteType
}) => {
  const [text, setText] = useState("");
  const debouncedText = useDebounce(text, 100);

  useEffect(() => {
    if (debouncedText === value) return;
    handleChange("text", debouncedText || "");
  }, [debouncedText]);

  useEffect(() => {
    setText(value || "");
  }, [value]);

  // return <textarea value={text} />
  return (
    <ReactQuill
      key={selectedNote?.id}
      theme="snow"
      value={text}
      onChange={(val) => setText(val)}
      className="quill__custom"
      modules={{
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
          ["clean"],
        ],
      }}
    />
  );
};

export default TextSection;
