import { useState, useEffect } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiPackage, 
  FiGrid, 
  FiHome, 
  FiLogOut, 
  FiChevronDown, 
  FiChevronUp,
  FiSettings,
  FiBarChart2,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiAlertCircle
} from 'react-icons/fi';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import UserManagement from "./Dashboard/screens/UserManagement";

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [cadastroOpen, setCadastroOpen] = useState(false);
  const [relatoriosOpen, setRelatoriosOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'users':
        return <UserManagement />; 
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'sales':
        return <SalesReport />;
      case 'settings':
        return <SystemSettings />;
      case 'dashboard':
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Navigation Bar */}
      {/* Substitua a navbar atual por esta versão otimizada */}
<nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm fixed-top" style={{ minHeight: '56px' }}>
  <div className="container-fluid px-2">
    {/* Botão do menu alinhado à esquerda */}
    <button 
      className="navbar-toggler order-lg-1 me-2 py-1" 
      type="button"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
    </button>

    {/* Título centralizado no mobile, alinhado à esquerda no desktop */}
    <a 
      className="navbar-brand fw-bold mx-auto mx-lg-0 order-lg-0 text-truncate py-0" 
      href="#"
      style={{
        fontSize: '1.1rem',
        maxWidth: 'calc(100vw - 200px)'
      }}
    >
      Sistema Charada
    </a>

    {/* Dropdown do usuário alinhado à direita */}
    {/* Dropdown do usuário alinhado à direita */}
<div className="d-flex align-items-center order-lg-2">
  <div className="dropdown">
    <button 
      className="btn btn-outline-light dropdown-toggle py-1 px-2"
      id="userDropdown"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      onClick={(e) => {
        // Fecha o off-canvas se estiver aberto no mobile
        if (mobileMenuOpen && window.innerWidth < 992) {
          setMobileMenuOpen(false);
          // Previne a abertura imediata do dropdown
          e.preventDefault();
          // Abre o dropdown após um pequeno delay
          setTimeout(() => {
            document.getElementById('userDropdown').click();
          }, 100);
        }
      }}
    >
      <span className="d-none d-lg-inline">
        <FiUser className="me-1" /> {userEmail.split('@')[0]}
      </span>
      <span className="d-lg-none">
        <FiUser />
      </span>
    </button>
    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
      <li>
        <a className="dropdown-item" href="#">
          <FiUser className="me-2" /> Perfil
        </a>
      </li>
      <li>
        <a className="dropdown-item" href="#">
          <FiSettings className="me-2" /> Configurações
        </a>
      </li>
      <li><hr className="dropdown-divider" /></li>
      <li>
        <button 
          className="dropdown-item" 
          onClick={handleLogout}
        >
          <FiLogOut className="me-2" /> Sair
        </button>
      </li>
    </ul>
  </div>
</div>



  </div>
