import { useState, useEffect, useRef } from 'react';
import { FiGrid, FiEdit, FiTrash2, FiX, FiAlertTriangle, FiImage, FiUpload } from 'react-icons/fi';
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory,
  uploadImage
} from '../../../services/firebase_categories';


const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    imageUrl: '',
    active: true, // Novo campo
    color: '#6c757d' // Novo campo
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const fileInputRef = useRef(null);

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      setLoading(true);
      setError(null);
      
      // Preview temporário
      setNewCategory(prev => ({
        ...prev,
        imageUrl: URL.createObjectURL(file)
      }));
      
      //const resizedImage = await resizeImage(file);
  
      // Verificação simples
      if (!file.type.match('image.*')) {
        throw new Error('Apenas imagens são permitidas');
      }
  
      // Upload com tratamento de CORS
      const imageUrl = await uploadImage(file);
      
      setNewCategory(prev => ({
        ...prev,
        imageUrl
      }));
  
    } catch (error) {
      console.error('Erro:', error);
      setError(error.message);
      setNewCategory(prev => ({
        ...prev,
        imageUrl: ''
      }));
    } finally {
      setLoading(false);
    }
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
        const categoryToUpdate = categories.find(c => c.id === editingId);
        await updateCategory(
          editingId, 
          newCategory,
          categoryToUpdate.imageUrl
        );
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
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      active: category.active !== undefined ? category.active : true,
      color: category.color || '#6c757d'
    });
  };

  const handleRemoveImage = () => {
    setNewCategory(prev => ({ ...prev, imageUrl: '' }));
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteCategory(categoryToDelete);
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
      description: '',
      imageUrl: ''
    });
    setEditingId(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
                <label className="form-label">
                  Imagem
                </label>
                <div className="d-flex gap-2">
                  <div className="flex-grow-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                      className="form-control"
                      style={{ display: 'none' }}
                      id="imageUpload"
                    />
                    <label 
                      htmlFor="imageUpload" 
                      className="btn btn-outline-secondary w-100"
                    >
                      <FiUpload className="me-1" />
                      {newCategory.imageUrl ? 'Alterar' : 'Selecionar'}
                    </label>
                  </div>
                  {newCategory.imageUrl && (
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={handleRemoveImage}
                      disabled={loading}
                    >
                      <FiX />
                    </button>
                  )}
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="progress mt-2">
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      role="progressbar" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              {newCategory.imageUrl && (
                <div className="col-12">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={newCategory.imageUrl} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100px', 
                        maxHeight: '100px',
                        borderRadius: '4px'
                      }} 
                    />
                    <small className="text-muted">
                      Imagem selecionada
                    </small>
                  </div>
                </div>
              )}
              
              <div className="col-12 d-flex justify-content-end gap-2">
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    <FiX className="me-1" />
                    Cancelar
                  </button>
                )}
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" />
                  ) : null}
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </button>
              </div>
            </div>

            <div className="col-md-3">
                <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={newCategory.active}
                    onChange={(e) => setNewCategory(prev => ({
                    ...prev,
                    active: e.target.checked
                    }))}
                />
                <label className="form-check-label" htmlFor="active">
                    Categoria ativa
                </label>
                </div>
            </div>

            {/*<div className="col-md-3">
                <label htmlFor="color" className="form-label">
                Cor
                </label>
                <input
                type="color"
                className="form-control form-control-color"
                id="color"
                name="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory(prev => ({
                    ...prev,
                    color: e.target.value
                }))}
                title="Escolha uma cor"
                />
            </div>*/}
          </form>

          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                <th>Status</th>
                <th>Imagem</th>
                <th>Nome</th>
                {/*<th>Cor</th>*/}
                <th>Descrição</th>
                <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      Nenhuma categoria encontrada
                    </td>
                  </tr>
                ) : (
                  categories.map(category => (
                    <tr key={category.id}>
                        <td>
                            <span className={`badge ${category.active ? 'bg-success' : 'bg-secondary'}`}>
                            {category.active ? 'Ativa' : 'Inativa'}
                            </span>
                        </td>
                      <td>
                        {category.imageUrl ? (
                          <img 
                            src={category.imageUrl} 
                            alt={category.name}
                            style={{ 
                              width: '50px', 
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }} 
                          />
                        ) : (
                          <div className="text-muted">
                            <FiImage size={20} />
                          </div>
                        )}
                      </td>
                      <td>{category.name}</td>
                      {/*<td>
                            <div 
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: category.color,
                                borderRadius: '50%',
                                display: 'inline-block'
                            }}
                            />
                        </td>*/}
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