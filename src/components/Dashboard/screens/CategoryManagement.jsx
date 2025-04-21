import { FiGrid } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { addCategory, getCategories } from '../../../services/firebase_categories';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carrega categorias ao montar o componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedCategories = await getCategories();
        
        if (!loadedCategories) {
          throw new Error('Nenhuma categoria encontrada');
        }
        
        setCategories(loadedCategories);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        setError(`Erro ao carregar categorias: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      setError('O nome da categoria é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await addCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim()
      });

      // Recarrega as categorias após adicionar
      const updatedCategories = await getCategories();
      setCategories(updatedCategories || []);

      setNewCategory({
        name: '',
        description: ''
      });

    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      setError(`Erro ao adicionar categoria: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header d-flex align-items-center">
          <FiGrid className="me-2" />
          <h5 className="mb-0">Gerenciamento de Categorias</h5>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="alert alert-danger">
              {error}
              <button 
                type="button" 
                className="btn-close float-end" 
                onClick={() => setError(null)}
                aria-label="Close"
              ></button>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-md-5">
                <label htmlFor="name" className="form-label">Nome da Categoria*</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={newCategory.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="description" className="form-label">Descrição</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  name="description"
                  value={newCategory.description}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : null}
                  Adicionar
                </button>
              </div>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nome</th>
                  <th>Produtos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-4">
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                ) : (
                  categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {category.products || 0}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          disabled={loading}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          disabled={loading}
                        >
                          Excluir
                        </button>
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

export default CategoryManagement;