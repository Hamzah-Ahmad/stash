import { useMemo } from "react";
import type { NoteType } from "../../utils/db";
import Table from "../shared/Table";

type TableSectionProps = {
  selectedNote: NoteType;
  handleChange: (field: keyof NoteType, value: string) => Promise<any>;
};
const defaultColumns = [
  {
    id: "col-1",
    header: "",
  },
  {
    id: "col-2",
    header: "",
  },
];
const defaulRows = [
  { id: 1, "col-1": "", "col-2": "" },
  { id: 2, "col-1": "", "col-2": "" },
];
const TableSection = ({ selectedNote, handleChange }: TableSectionProps) => {
  const tableData = selectedNote?.table
    ? JSON.parse(selectedNote.table)
    : undefined;

  const columns = useMemo(
    () => (tableData ? tableData.columns : defaultColumns),
    [tableData?.columns],
  );
  const rows = useMemo(
    () => (tableData ? tableData.rows : defaulRows),
    [tableData?.rows],
  );

  return <Table key={selectedNote?.id} columns={columns} rows={rows} handleChange={handleChange} />;
};

export default TableSection;
