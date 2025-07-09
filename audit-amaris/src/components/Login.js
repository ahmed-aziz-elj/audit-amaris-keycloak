
const Login = ({ loginData, setLoginData, onLogin, imageAmaris, imageBouyeges }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-100">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm relative overflow-hidden">

        {/* Top Logo */}
        <div className="flex justify-center mb-6">
          <img src={imageAmaris} alt="Logo Amaris" className="h-14 object-contain" />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          AMARIS-AuditApp
        </h2>

        <form
          onSubmit={e => {
            e.preventDefault();
            onLogin(true);
          }}
        >
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Login</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              autoComplete="username"
              value={loginData.login}
              onChange={e => setLoginData(d => ({ ...d, login: e.target.value }))}
              placeholder="Nom d'utilisateur"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Mot de passe</label>
            <input
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              autoComplete="current-password"
              value={loginData.password}
              onChange={e => setLoginData(d => ({ ...d, password: e.target.value }))}
              placeholder="Mot de passe"
              required
            />
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition duration-200"
            type="submit"
          >
            Se connecter
          </button>
        </form>

        {/* Bottom Logo */}
        <div className="flex justify-center mt-8">
          <img src={imageBouyeges} alt="Logo Bouygues" className="h-12 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Login; 