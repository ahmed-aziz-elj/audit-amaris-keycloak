import React from 'react';

const Header = ({
  imageBouyeges,
  imageAmaris,
  activeTab,
  setActiveTab,
  setLoggedIn,
  createNewAudit,
  setViewMode,
  setCurrentAudit,
  setCurrentAuditId,
}) => {
  return (
    <>
      <div className="bg-gray-200 relative px-3 py-1 border-b border-gray-300 h-10 flex items-center">
        <div className="absolute left-1/2 transform -translate-x-1/2 text-blue-700 font-bold flex items-center gap-2">
          AHMED AZIZ ELJ <span>👤</span>
        </div>
        <div className="absolute right-3">
          <img src={imageBouyeges} alt="Bouygues Logo" className="h-6" />
        </div>
      </div>

      <div className="bg-blue-700 flex justify-between items-center text-white sticky top-0 z-30 px-4">
        <div className="flex items-center">
          <img src={imageAmaris} alt="Amaris Logo" className="h-8 mr-4" />
        </div>

        <div className="flex">
          {['quiter', 'demarrer', 'audits', 'actions', 'planning', 'reporting'].map((tab) => (
            <div
              key={tab}
              className={`px-5 py-3 cursor-pointer border-r border-blue-800 transition-colors hover:bg-blue-800 ${activeTab === tab ? 'bg-blue-800' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                if (tab === 'quiter') {
                  if (window.confirm('Êtes-vous sûr de vouloir quitter?')) {
                    setLoggedIn(false);
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
            >
              {tab === 'quiter' ? 'Quiter' :
                tab === 'demarrer' ? 'Démarrer AUDIT' :
                  tab.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="flex items-center">
        </div>
      </div>
    </>
  );
};

export default Header; 