</nav>

      {/* Main Content Wrapper */}
      <div className="d-flex flex-grow-1" style={{ marginTop: '56px' }}>
        {/* Sidebar */}
        <div 
          className={`bg-dark text-white ${mobileMenuOpen ? 'd-block' : 'd-none'} d-lg-block`}
          style={{
            width: '250px',
            minHeight: 'calc(100vh - 56px)',
            transition: 'all 0.3s',
            position: mobileMenuOpen ? 'fixed' : 'static',
            zIndex: 9000,
            left: mobileMenuOpen ? '0' : '-250px'
          }}
        >
          <div className="sidebar-sticky pt-3">
            <ul className="nav flex-column">
              <li className="nav-item">
                <button 
                  className={`nav-link text-white text-start w-100 ${activeMenu === 'dashboard' ? 'active bg-primary' : ''}`}
                  onClick={() => {
                    setActiveMenu('dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FiHome className="me-2" /> Dashboard
                </button>
              </li>
              
              <li className="nav-item mt-2">
                <button 
                  className="nav-link text-white text-start w-100 d-flex justify-content-between align-items-center"
                  onClick={() => setCadastroOpen(!cadastroOpen)}
                >
                  <span><FiUser className="me-2" /> Cadastros</span>
                  {cadastroOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {cadastroOpen && (
                  <ul className="nav flex-column ps-3">
                    <li className="nav-item">
                      <button 
                        className={`nav-link text-white text-start w-100 ${activeMenu === 'users' ? 'active bg-primary' : ''}`}
                        onClick={() => {
                          setActiveMenu('users');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FiUsers className="me-2" /> Usuários
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link text-white text-start w-100 ${activeMenu === 'products' ? 'active bg-primary' : ''}`}
                        onClick={() => {
                          setActiveMenu('products');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FiPackage className="me-2" /> Produtos
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link text-white text-start w-100 ${activeMenu === 'categories' ? 'active bg-primary' : ''}`}
                        onClick={() => {
                          setActiveMenu('categories');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FiGrid className="me-2" /> Categorias
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              <li className="nav-item mt-2">
                <button 
                  className={`nav-link text-white text-start w-100 ${activeMenu === 'orders' ? 'active bg-primary' : ''}`}
                  onClick={() => {
                    setActiveMenu('orders');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FiShoppingCart className="me-2" /> Pedidos
                </button>
              </li>

              <li className="nav-item mt-2">
                <button 
                  className="nav-link text-white text-start w-100 d-flex justify-content-between align-items-center"
                  onClick={() => setRelatoriosOpen(!relatoriosOpen)}
                >
                  <span><FiBarChart2 className="me-2" /> Relatórios</span>
                  {relatoriosOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {relatoriosOpen && (
                  <ul className="nav flex-column ps-3">
                    <li className="nav-item">
                      <button 
                        className={`nav-link text-white text-start w-100 ${activeMenu === 'sales' ? 'active bg-primary' : ''}`}
                        onClick={() => {
                          setActiveMenu('sales');
                          setMobileMenuOpen(false);
                        }}
                      >
                        <FiDollarSign className="me-2" /> Vendas
                      </button>
                    </li>
                  </ul>
                )}
              </li>

              <li className="nav-item mt-2">
                <button 
                  className={`nav-link text-white text-start w-100 ${activeMenu === 'settings' ? 'active bg-primary' : ''}`}
                  onClick={() => {
                    setActiveMenu('settings');
                    setMobileMenuOpen(false);
                  }}
                >
                  <FiSettings className="me-2" /> Configurações
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div 
            className="d-lg-none position-fixed bg-dark opacity-50"
            style={{
              top: '56px',
              left: '250px',
              right: '0',
              bottom: '0',
              zIndex: 999,
            }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main 
          className="flex-grow-1 p-4"
          style={{
            marginLeft: mobileMenuOpen ? '0' : '0',
            width: mobileMenuOpen ? 'calc(100% - 250px)' : '100%',
            transition: 'all 0.3s'
          }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Componentes de conteúdo melhorados
const DashboardHome = () => {
  const stats = [
    { title: "Total de Vendas", value: "R$ 24.780", icon: <FiDollarSign size={24} />, color: "success" },
    { title: "Pedidos", value: "156", icon: <FiShoppingCart size={24} />, color: "primary" },
    { title: "Produtos", value: "89", icon: <FiPackage size={24} />, color: "info" },
    { title: "Alertas", value: "3", icon: <FiAlertCircle size={24} />, color: "warning" }
  ];

  return (
    <div>
      <h2 className="mb-4">Visão Geral</h2>
      
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className={`card bg-${stat.color} text-white`}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title">{stat.title}</h6>
                    <h3 className="card-text">{stat.value}</h3>
                  </div>
                  <div className="bg-white bg-opacity-25 p-3 rounded-circle">
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row">
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Vendas Recentes</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Data</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(item => (
                      <tr key={item}>
                        <td>#{1000 + item}</td>
                        <td>Cliente {item}</td>
                        <td>{(new Date()).toLocaleDateString()}</td>
                        <td>R$ {150 * item},00</td>
                        <td><span className="badge bg-success">Pago</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h5 className="mb-0">Atividades Recentes</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {[
                  "Novo pedido #1004 recebido",
                  "Produto 'Motor XYZ' atualizado",
                  "Usuário João cadastrado",
                  "Pagamento de R$ 450,00 confirmado"
                ].map((activity, index) => (
                  <li key={index} className="list-group-item border-0 px-0 py-2">
                    <small className="text-muted">{(new Date()).toLocaleTimeString()}</small>
                    <p className="mb-0">{activity}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

{/*const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin', email: 'admin@example.com', role: 'Administrador', status: 'Ativo' },
    { id: 2, name: 'Gerente', email: 'gerente@example.com', role: 'Gerente', status: 'Ativo' },
    { id: 3, name: 'Vendedor', email: 'vendedor@example.com', role: 'Vendedor', status: 'Inativo' }
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Usuários</h2>
        <button className="btn btn-primary">
          <FiUser className="me-1" /> Adicionar Usuário
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Cargo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={`badge bg-${user.status === 'Ativo' ? 'success' : 'secondary'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">Editar</button>
                      <button className="btn btn-sm btn-outline-danger">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};*/}

const ProductManagement = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Motor XYZ', category: 'Peças', price: 1200, stock: 15 },
    { id: 2, name: 'Pneu Aro 17', category: 'Acessórios', price: 350, stock: 8 },
    { id: 3, name: 'Retrovisor Esquerdo', category: 'Peças', price: 85, stock: 0 }
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Produtos</h2>
        <button className="btn btn-primary">
          <FiPackage className="me-1" /> Adicionar Produto
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>R$ {product.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge bg-${product.stock > 0 ? 'success' : 'danger'}`}>
                        {product.stock} un
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">Editar</button>
                      <button className="btn btn-sm btn-outline-danger">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Peças', products: 45 },
    { id: 2, name: 'Acessórios', products: 32 },
    { id: 3, name: 'Serviços', products: 12 }
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Categorias</h2>
        <button className="btn btn-primary">
          <FiGrid className="me-1" /> Adicionar Categoria
        </button>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Nome da Categoria</label>
                  <input type="text" className="form-control" placeholder="Digite o nome" />
                </div>
                <button type="submit" className="btn btn-primary w-100">Salvar Categoria</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Produtos</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.products}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">Editar</button>
                          <button className="btn btn-sm btn-outline-danger">Remover</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderManagement = () => {
  return (
    <div>
      <h2 className="mb-4">Gerenciamento de Pedidos</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <p>Conteúdo de gerenciamento de pedidos...</p>
        </div>
      </div>
    </div>
  );
};

const SalesReport = () => {
  return (
    <div>
      <h2 className="mb-4">Relatório de Vendas</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <p>Gráficos e relatórios de vendas...</p>
        </div>
      </div>
    </div>
  );
};

const SystemSettings = () => {
  return (
    <div>
      <h2 className="mb-4">Configurações do Sistema</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <p>Configurações do sistema...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;