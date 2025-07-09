import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080/',
  realm: 'auditApp',
  clientId: 'audit-app',
});

export default keycloak;
// Keycloak
