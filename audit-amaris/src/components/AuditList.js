// import React from 'react';

// const AuditList = ({ allAudits, createNewAudit, selectAudit, calculateProgress }) => {
//   return (
//     <div className="p-5 bg-white">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Mes Audits</h2>
//         <button
//           onClick={createNewAudit}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
//         >
//           + Nouvel Audit
//         </button>
//       </div>
//       <div className="grid gap-4">
//         {allAudits.map(audit => (
//           <div
//             key={audit.id}
//             className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//             onClick={() => selectAudit(audit)}
//           >
//             <div className="flex justify-between items-start mb-2">
//               <h3 className="text-lg font-semibold text-blue-700">{audit.title}</h3>
//               <span className={`px-3 py-1 rounded text-sm font-medium ${audit.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                 {audit.status}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
//               <div><strong>Auditeur:</strong> {audit.auditor}</div>
//               <div><strong>Date:</strong> {new Date(audit.date).toLocaleDateString('fr-FR')}</div>
//               <div><strong>Audité:</strong> {audit.auditee || 'Non défini'}</div>
//               <div><strong>Taux de conformités:</strong> {calculateProgress(audit.items, audit.technical)}%</div>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div
//                 className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                 style={{ width: `${calculateProgress(audit.items, audit.technical)}%` }}
//               ></div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AuditList; 