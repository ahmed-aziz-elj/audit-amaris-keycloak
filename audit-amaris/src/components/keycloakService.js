import keycloak from './Keycloak.js';

const initKeycloak = async () => {
  if (!keycloak.__initialized) {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      pkceMethod: 'S256',
    });
    keycloak.__initialized = true;
    return authenticated;
  } else {
    console.warn('Keycloak was already initialized — skipping');
    return keycloak.authenticated ?? false;
  }
};


export { keycloak, initKeycloak };
