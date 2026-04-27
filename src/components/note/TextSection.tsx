import ReactQuill from "react-quill-new";
import type { NoteType } from "../../utils/db";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

import "react-quill-new/dist/quill.snow.css";

const TextSection = ({
  handleChange,
  selectedNote
}: {
  handleChange: (field: keyof NoteType, value: string) => Promise<any>;
  selectedNote: NoteType
}) => {
  const [text, setText] = useState(selectedNote?.text);
  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    handleChange("text", debouncedText || "");
  }, [debouncedText]);

  useEffect(() => {
    setText(selectedNote?.text || "")
  }, [selectedNote?.id]);

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
