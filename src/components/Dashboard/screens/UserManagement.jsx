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
  FiX,
  FiAlertTriangle
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="container mt-4">
      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <FiAlertTriangle className="me-2" />
                  Confirmar Exclusão
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDeleteModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Tem certeza que deseja excluir o usuário <strong>{userToDelete?.displayName || userToDelete?.email}</strong>?</p>
                <p className="text-muted">Esta ação não pode ser desfeita.</p>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleDelete()}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : (
                    <FiTrash2 className="me-1" />
                  )}
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Cadastro */}
      {showRegisterModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cadastrar Novo Usuário</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowRegisterModal(false)}
                  disabled={loading}
                />
              </div>
              <form onSubmit={handleRegister}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="displayName" className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      id="displayName"
                      value={newUser.displayName}
                      onChange={(e) => setNewUser({...newUser, displayName: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiMail />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FiLock />
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        minLength={6}
                        required
                      />
                    </div>
                    <div className="form-text">Mínimo 6 caracteres</div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Tipo de Usuário</label>
                    <select
                      className="form-select"
                      id="role"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="user">Usuário Comum</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                      <span>{error}</span>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError(null)}
                      />
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowRegisterModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-1" />
                    ) : null}
                    Cadastrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header d-flex align-items-center">
          <FiUser className="me-2" />
          <h5 className="mb-0">Gerenciamento de Usuários</h5>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <span>{error}</span>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setError(null)}
              />
            </div>
          )}
          
          <div className="d-flex justify-content-between mb-4">
            <button 
              className="btn btn-primary"
              onClick={fetchUsers}
              disabled={loading}
            >
              <FiRefreshCw className={`me-1 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            
            {currentUser && (
              <button 
                className="btn btn-success"
                onClick={() => setShowRegisterModal(true)}
                disabled={loading}
              >
                <FiPlus className="me-1" />
                Novo Usuário
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.uid}>
                      <td>{user.displayName || '-'}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                          {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            disabled={loading}
                          >
                            <FiEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDelete(user)}
                            disabled={loading}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;