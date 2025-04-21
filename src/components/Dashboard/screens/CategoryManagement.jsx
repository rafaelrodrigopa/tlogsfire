import { useState, useEffect } from 'react';
import { FiGrid, FiEdit, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../../../services/firebase_categories';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedCategories = await getCategories();
      setCategories(loadedCategories);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (!newCategory.name.trim()) {
        throw new Error('O nome da categoria é obrigatório');
      }

      if (editingId) {
        await updateCategory(editingId, newCategory);
      } else {
        await addCategory(newCategory);
      }

      await loadCategories();
      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description || ''
    });
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCategory(categoryToDelete.id);
      await loadCategories();
      setShowDeleteModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewCategory({
      name: '',
      description: ''
    });
    setEditingId(null);
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
                <p>Tem certeza que deseja excluir a categoria <strong>{categoryToDelete?.name}</strong>?</p>
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
                  onClick={handleDelete}
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

      <div className="card">
        <div className="card-header d-flex align-items-center">
          <FiGrid className="me-2" />
          <h5 className="mb-0">Gerenciamento de Categorias</h5>
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
          
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
              <div className="col-md-5">
                <label htmlFor="name" className="form-label">
                  Nome da Categoria*
                </label>
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
                <label htmlFor="description" className="form-label">
                  Descrição
                </label>
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
              <div className="col-md-2 d-flex align-items-end gap-2">
                <button 
                  type="submit" 
                  className="btn btn-primary flex-grow-1" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : null}
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    <FiX />
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
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
                      <td>{category.description || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(category)}
                            disabled={loading}
                          >
                            <FiEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => confirmDelete(category)}
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

export default CategoryManagement;