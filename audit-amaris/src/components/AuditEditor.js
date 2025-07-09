import React from 'react';
import AuditTable from './AuditTable';

const AuditEditor = ({
  currentAudit,
  updateCurrentAudit,
  createNewAudit,
  selectedRow,
  setSelectedRow,
  editingComment,
  setEditingComment,
  updateComment,
  getResponseClass,
  setResponse,
}) => {
  if (!currentAudit) {
    return (
      <div className="p-5 bg-white text-center">
        <h3 className="text-xl text-gray-600 mb-4">Aucun audit sélectionné</h3>
        <button
          onClick={createNewAudit}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Créer un nouvel audit
        </button>
      </div>
    );
  }

  const { items = [], technical = [] } = currentAudit;

  return (
    <div className="p-5 bg-gray-50 min-h-[75vh] relative">
      <div className="mb-4 p-4 bg-gray-50 rounded">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'audit</label>
            <input
              type="text"
              value={currentAudit.title}
              onChange={e => updateCurrentAudit({ ...currentAudit, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Audité</label>
            <input
              disabled
              type="text"
              value="Ayoub BEN KHIROUN"
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 text-gray-700"
            />
          </div>
        </div>
      </div>

      <h3 className="text-gray-700 mb-2 text-lg"> Points à auditer </h3>
      <AuditTable
        title="Modélisation"
        items={items}
        tableKey="model"
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        updateComment={updateComment}
        getResponseClass={getResponseClass}
      />
      <AuditTable
        title="Migration"
        items={technical}
        tableKey="tech"
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        updateComment={updateComment}
        getResponseClass={getResponseClass}
      />

      <div
        className="fixed left-0 right-0 bottom-0 z-40 bg-white border-t border-gray-200 shadow flex flex-col items-center py-3"
        style={{ transition: 'box-shadow 0.2s' }}
      >
        <div className="mb-1 text-sm text-gray-600 text-center">
          {selectedRow.index !== null ? (
            <span>
              {selectedRow.table === 'model' ? 'Modélisation' : 'Migration'} — Ligne {selectedRow.index + 1} :
              Cliquez sur un bouton ci-dessous pour définir la réponse
            </span>
          ) : (
            <span>Sélectionnez une ligne pour définir sa réponse</span>
          )}
        </div>
        <div className="flex justify-center gap-4 items-center flex-wrap">
          <button
            className={`flex flex-col items-center gap-1 p-3 border border-green-500 bg-white cursor-pointer rounded text-green-600 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedRow.index === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={() => setResponse('OK')}
            disabled={selectedRow.index === null}
            title="Conforme"
          >
            <span className="text-xl">👍</span>
            <span className="text-sm">OK</span>
          </button>
          <button
            className={`flex flex-col items-center gap-1 p-3 border border-yellow-500 bg-white cursor-pointer rounded text-yellow-600 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedRow.index === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={() => setResponse('NOT OK')}
            disabled={selectedRow.index === null}
            title="Non conforme"
          >
            <span className="text-xl">👎</span>
            <span className="text-sm">NOT OK</span>
          </button>
          <button
            className={`flex flex-col items-center gap-1 p-3 border border-gray-500 bg-white cursor-pointer rounded text-gray-600 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedRow.index === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={() => setResponse('NA')}
            disabled={selectedRow.index === null}
            title="Non applicable"
          >
            <span className="text-xl">🚫</span>
            <span className="text-sm">NA</span>
          </button>
          <button
            className={`flex flex-col items-center gap-1 p-3 border border-blue-500 bg-white cursor-pointer rounded text-blue-600 transition-all hover:-translate-y-1 hover:shadow-lg ${selectedRow.index === null ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            onClick={() => setEditingComment(selectedRow)}
            disabled={selectedRow.index === null}
            title="Ajouter un commentaire"
          >
            <span className="text-xl">💬</span>
            <span className="text-sm">Commentaire</span>
          </button>
        </div>
      </div>
      <div className="pb-32" />
    </div>
  );
};

export default AuditEditor; 