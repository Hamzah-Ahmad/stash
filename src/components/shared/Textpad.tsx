import type { NoteType } from "../../utils/db";

const Textpad = ({
  handleChange,
  defaultValue
}: {
  handleChange: (field: keyof NoteType, value: string) => Promise<any>;
  defaultValue?: string
}) => {

  
  return (
    <textarea
      defaultValue={defaultValue}
      className="border border-light w-full rounded-radius p-3"
      onChange={(e) => handleChange("text", e.target?.value)}
      rows={10}
    />
  );
};

export default Textpad;
