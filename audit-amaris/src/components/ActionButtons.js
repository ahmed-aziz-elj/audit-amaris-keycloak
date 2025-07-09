const ActionButtons = ({ goBackToList, printAudit, terminateAudit, deleteAudit }) => {
  return (
    <div className="bg-gray-100 px-5 py-2 flex justify-center gap-3 border-b border-gray-300">
      <button
        className="px-3 py-1 border border-gray-400 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-colors"
        onClick={goBackToList}
      >
        ← Liste des audits
      </button>
      <button
        className="px-3 py-1 border border-gray-400 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-colors"
        onClick={printAudit}
      >
        Imprimer
      </button>
      <button
        className="px-3 py-1 border border-gray-400 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-colors"
        onClick={terminateAudit}
      >
        Terminer
      </button>
      <button
        className="px-3 py-1 border border-gray-400 bg-white cursor-pointer rounded text-xs hover:bg-gray-50 transition-colors"
        onClick={deleteAudit}
      >
        Supprimer
      </button>
    </div>
  );
};

export default ActionButtons; 