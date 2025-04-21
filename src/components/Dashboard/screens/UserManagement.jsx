import { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiEdit, 
  FiTrash2, 
  FiPlus, 
  FiLoader, 
  FiRefreshCw,
  FiLock,
  FiMail,
  FiX
} from 'react-icons/fi';
import { 
  listUsers, 
  onAuthStateChangedListener,
  registerUser
} from '../../../services/firebase_auth';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'user'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersList = await listUsers();
      setUsers(usersList);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setError("Erro ao carregar usuários. Verifique suas permissões.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setCurrentUser(user);
      if (user) {
        fetchUsers();
      } else {
        setError("Você precisa estar logado para acessar esta página.");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        newUser.email, 
        newUser.password, 
        {
          displayName: newUser.displayName,
          role: newUser.role
        }
      );
      setShowRegisterModal(false);
      setNewUser({
        email: '',
        password: '',
        displayName: '',
        role: 'user'
      });
      await fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Cabeçalho e botões */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Usuários</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-primary"
            onClick={fetchUsers}
            disabled={loading}
          >
            <FiRefreshCw className={`mr-1 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          
          {currentUser && (
            <button 
              className="btn btn-success"
              onClick={() => setShowRegisterModal(true)}
            >
              <FiPlus className="mr-1" />
              Novo Usuário
            </button>
          )}
        </div>
      </div>

      {/* Modal de cadastro - Bootstrap puro */}
      {showRegisterModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cadastrar Novo Usuário</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRegisterModal(false)}
                  aria-label="Close"
                >
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleRegister}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.displayName}
                      onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiMail className="text-gray-400" />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Senha</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiLock className="text-gray-400" />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        minLength={6}
                        required
                      />
                    </div>
                    <div className="form-text">Mínimo 6 caracteres</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Tipo de Usuário</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="user">Usuário Comum</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  
                  {error && <div className="alert alert-danger">{error}</div>}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowRegisterModal(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiLoader className="animate-spin me-1" />
                        Cadastrando...
                      </>
                    ) : 'Cadastrar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de usuários */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <FiLoader className="animate-spin text-2xl" />
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.uid}>
                  <td>{user.displayName}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                      {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button className="btn btn-sm btn-outline-primary">
                      <FiEdit />
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {error && (
          <div className="alert alert-danger mt-4">{error}</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;