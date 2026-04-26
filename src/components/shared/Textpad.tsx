import type { NoteType } from "../../utils/db";

const Textpad = ({
  handleChange,
  value
}: {
  handleChange: (field: keyof NoteType, value: string) => Promise<any>;
  value?: string
}) => {

  
  return (
    <textarea
      value={value}
      className="border border-red w-full rounded-radius p-3"
      onChange={(e) => handleChange("text", e.target?.value)}
      rows={10}
    />
  );
};

export default Textpad;
