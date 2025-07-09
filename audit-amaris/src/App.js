import { useState , useEffect } from 'react';
import imageAmaris from './assets/image-amaris.png';
import imageBouyeges from './assets/image-bouygues.png';
import { CheckCircle, User, 
  Calendar, Plus, FileText, ArrowLeft, Printer, Trash2, 
  UserCheck, Gauge, BadgeInfo } from 'lucide-react';
import { keycloak, initKeycloak } from './components/keycloakService';

const AuditApp = () => {
  // ----------- AUTH STATE -----------
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ login: '', password: '' });

  // ----------- MAIN APP STATE -----------
  const [setupMode, setSetupMode] = useState(false);
  const [setupData, setSetupData] = useState({ auditee: '', type: '', department: '' });
  const [activeTab, setActiveTab] = useState('audits');
  const [selectedRow, setSelectedRow] = useState({ table: 'model', index: null });
  const [editingComment, setEditingComment] = useState({ table: null, index: null });
  const [, setCurrentAuditId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [allAudits, setAllAudits] = useState([
    {
      id: 1,
      title: 'AUDIT XXXXX',
      auditor: 'AHMED AZIZ ELJ',
      auditee: 'R&S PROJET X',
      date: '2025-06-15',
      status: 'En cours',
      items: [
        { no: 1, question: 'Nomenclature normalisée', response: 'OK', commentaire: 'Tous les documents sont à jour' },
        { no: 2, question: 'Utilisation des sous-processus', response: 'NOT OK', commentaire: 'Bien fait' },
        { no: 3, question: 'Utilisation correcte des gateways', response: 'OK', commentaire: '' },
        { no: 4, question: 'Événements de début et fin', response: 'NC', commentaire: 'Manque documentation' },
        { no: 5, question: 'Modèle lisible visuellement', response: '', commentaire: '' },
        { no: 6, question: 'Utilisation correcte des pools et lanes (participants)', response: 'OK', commentaire: '' },
        { no: 7, question: 'Documentation BPMN intégrée', response: 'NC', commentaire: 'A Mettre à jour' },
        { no: 8, question: 'Optimisation de la modélisation', response: 'OK', commentaire: '' }
      ],
      technical:
        [
          { no: 1, question: 'Mapping clair des erreurs attendues dans les connecteurs', response: 'OK', commentaire: 'Tous les documents sont à jour' },
          { no: 2, question: 'Tests de bout en bout', response: 'NOT OK', commentaire: 'Bien fait' },
          { no: 3, question: 'Intégration des formulaires de tâches utilisateur', response: 'OK', commentaire: '' },
          { no: 4, question: 'Mise en place d\'un système de retry dans les workers', response: 'NC', commentaire: 'Manque documentation' },
          { no: 5, question: 'Vérification des timeouts et durées d\'expiration des jobs', response: '', commentaire: '' },
          { no: 6, question: 'Validation avec métier', response: 'OK', commentaire: '' }
        ],
    }
  ]);
  const [currentAudit, setCurrentAudit] = useState(null);
  // ----------- KEYCLOAK AUTH STATE -----------
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  // Stocke les informations de l'utilisateur connecté
  const [userInfo, setUserInfo] = useState(null);
  const departments = [
    "DI FTTA",
    "DI ZTD",
    "DI CSG - TRANS FTTA",
    "DI RAN4",
    "DI FH",
    "DI DEMONTAGE RADIO",
    "DI VERCORS",
    "DI_CROZON",
    "VDR RADIO CZ",
    "AMBI MOBILE CZ",
    "AMBI MOBILE ZTD",
    "VDR FH",
    "RENO CZ",
    "DEMONT ROUT TRAP"
  ];
  const domains = [
    "Fixe",
    "Transport",
    "Mobile-Radio",
    "Mobile-Trans",
    "Transverse"
  ]

 // ----------- KEYCLOAK INITIALIZATION -----------
  useEffect(() => {
    const init = async () => {
      try {
        const authenticated = await initKeycloak();
        setAuthenticated(authenticated);
        setKeycloakInitialized(true);
        if (authenticated) {
          const profile = await keycloak.loadUserProfile();
          setUserInfo(profile);
        }
        console.log('Keycloak initialized, authenticated:', authenticated);
      } catch (err) {
        console.error('Keycloak initialization failed:', err);
      } finally {
        setLoading(false);
        console.log('Keycloak loading finished');
      }
    };
    init();

    const tokenRefreshInterval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak.updateToken(30).catch(() => {
          console.error('Failed to refresh token');
          keycloak.login();
        });
      }
    }, 60000);

    return () => clearInterval(tokenRefreshInterval);
  }, []);

  useEffect(() => {
    if (keycloakInitialized && !authenticated && !loading) {
      keycloak.login();
    }
  }, [keycloakInitialized, authenticated, loading]);

    // ----------- AUTH HANDLERS -----------
  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  const completeAuditSetup = () => {
    const newId = Math.max(...allAudits.map(a => a.id), 0) + 1;
    const auditorName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Utilisateur';
    const newAudit = {
      id: newId,
      title: `AUDIT ${String(newId).padStart(5, '0')}`,
      auditor: auditorName,
      auditee: '',
      date: new Date().toISOString().split('T')[0],
      status: 'En cours',
      items: [
        { no: 1, question: 'Nomenclature normalisée', response: '', commentaire: '' },
        { no: 2, question: 'Utilisation des sous-processus', response: '', commentaire: '' },
        { no: 3, question: 'Utilisation correcte des gateways', response: '', commentaire: '' },
        { no: 4, question: 'Événements de début et fin', response: '', commentaire: '' },
        { no: 5, question: 'Modèle lisible visuellement', response: '', commentaire: '' },
        { no: 6, question: 'Utilisation correcte des pools et lanes (participants)', response: '', commentaire: '' },
        { no: 7, question: 'Documentation BPMN intégrée', response: '', commentaire: '' },
        { no: 8, question: 'Optimisation de la modélisation', response: '', commentaire: '' }
      ],
      technical:
        [
          { no: 1, question: 'Mapping clair des erreurs attendues dans les connecteurs', response: '', commentaire: '' },
          { no: 2, question: 'Tests de bout en bout', response: '', commentaire: '' },
          { no: 3, question: 'Intégration des formulaires de tâches utilisateur', response: '', commentaire: '' },
          { no: 4, question: 'Mise en place d\'un système de retry dans les workers', response: '', commentaire: '' },
          { no: 5, question: 'Vérification des timeouts et durées d\'expiration des jobs', response: '', commentaire: '' },
          { no: 6, question: 'Validation avec métier', response: '', commentaire: '' }
        ],
    };
    setAllAudits([...allAudits, newAudit]);
    setCurrentAudit(newAudit);
    setCurrentAuditId(newId);
    setActiveTab('audits');
    setViewMode('editor');
    setSelectedRow({ table: 'model', index: 0 });
    setSetupMode(false);
    setSetupData({
    auditee: "Ayoub BEN KHIROUN",
    type: "",
    department: ""
    });
  };
  const cancelStartAudit=()=>{
    const newId = Math.max(...allAudits.map(a => a.id), 0) + 1;
    setCurrentAuditId(newId);
    setActiveTab('audits');
    setViewMode('list');
    setSelectedRow({ table: 'model', index: 0 });
    setSetupMode(false);

    };

  // ----------- LOADING SCREEN -----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl text-blue-700 font-bold">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-xl text-blue-700 font-bold">Chargement...</div>
        </div>
      </div>
    );
  }

  // ----------- SETUP MODE -----------
  if (setupMode) {
    const isFormValid = setupData.type && setupData.department;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Initialiser un Nouvel Audit
            </h1>
            <p className="text-gray-600 text-lg">
              Configurez les paramètres de votre audit en quelques étapes simples
            </p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-1">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500 ease-out"
                style={{ width: `${(Object.values(setupData).filter(v => v).length / 3) * 100}%` }}
              />
            </div>

            <div className="p-8">
              <div className="space-y-8">
                {/* Auditee Section */}
                <div className="relative">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-4 h-4 mr-2 text-blue-600 font-bold">👤</span>
                    Audité
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Utilisateur connecté'}
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium cursor-not-allowed"
                      disabled
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-green-500 text-lg">✓</span>
                    </div>
                  </div>
                </div>

                {/* Domain Section */}
                <div className="relative">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-4 h-4 mr-2 text-blue-600 font-bold">🏢</span>
                    Domaine
                  </label>
                  <div className="relative">
                    <select
                      value={setupData.type}
                      onChange={e => setSetupData({ ...setupData, type: e.target.value })}
                      className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium hover:border-blue-300"
                    >
                      <option value="">Sélectionnez le domaine</option>
                      {domains.map(dom => (
                        <option key={dom} value={dom}>{dom}</option>
                      ))}
                    </select>
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🏢</span>
                    {setupData.type && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-green-500 text-lg">✓</span>
                      </div>
                    )}
                  </div>
                  {setupData.type && (
                    <p className="text-xs text-green-600 mt-2 pl-12 font-medium">
                      ✓ Domaine sélectionné: {setupData.type}
                    </p>
                  )}
                </div>

                {/* Department Section */}
                <div className="relative">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <span className="w-4 h-4 mr-2 text-blue-600 font-bold">⚙️</span>
                    Processus
                  </label>
                  <div className="relative">
                    <select
                      value={setupData.department}
                      onChange={e => setSetupData({ ...setupData, department: e.target.value })}
                      className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 font-medium hover:border-blue-300"
                    >
                      <option value="">Sélectionnez le processus</option>
                      {departments.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                      ))}
                    </select>
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">⚙️</span>
                    {setupData.department && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-green-500 text-lg">✓</span>
                      </div>
                    )}
                  </div>
                  {setupData.department && (
                    <p className="text-xs text-green-600 mt-2 pl-12 font-medium">
                      ✓ Processus sélectionné: {setupData.department}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="mt-10 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {isFormValid ? (
                      <span className="flex items-center text-green-600 font-medium">
                        <span className="mr-1">✓</span>
                        Prêt à continuer
                      </span>
                    ) : (
                      <span>Veuillez remplir tous les champs requis</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={cancelStartAudit}
                      className="flex items-center px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg border border-gray-300"
                    >
                      <span className="mr-2">✕</span>
                      Annuler
                    </button>

                    <button
                      disabled={!isFormValid}
                      onClick={completeAuditSetup}
                      className={`
                        flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform
                        ${isFormValid 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Continuer
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          {isFormValid && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3">Résumé de l'audit</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Audité:</span>
                  <p className="font-medium text-gray-900">
                    {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Utilisateur connecté'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Domaine:</span>
                  <p className="font-medium text-gray-900">{setupData.type}</p>
                </div>
                <div>
                  <span className="text-gray-600">Processus:</span>
                  <p className="font-medium text-gray-900">{setupData.department}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------- PROGRESS CALC -----------
  const calculateProgress = (auditItems, auditItems2) => {
    const totalQuestions = auditItems.length + auditItems2.length;
    console.log(totalQuestions, "totalQuest");

    const OK_Response = auditItems.filter(item => item.response && item.response === 'OK').length;
    return totalQuestions > 0 ? Math.round((OK_Response / totalQuestions) * 100) : 0;
  };

  // ----------- GROUP + ROLE CHECK -----------
  const isDevConsult = keycloak.hasRealmRole('audit:consult');

  // ----------- AUDIT CRUD -----------
  const createNewAudit = () => {
    if (isDevConsult) return;
    setSetupMode(true);
  };

  const selectAudit = (audit) => {
    setCurrentAudit(audit);
    setCurrentAuditId(audit.id);
    setViewMode('editor');
    setSelectedRow({ table: 'model', index: 0 });
  };

  const updateCurrentAudit = (updatedAudit) => {
    setCurrentAudit(updatedAudit);
    setAllAudits(allAudits.map(audit => audit.id === updatedAudit.id ? updatedAudit : audit));
  };

  // ----------- DECISION/COMMENT BAR -----------

const setResponse = (response) => {
  if (!currentAudit || selectedRow.index === null) return;

  let updatedAudit = { ...currentAudit };

  if (selectedRow.table === 'model') {
    updatedAudit.items = updatedAudit.items.map((item, i) =>
      i === selectedRow.index ? { ...item, response } : item
    );
  } else {
    updatedAudit.technical = updatedAudit.technical.map((item, i) =>
      i === selectedRow.index ? { ...item, response } : item
    );
  }

  updateCurrentAudit(updatedAudit);

  const { index, table } = selectedRow;
  const rows = table === 'model' ? updatedAudit.items : updatedAudit.technical;
  const nextIndex = index + 1;

  if (nextIndex < rows.length) {
    setSelectedRow({ index: nextIndex, table });
  } else {
    // Only move to the next table if coming from 'model'
    if (table === 'model' && updatedAudit.technical.length > 0) {
      setSelectedRow({ index: 0, table: 'tech' });
    } else {
      setSelectedRow({ index: null, table: null }); // No more rows
    }
  }
};

  const updateComment = (table, index, newComment) => {
    let updatedAudit = { ...currentAudit };
    if (table === 'model') {
      updatedAudit.items = updatedAudit.items.map((item, i) =>
        i === index ? { ...item, commentaire: newComment } : item
      );
    } else {
      updatedAudit.technical = updatedAudit.technical.map((item, i) =>
        i === index ? { ...item, commentaire: newComment } : item
      );
    }
    updateCurrentAudit(updatedAudit);
  };

  // ----------- PRINTING -----------
  const printAudit = () => {
    const audit = currentAudit;

    const printTable = (title, items) => `
    <h3>${title}</h3>
    <table>
      <thead>
        <tr><th>NO</th><th>RÈGLE</th><th>RÉPONSE</th><th>COMMENTAIRE</th></tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.no}</td>
            <td>${item.question}</td>
            <td>${item.response || 'Pas de réponse'}</td>
            <td>${item.commentaire || 'Pas de commentaire'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

    const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Audit Report - ${audit.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          line-height: 1.4;
          color: #333;
          font-size: 13px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #333;
          padding-bottom: 8px;
          margin-bottom: 16px;
        }

        .header-logo {
          max-height: 45px;
        }

        .header-title {
          flex-grow: 1;
          text-align: center;
        }

        .header-title h1 {
          margin: 0;
          font-size: 20px;
        }

        .header-title h2 {
          margin: 4px 0 0;
          font-size: 15px;
          color: #444;
        }

        .audit-info {
          background: #f9f9f9;
          padding: 10px 14px;
          margin-bottom: 16px;
          border-radius: 4px;
          border-left: 3px solid #007BFF;
        }

        .table-wrapper {
          display: grid;
          grid-template-columns: 1fr;
        }

        table {
          width: 100%;
          table-layout: fixed;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 12px;
        }

        th, td {
          border: 1px solid #ccc;
          padding: 6px 8px;
          text-align: left;
          vertical-align: top;
          word-wrap: break-word;
        }

        th:nth-child(1), td:nth-child(1) { width: 6%; }   /* NO */
        th:nth-child(2), td:nth-child(2) { width: 34%; }  /* RÈGLE */
        th:nth-child(3), td:nth-child(3) { width: 30%; }  /* RÉPONSE */
        th:nth-child(4), td:nth-child(4) { width: 30%; }  /* COMMENTAIRE */

        th {
          background-color: #f0f4f8;
          font-weight: 600;
          color: #222;
        }

        tbody tr:nth-child(even) {
          background-color: #fdfdfd;
        }

        h3 {
          margin-top: 16px;
          margin-bottom: 6px;
          font-size: 14px;
          color: #007BFF;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 11px;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${imageAmaris}" alt="Logo Amaris" class="header-logo" />
        <div class="header-title">
          <h1>RAPPORT D'AUDIT</h1>
          <h2>${audit.title}</h2>
        </div>
        <img src="${imageBouyeges}" alt="Logo Bouygues" class="header-logo" />
      </div>

      <div class="audit-info">
        <p><strong>Auditeur:</strong> ${audit.auditor}</p>
        <p><strong>Audité:</strong> ${audit.auditee || 'Ayoub Ben Khiroun'}</p>
        <p><strong>Date:</strong> ${new Date(audit.date).toLocaleDateString('fr-FR')}</p>
        <p><strong>Taux de conformités:</strong> ${calculateProgress(audit.items, audit.technical)}%</p>
      </div>

      <div class="table-wrapper">
        ${printTable('Modélisation', audit.items)}
        ${printTable('Migration', audit.technical)}
      </div>

      <div class="footer">
        Rapport généré le ${new Date().toLocaleString('fr-FR')}
      </div>

      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
  };



  // ----------- ACTIONS -----------
  const terminateAudit = () => {
    if (window.confirm('Êtes-vous sûr de vouloir terminer cet audit?')) {
      const updatedAudit = { ...currentAudit, status: 'Terminé' };
      updateCurrentAudit(updatedAudit);
      setViewMode('list');
      setCurrentAudit(null);
      setCurrentAuditId(null);
      alert('Audit terminé avec succès!');
    }
  };

  const deleteAudit = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet audit?')) {
      setAllAudits(allAudits.filter(audit => audit.id !== currentAudit.id));
      setViewMode('list');
      setCurrentAudit(null);
      setCurrentAuditId(null);
      alert('Audit supprimé');
    }
  };

  const goBackToList = () => {
    setViewMode('list');
    setCurrentAudit(null);
    setCurrentAuditId(null);
  };

  // ----------- RENDER HELPERS -----------
  const getResponseClass = (response) => {
    switch (response) {
      case 'OK': return 'bg-green-100 text-green-800';
      case 'NOT OK': return 'bg-red-100 text-red-800';
      case 'NC': return 'bg-yellow-100 text-yellow-800';
      case 'NA': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  const renderAuditsList = () => (
    <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Mes Audits</h2>
            <p className="text-gray-600">Liste de tous vos audits en cours et terminés</p>
          </div>
          <button
            onClick={createNewAudit}
            disabled={isDevConsult}
            className={`flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${isDevConsult ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isDevConsult ? "Accès réservé aux TL et CDP" : "Créer un nouvel audit"}
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvel Audit
          </button>
        </div>
  
        {/* Audit Cards Grid */}
        <div className="grid gap-6">
          {allAudits.map(audit => (
            <div
              key={audit.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => selectAudit(audit)}
            >
              <div className="p-6">
                {/* Header with title and status */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    {audit.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    audit.status === 'Terminé' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {audit.status}
                  </span>
                </div>
  
                {/* Audit Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-700 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    <span><strong className="text-gray-600">Auditeur:</strong> {audit.auditor}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    <span><strong className="text-gray-600">Date:</strong> {new Date(audit.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center">
                    <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
                    <span><strong className="text-gray-600">Audité:</strong> {audit.auditee || 'Non défini'}</span>
                  </div>
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 mr-2 text-blue-500" />
                    <span><strong className="text-gray-600">Conformité:</strong> {calculateProgress(audit.items, audit.technical)}%</span>
                  </div>
                </div>
  
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{calculateProgress(audit.items, audit.technical)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${calculateProgress(audit.items, audit.technical)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- Audit Editor: Render Table
  const renderAuditTable = (title, items, tableKey) => (
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

  // --- Audit Editor: Main
  const renderAuditEditor = () => {
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

    // Data shortcut
    const { items = [], technical = [] } = currentAudit;

    return (
      <div className="p-5 bg-gray-50 min-h-[75vh] relative">
        {/* Audit Info */}
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
        {renderAuditTable('Modélisation', items, 'model')}
        {renderAuditTable('Migration', technical, 'tech')}

        {/* Sticky Decision Bar */}
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

  // ----------- RENDER -----------
  return (
    <div className="font-sans bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gray-200 relative px-3 py-1 border-b border-gray-300 h-10 flex items-center">
        {/* Centered Name and Icon */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-blue-700 font-bold flex items-center gap-2">
          {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : 'Utilisateur'} <span>👤</span>
        </div>

        {/* Right Logo */}
      </div>



      {/* Navigation Bar */}
      <div className="bg-white flex justify-between items-center text-blue-700 sticky top-0 z-30 px-6 shadow-lg rounded-b-2xl h-16">
        {/* Left Logo */}
        <div className="flex items-center">
          <img src={imageAmaris} alt="Amaris Logo" className="h-8 mr-4" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex h-full">
          {['quiter', 'demarrer', 'audits', 'actions', 'planning', 'reporting'].map((tab) => (
            <div
              key={tab}
              className={` 
              px-5 h-full flex items-center cursor-pointer
              transition-all duration-200 hover:bg-blue-100 font-medium
              ${activeTab === tab ? 'bg-blue-200 shadow-inner font-semibold' : ''}
              ${tab === 'demarrer' && isDevConsult ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => {
                if (tab === 'demarrer' && isDevConsult) return;
                setActiveTab(tab);
                if (tab === 'quiter') {
                  if (window.confirm('Êtes-vous sûr de vouloir quitter?')) {
                    setLoggedIn(false);
                    handleLogout();
                    setActiveTab('audits');
                  }
                } else if (tab === 'demarrer') {
                  createNewAudit();
                } else if (tab === 'audits') {
                  setViewMode('list');
                  setCurrentAudit(null);
                  setCurrentAuditId(null);
                }
              }}
              title={tab === 'demarrer' && isDevConsult ? 'Accès réservé aux TL et CDP' : undefined}
            >
              {tab === 'quiter' ? 'Quiter' :
                tab === 'demarrer' ? 'Démarrer AUDIT' :
                  tab.toUpperCase()}
            </div>
          ))}
        </div>
          <div className="flex items-center">
          <img src={imageBouyeges} alt="Amaris Logo" className="h-8" />
          </div>
      </div>


      {/* Audit Info Bar */}
      {currentAudit && activeTab === 'audits' && viewMode === 'editor' && (
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 text-sm flex items-center justify-between rounded-t-lg shadow-md">
        <div className="flex items-center space-x-6 font-medium">
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-200" />
            <span className="text-white">{currentAudit.title}</span>
          </div>
          
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-200" />
            <span>Auditeur: {currentAudit.auditor}</span>
          </div>
          
          <div className="flex items-center">
            <UserCheck className="w-4 h-4 mr-2 text-blue-200" />
            <span>Audité: {currentAudit.auditee || 'Non défini'}</span>
          </div>
          
          <div className="flex items-center">
            <Gauge className="w-4 h-4 mr-2 text-blue-200" />
            <span>Taux de conformité: {calculateProgress(currentAudit.items, currentAudit.technical)}%</span>
          </div>
          
          <div className="flex items-center">
            <BadgeInfo className="w-4 h-4 mr-2 text-blue-200" />
            <span>Statut: {currentAudit.status}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <img src={imageAmaris} alt="Logo Amaris" className="h-6 opacity-90 hover:opacity-100 transition-opacity" />
        </div>
      </div>
)}

      {/* Action Buttons */}
      {currentAudit && activeTab === 'audits' && viewMode === 'editor' && (
       
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3 flex justify-center gap-4 border-b border-gray-200 shadow-sm">
          <button
            className="flex items-center px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-sm"
            onClick={goBackToList}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Liste des audits
          </button>
          <button
            className="flex items-center px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-sm"
            onClick={printAudit}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimer
          </button>
          <button
            className="flex items-center px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Terminer
          </button>
          <button
            className="flex items-center px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 shadow-xs hover:shadow-sm"
            onClick={deleteAudit}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {activeTab === 'audits' && viewMode === 'editor' ? renderAuditEditor()
          : activeTab === 'audits' && viewMode === 'list' ? renderAuditsList()
            : activeTab === 'audits' ? renderAuditsList()
              : (
                <div className="p-5 bg-white text-center">
                  <h3 className="text-xl text-gray-600">
                    {activeTab === 'actions' && 'Gestion des Actions'}
                    {activeTab === 'planning' && 'Planning des Audits'}
                    {activeTab === 'reporting' && 'Rapports et Statistiques'}
                  </h3>
                  <p className="text-gray-500 mt-2">Cette section sera implémentée prochainement</p>
                </div>
              )}
      </div>
    </div>
  );
};

export default AuditApp;
