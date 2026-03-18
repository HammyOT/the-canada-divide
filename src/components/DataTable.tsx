interface DataTableProps {
  caption: string;
  source: string;
  columns: string[];
  rows: string[][];
  highlightRows?: number[];
}

export function DataTable({ caption, source, columns, rows, highlightRows = [] }: DataTableProps) {
  return (
    <div className="data-table-wrapper">
      <figure className="data-table-figure">
        <figcaption className="data-table-caption">{caption}</figcaption>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className={i === 0 ? 'text-left' : 'text-right'}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className={highlightRows.includes(ri) ? 'data-table-row-highlight' : ''}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={ci === 0 ? 'text-left font-medium' : 'text-right tabular-nums'}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="data-table-source">Source: {source}</p>
      </figure>
    </div>
  );
}
