import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/base16-dark.css";
import type { NoteType } from "../../utils/db";

type CodeSectionProps = {
  onChange: (val: string) => Promise<any>;
  selectedNote: NoteType;
};
const CodeSection = ({ onChange, selectedNote }: CodeSectionProps) => {
  const value = selectedNote?.code;
  return (
    <CodeMirror
      key={selectedNote?.id}
      value={value || ""}
      onBeforeChange={(_editor, _data, value) => {
        onChange(value);
      }}
      // onChange={setCode}
      options={{
        lineWrapping: true,
        mode: "javascript",
        lineNumbers: true,
        theme: "base16-dark",
      }}
    />
  );
};

export default CodeSection;
