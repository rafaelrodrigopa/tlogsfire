import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Dashboard</h2>
      <p>Você está logado!</p>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none' }}
      >
        Sair
      </button>
    </div>
  );
}