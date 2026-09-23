import LoadingSpinner from './LoadingSpinner';

export default function Table({ columns, data, loading, emptyMessage = 'No records found.' }) {
  if (loading) {
    return (
      <div className="card p-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-850 border-b border-white/8">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="table-header">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row._id || i} className="hover:bg-white/2 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="table-cell">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
