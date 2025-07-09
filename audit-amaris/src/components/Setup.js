import React from 'react';

const Setup = ({ setupData, setSetupData, domains, departments, completeAuditSetup }) => {
  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-center text-blue-700">Initialiser un Nouvel Audit</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Audité</label>
          <select
            value={setupData.auditee}
            onChange={e => setSetupData({ ...setupData, auditee: e.target.value })}
            className="w-full p-2 border rounded"
            disabled
          >
            <option value="Ayoub BEN KHIROUN">Ayoub BEN KHIROUN</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Domaine </label>
          <select
            value={setupData.type}
            onChange={e => setSetupData({ ...setupData, type: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Sélectionnez le domaine--</option>
            {domains.map(dom => (
              <option key={dom} value={dom}>{dom}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Processus</label>
          <select
            value={setupData.department}
            onChange={e => setSetupData({ ...setupData, department: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Sélectionnez le processus --</option>
            {departments.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <div className="pt-4 text-center">
          <button
            disabled={!setupData.type || !setupData.department}
            onClick={completeAuditSetup}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setup; 