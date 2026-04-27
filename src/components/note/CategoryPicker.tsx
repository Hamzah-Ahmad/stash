import type { Dispatch, ReactElement, SetStateAction } from "react";
import { NoteCategory } from "./Note";
import { CodeIcon, TableIcon, TextIcon } from "../shared/Icons";

const icons: Record<NoteCategory, ReactElement> = {
  text: <TextIcon />,
  table: <TableIcon />,
  code: <CodeIcon />,
};

const CategoryPicker = ({
  category,
  setCategory,
}: {
  category: NoteCategory;
  setCategory: Dispatch<SetStateAction<NoteCategory>>;
}) => {
  return (
    <div className="category-picker">
      {Object.values(NoteCategory).map((cat: NoteCategory) => (
        <button
          key={cat}
          className={`category-tab ${category === cat ? "active" : ""}`}
          onClick={() => setCategory(cat)}
          title={cat}
        >
          {icons[cat]}
        </button>
      ))}
    </div>
  );
};

export default CategoryPicker;