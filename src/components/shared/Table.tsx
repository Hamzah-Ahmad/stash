import { useCallback, useEffect, useState } from "react";
import type { NoteType } from "../../utils/db";
import { ChevronLeftIcon, ChevronRightIcon, SortAscIcon, SortDescIcon, SortIcon } from "./Icons";

export type Column<T> = {
  id: string;
  header: string;
  cellRenderer?: (data: T) => React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
};

export const SortDirection = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type TableProps<T> = {
  rows: T[];
  columns: Column<T>[];
  handleChange: (field: keyof NoteType, value: string) => Promise<any>;
};

const Table = <T extends Record<string, unknown> & { id: string | number }>({
  //@ts-ignore
  columns,
  //@ts-ignore
  rows,
  handleChange,
}: TableProps<T>) => {
  const [visibleRows, setVisibleRows] = useState<T[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const limit = 10;
  const offset = pageIndex * limit;
  const total = rows?.length;
  const nextPageOffset = offset + limit;
  const [sortConfig, setSortConfig] = useState<Record<string, string>>({});
  const [editingCell, setEditingCell] = useState([0, 0]);

  function handleSort(col: Column<T>) {
    if (sortConfig?.[col.id]) {
      setSortConfig((prev) => ({
        [col.id]:
          prev[col.id] === SortDirection?.ASC
            ? SortDirection.DESC
            : SortDirection.ASC,
      }));
    } else {
      setSortConfig(() => ({
        [col.id]: SortDirection?.ASC,
      }));
    }
  }

  function handleInput(e: any, row: any, col: any) {
    let newData = rows?.map((item) => {
      if (item.id != row.id) return item;
      return { ...row, [col.id]: e?.target?.value };
    });
    handleChange("table", JSON.stringify({ columns, rows: newData }));
  }

  function handleColChange(e: any, col: any) {
    const updatedColumns = columns.map((item) => {
      if (item.id !== col.id) return item;
      return { ...col, header: e.target?.value };
    });
    handleChange("table", JSON.stringify({ columns: updatedColumns, rows }));
  }

  function handleAddColumn() {
    const newColumn = { id: `col-${columns.length + 1}`, header: "" };
    handleChange(
      "table",
      JSON.stringify({ columns: [...columns, newColumn], rows }),
    );
  }

  function handleAddRow() {
    let newRow: Record<string, string | number> = {
      id: (rows?.length || 0) + 1,
    };
    columns.map((col) => {
      newRow[col.id] = "";
    });
    handleChange("table", JSON.stringify({ rows: [...rows, newRow], columns }));
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndx: number,
    colIndx: number,
  ) {
    if (e.code === "Enter") {
      // rowIndx + offset refers to the curent row index and page (so 0 row index is the first row, and if offset is 10 then that means 1st row on the SECOND page)
      // The line below setsEditing cell to the row AFTER the current row (hence the +1)
      setEditingCell([rowIndx + offset + 1, colIndx]);

      // Subtracting 1 as index is 0 based. So for example (consider offset 0 as on first page), if there are 3 rows and we're on the last row
      // that will be rowIndex 2. We need to add a new row in this case. So the logic is 2 + 0 === 3 - 1.
      if (rowIndx + offset === rows.length - 1) {
        // If
        handleAddRow();
      }
      if (rowIndx === 9) {
        setPageIndex((prev) => prev + 1);
      }
    }
  }

  useEffect(() => {
    let tempRows = [...rows];
    for (const [key, value] of Object.entries(sortConfig)) {
      tempRows = tempRows.sort((a, b) => {
        const valA = a?.[key] as any;
        const valB = b?.[key] as any;
        if (typeof valA === "number" && typeof valB === "number")
          return value === SortDirection.DESC ? valB - valA : valA - valB;
        else {
          return value === SortDirection.DESC
            ? valB.localeCompare(valA)
            : valA.localeCompare(valB);
        }
      });
    }
    setVisibleRows(tempRows?.slice(offset, nextPageOffset));
  }, [pageIndex, rows, sortConfig]);

  // useEffect(() => {
  //   if (editingCell && inputRef?.current) {
  //     inputRef?.current?.focus();
  //   }
  // }, [editingCell]);

  // useEffect aove ws mostly working but wasn't firing when inputRef changes
  // callbackRefs is a good usecase for this
  // https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
  const inputRef = useCallback(
    (node: any) => {
      node?.focus();
    },
    [editingCell],
  );

  const getSortIcon = (colId: string) => {
    if (!sortConfig[colId]) return <SortIcon />;
    return sortConfig[colId] === SortDirection.ASC ? (
      <SortAscIcon />
    ) : (
      <SortDescIcon />
    );
  };

  return (
    <div className="table-wrapper">
      <div className="table-scroll-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.id}
                  style={{
                    minWidth: col.minWidth ?? "160px",
                    maxWidth: col.maxWidth ?? "320px",
                  }}
                  onClick={() => handleSort(col)}
                >
                  <div className="th-inner">
                    <input
                      className="th-input"
                      defaultValue={col.header}
                      placeholder="Column name"
                      onChange={(e) => handleColChange(e, col)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="sort-icon">{getSortIcon(col.id)}</span>
                  </div>
                </th>
              ))}
              {/* Add column button as last "column" */}
              <th className="add-col-th">
                <button
                  className="add-col-btn"
                  onClick={handleAddColumn}
                  title="Add column"
                >
                  <PlusIcon />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows?.map((rowItem: T, rowIndx) => (
              <tr key={rowItem.id || rowIndx}>
                {columns.map((col, colIndx) => {
                  const isEditingCell =
                    editingCell[0] === rowIndx + offset &&
                    editingCell[1] === colIndx;
                  const value = col.cellRenderer ? (
                    col.cellRenderer(rowItem)
                  ) : (
                    <input
                      className="cell-input"
                      onChange={(e) => handleInput(e, rowItem, col)}
                      onKeyDown={(e) => handleKeyDown(e, rowIndx, colIndx)}
                      defaultValue={String(rowItem[col.id] ?? "")}
                      ref={isEditingCell ? inputRef : undefined}
                    />
                  );
                  return (
                    <td
                      key={col.id}
                      onClick={() =>
                        setEditingCell([rowIndx + offset, colIndx])
                      }
                    >
                      {value}
                    </td>
                  );
                })}
                <td className="add-col-th" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > 10 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pageIndex < 1}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            <ChevronLeftIcon /> Prev
          </button>
          <span className="page-info">
            Page {pageIndex + 1} of {Math.ceil(total / limit)}
          </span>
          <button
            className="page-btn"
            disabled={nextPageOffset >= total}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Next <ChevronRightIcon />
          </button>
        </div>
      )}
    </div>
  );
};


const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  >
    <line x1="7" y1="2" x2="7" y2="12" />
    <line x1="2" y1="7" x2="12" y2="7" />
  </svg>
);

export default Table;
