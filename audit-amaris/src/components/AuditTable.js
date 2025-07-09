import React from 'react';

const AuditTable = ({
  title,
  items,
  tableKey,
  selectedRow,
  setSelectedRow,
  editingComment,
  setEditingComment,
  updateComment,
  getResponseClass,
}) => {
  return (
    <div className="border border-gray-300 rounded overflow-hidden mb-5 bg-white">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-gray-50 p-3 text-left border-b border-gray-300 font-bold text-gray-700 w-12">NO</th>
            <th className="bg-gray-50 p-3 text-left border-b border-gray-300 font-bold text-gray-700 w-2/5">RÈGLE</th>
            <th className="bg-gray-50 p-3 text-left border-b border-gray-300 font-bold text-gray-700 w-20">RÉPONSE</th>
            <th className="bg-gray-50 p-3 text-left border-b border-gray-300 font-bold text-gray-700">COMMENTAIRE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="text-center border-b border-gray-300 py-1 text-sm  text-gray-500 font-bold">{title}</td>
          </tr>
          {items.map((item, idx) => (
            <tr
              key={idx}
              className={`cursor-pointer border-b border-gray-200 transition-colors ${selectedRow.table === tableKey && selectedRow.index === idx ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'
                }`}
              onClick={() => setSelectedRow({ table: tableKey, index: idx })}
            >
              <td className="p-3 font-medium">{item.no}</td>
              <td className="p-3">
                <input
                  disabled
                  type="text"
                  value={item.question}
                  className={`w-full p-2 border rounded transition-colors ${selectedRow.table === tableKey && selectedRow.index === idx
                    ? 'bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-gray-200'
                    : 'border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none'
                    }`}
                  onClick={e => e.stopPropagation()}
                />
              </td>
              <td className="p-3">
                {item.response ? (
                  <span className={`inline-block px-3 py-2 rounded text-sm font-bold min-w-16 text-center ${selectedRow.table === tableKey && selectedRow.index === idx ? 'bg-white bg-opacity-20' : getResponseClass(item.response)
                    }`}>
                    {item.response}
                  </span>
                ) : (
                  <span className={`inline-block px-3 py-2 rounded text-sm text-center min-w-16 ${selectedRow.table === tableKey && selectedRow.index === idx ? 'text-gray-200' : 'text-gray-400'
                    }`}>
                    {selectedRow.table === tableKey && selectedRow.index === idx ? 'Sélectionner' : 'Pas de réponse'}
                  </span>
                )}
              </td>
              <td className="p-3">
                {editingComment.table === tableKey && editingComment.index === idx ? (
                  <input
                    type="text"
                    value={item.commentaire}
                    onChange={e => updateComment(tableKey, idx, e.target.value)}
                    onBlur={() => setEditingComment({ table: null, index: null })}
                    onKeyPress={e => { if (e.key === 'Enter') setEditingComment({ table: null, index: null }); }}
                    placeholder="Tapez votre commentaire ici..."
                    className={`w-full p-2 border rounded transition-colors ${selectedRow.table === tableKey && selectedRow.index === idx
                      ? 'bg-white bg-opacity-20 border-white border-opacity-50 text-white placeholder-gray-200'
                      : 'border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none'
                      }`}
                    autoFocus
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className={`text-sm cursor-pointer hover:underline ${selectedRow.table === tableKey && selectedRow.index === idx ? 'text-white' : 'text-gray-700'
                      }`}
                    onClick={e => {
                      e.stopPropagation();
                      setEditingComment({ table: tableKey, index: idx });
                    }}
                  >
                    {item.commentaire || 'Pas de commentaire'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable; 