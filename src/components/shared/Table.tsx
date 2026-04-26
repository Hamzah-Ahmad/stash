import { useCallback, useEffect, useState } from "react";
import type { NoteType } from "../../utils/db";

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
  // const inputRef = useRef<any>(null);

  function handleSort(col: Column<T>) {
    // if (!col.sortable) return;
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

      return {
        ...row,
        [col.id]: e?.target?.value,
      };
    });

    handleChange("table", JSON.stringify({ columns, rows: newData }));
  }

  function handleColChange(e: any, col: any) {
    const updatedColumns = columns.map((item) => {
      if (item.id !== col.id) return item;
      return {
        ...col,
        header: e.target?.value,
      };
    });

    handleChange("table", JSON.stringify({ columns: updatedColumns, rows }));
  }

  function handleAddColumn() {
    const newColumn = {
      id: `col-${columns.length + 1}`,
      header: "",
    };

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
        const valA = a?.[key] as number;
        const valB = b?.[key] as number;
        return value === SortDirection.DESC ? valB - valA : valA - valB;
      });
    }
    setVisibleRows(tempRows?.slice(offset, nextPageOffset)); // rows.slice(offset, nextPageOffset)
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

  return (
    <>
      <button onClick={() => handleAddColumn()}>Add Column</button>
      <button onClick={() => handleAddRow()}>Add Row</button>
      <table>
        <thead>
          <tr>
            {columns.map((col) => {
              const styles = {
                minWidth: col.minWidth ?? "150px",
                maxWidth: col.maxWidth ?? "300px",
                border: "2px solid green",
                minHeight: "100px",
              };
              return (
                <th
                  style={styles}
                  key={col.id}
                  onClick={() => {
                    handleSort(col);
                  }}
                >
                  <input
                    defaultValue={col.header}
                    onChange={(e) => handleColChange(e, col)}
                  />
                  {"^"}
                </th>
              );
            })}
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
                    className={`text-center`}
                    onChange={(e) => handleInput(e, rowItem, col)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndx, colIndx)}
                    defaultValue={String(rowItem[col.id] ?? "—")}
                    ref={isEditingCell ? inputRef : undefined} // This is a shot in the dark, it worked but need to test performance
                  />
                ); //String(rowItem[col.id] ?? "—");
                return (
                  <td className="py-4 text-center border-thin">
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 10 && (
        <div>
          <button
            disabled={pageIndex < 1}
            onClick={() => setPageIndex(pageIndex - 1)}
          >
            Prev
          </button>
          <button
            disabled={nextPageOffset >= total}
            onClick={() => setPageIndex(pageIndex + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default Table;

// Explanations
////////////////////
// handleEnter code below with comments
//  if (e.code === "Enter") {
//       // rowIndx + offset refers to the curent row index and page (so 0 row index is the first row, and if offset is 10 then that means 1st row on the SECOND page)
//       // The line below setsEditing cell to the row AFTER the current row (hence the +1)
//       setEditingCell([rowIndx + offset + 1, colIndx]);

//       // Subtracting 1 as index is 0 based. So for example (consider offset 0 as on first page), if there are 3 rows and we're on the last row
//       // that will be rowIndex 2. We need to add a new row in this case. So the logic is 2 + 0 === 3 - 1.
//       if (rowIndx + offset  === rows.length - 1) { // If
//         handleAddRow();
//       }
//     }

// More explanations
// I'm adding rowIndex with offset when comparing in multiple places, because rowIndex starts at 0 for each page
//  so if rows length is 17 for example, then there will be three pages and we'll need to add the offset to compare properly
//  for example on the second page rowIndex 2 will be 2 + 10 (10 being the offset), in order to properly compare against
//  rows.length (17). Same logic for when setting editingCell (on second page if we press enter on the 11th row it should lead to
// (rowIndex + offset) + 1 => (1 + 10) + 1 => 12th row
