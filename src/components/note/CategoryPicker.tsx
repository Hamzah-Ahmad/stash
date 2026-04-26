import type { Dispatch, SetStateAction } from "react";
import { NoteCategory } from "./Note";

const CategoryPicker = ({
  setCategory,
}: {
  setCategory: Dispatch<SetStateAction<NoteCategory>>;
}) => {
  return (
    <div className="flex gap-4 w-full mb-2">
      {Object.values(NoteCategory)?.map((cat: NoteCategory) => (
        <button
          className="bg-primary px-4 py-2 rounded-radius"
          onClick={() => setCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryPicker;
