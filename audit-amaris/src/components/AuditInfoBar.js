import React from 'react';

const AuditInfoBar = ({ currentAudit, calculateProgress, imageAmaris }) => {
  return (
    <div className="bg-blue-500 text-white px-5 py-2 text-sm flex items-center justify-between">
      <div>
        {currentAudit.title} | Auditeur : {currentAudit.auditor} | Audité : {currentAudit.auditee || 'Non défini'} | Taux de conformités : {calculateProgress(currentAudit.items, currentAudit.technical)}% | Statut : {currentAudit.status}
      </div>
      <img src={imageAmaris} alt="Logo Amaris" className="h-6 ml-4" />
    </div>
  );
};

export default AuditInfoBar; 