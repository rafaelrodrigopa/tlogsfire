import { useState, useEffect } from 'react';
import { FiUser, FiLock, FiMail, FiEye, FiEyeOff } from 'react-icons/fi';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/img/login/imagem_fundo_moto.png';
import logoCharadaMotos from '../assets/img/login/charada_motos_logo.png';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Carrega as credenciais salvas quando o componente é montado
  useEffect(() => {
    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      setCredentials({ email, password });
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      
      // Se "Lembrar de mim" estiver marcado, salva as credenciais
      if (rememberMe) {
        localStorage.setItem('savedCredentials', JSON.stringify(credentials));
      } else {
        localStorage.removeItem('savedCredentials');
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('E-mail ou senha incorretos');
      setLoading(false);
    }
  };

  const handleRecovery = async (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      setError('Digite seu e-mail cadastrado');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, recoveryEmail);
      setRecoverySent(true);
      setError('');
    } catch (err) {
      setError('Erro ao enviar e-mail. Verifique o endereço.');
    }
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center min-vh-100 bg-dark"
      style={{
        background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Modal de Recuperação */}
      {showRecovery && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-light text-white border border-orange">
              <div className="modal-header border-bottom-orange">
                <h5 className="modal-title text-dark">Recuperar Senha</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => {
                    setShowRecovery(false);
                    setRecoverySent(false);
                  }}
                />
              </div>
              <div className="modal-body">
                {recoverySent ? (
                  <div className="text-center">
                    <div className="mb-4 text-success">
                      <FiMail size={48} />
                    </div>
                    <h4>E-mail enviado!</h4>
                    <p className="text-muted">
                      Enviamos um link para <strong className="text-white">{recoveryEmail}</strong>
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-muted mb-4">
                      Digite seu e-mail para receber o link de redefinição
                    </p>
                    <div className="input-group mb-3">
                      <span className="input-group-text bg-dark text-orange border-orange">
                        <FiMail />
                      </span>
                      <input
                        type="email"
                        className="form-control bg-dark text-white border-orange"
                        placeholder="Seu e-mail cadastrado"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                      />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                  </>
                )}
              </div>
              <div className="modal-footer border-top-orange">
                {recoverySent ? (
                  <button
                    className="btn btn-orange w-100"
                    onClick={() => setShowRecovery(false)}
                  >
                    Voltar ao Login
                  </button>
                ) : (
                  <button
                    className="btn btn-orange w-100 bg-secondary text-white"
                    onClick={handleRecovery}
                  >
                    Enviar Link
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card de Login Atualizado */}
      <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '450px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <img src={logoCharadaMotos} alt="" srcset="" style={{width: '150px'}} />
            <p className="text-muted">Área restrita para mecânicos e equipe</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <div className="input-group">
                <span className="input-group-text bg-light-custom text-orange border-orange">
                  <FiUser />
                </span>
                <input
                  type="email"
                  className="form-control bg-secondary text-white border-orange"
                  placeholder="seu@email.com"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">Senha</label>
              <div className="input-group">
                <span className="input-group-text bg-light-custom text-orange border-orange">
                  <FiLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-secondary text-white border-orange"
                  placeholder="••••••"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                  minLength="6"
                />
                <button 
                  type="button" 
                  className="btn btn-outline-orange border-orange"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye/> : <FiEyeOff />}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-between mb-4">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input bg-dark border-orange"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Lembrar de mim
                </label>
              </div>
              <button 
                type="button" 
                className="btn btn-link p-0 text-orange text-decoration-none"
                onClick={() => setShowRecovery(true)}
              >
                Esqueceu a senha?
              </button>
            </div>

            <button 
              type="submit" 
              className="btn btn-orange bg-dark text-orange w-100 py-2 mb-3 fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Carregando...
                </>
              ) : (
                'ACESSAR SISTEMA'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;