import { useState, useEffect } from 'react';
import { FiPackage, FiEdit2, FiTrash2, FiPlus, FiX, FiUpload } from 'react-icons/fi';
import { productService } from '../../../services/firebase_products';
import { categoryService } from '../../../services/firebase_categories';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';

const ProductManagement = () => {
  {/*Estados*/}
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentModel, setCurrentModel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  {/*Dados do formulário*/}
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    preco: '',
    id_categoria: '',
    marca: '',
    modelos_compativeis: [],
    imagem: '',
    ativo: true,
    imagemFile: null 
  });

  {/*Carrega dados iniciais*/}
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message);
        toast.error('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  {/*Manipuladores de imagem*/}
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    {/*Verifica se o arquivo é uma imagem*/}
    if (!file.type.match('image.*')) {
      toast.error('Por favor, selecione um arquivo de imagem');
      return;
    }

    {/*Cria preview temporário*/}
    const tempUrl = URL.createObjectURL(file);
    setFormData({
      ...formData,
      imagem: tempUrl,
      imagemFile: file
    });
  };

{/*Modifique o handleImageUpload*/}
const handleImageUpload = async () => {
  if (!formData.imagemFile) return;

  try {
    setUploadingImage(true);
    const file = formData.imagemFile;
    const storageRef = ref(storage, `produtos/${Date.now()}_${file.name}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    const downloadURL = await new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });

    // Atualiza o estado com a URL permanente
    setFormData({
      ...formData,
      imagem: downloadURL,
      imagemFile: null // Limpa o arquivo temporário
    });

    return downloadURL;
    
  } finally {
    setUploadingImage(false);
  }
};

  const removeImage = () => {
    if (formData.imagem.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imagem);
    }
    setFormData({
      ...formData,
      imagem: '',
      imagemFile: null
    });
    setUploadProgress(0);
  };

  {/*Manipulador de modelos compatíveis*/}
  const addModel = () => {
    if (currentModel.trim() === '') return;
    
    setFormData({
      ...formData,
      modelos_compativeis: [...formData.modelos_compativeis, currentModel.trim()]
    });
    setCurrentModel('');
  };

  const removeModel = (index) => {
    const updatedModels = [...formData.modelos_compativeis];
    updatedModels.splice(index, 1);
    setFormData({
      ...formData,
      modelos_compativeis: updatedModels
    });
  };

{/*Atualize o handleSubmit*/}
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    setIsSubmitting(true);
    
    let imageUrl = formData.imagem;
    if (formData.imagemFile) {
      imageUrl = await handleImageUpload();
    }

    const productToSave = {
      ...formData,
      imagem: imageUrl,
      preco: parseFloat(formData.preco),
      data_cadastro: new Date()
    };
    
    delete productToSave.imagemFile;
    
    await productService.addProduct(productToSave);
    
    // Atualiza a lista de produtos
    const updatedProducts = await productService.getProducts();
    setProducts(updatedProducts);
    
    toast.success('Produto cadastrado com sucesso!');
    
    // Fecha o modal e reseta o formulário
    setShowModal(false);
    resetForm();
    
  } catch (error) {
    toast.error(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  
  {/*Função auxiliar para resetar o formulário*/}
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      preco: '',
      id_categoria: '',
      marca: '',
      modelos_compativeis: [],
      imagem: '',
      ativo: true,
      imagemFile: null
    });
    setCurrentModel('');
    setUploadProgress(0);
  };

  const handleDelete = async (productId) => {
    try {
      setIsDeleting(true);
      const product = products.find(p => p.id === productId);
      await productService.deleteProduct(productId, product?.imagem);
      
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Produto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir produto: ' + error.message);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div className="text-center py-4">Carregando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid">

  
      {/* Modal de Cadastro */}
      <div className={`modal fade ${showModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Novo Produto</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {/* Seção de Imagem */}
                <div className="mb-4">
                  <label className="form-label">Imagem do Produto</label>
                  <div className="d-flex align-items-start gap-3">
                    {formData.imagem ? (
                      <div className="position-relative">
                        <img 
                          src={formData.imagem} 
                          alt="Preview" 
                          className="img-thumbnail" 
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        />
                        {uploadingImage && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="spinner-border text-light" role="status">
                              <span className="visually-hidden">Carregando...</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border rounded d-flex align-items-center justify-content-center" 
                        style={{ width: '150px', height: '150px' }}>
                        <span className="text-muted">Sem imagem</span>
                      </div>
                    )}
                    
                    <div className="flex-grow-1">
                      <input
                        type="file"
                        id="productImage"
                        className="d-none"
                        accept="image/*"
                        onChange={handleImageSelect}
                        disabled={uploadingImage}
                      />
                      <label 
                        htmlFor="productImage" 
                        className={`btn ${formData.imagem ? 'btn-outline-primary' : 'btn-primary'} mb-2`}
                        disabled={uploadingImage}
                      >
                        <FiUpload className="me-1" />
                        {formData.imagem ? 'Alterar Imagem' : 'Selecionar Imagem'}
                      </label>
                      
                      {formData.imagemFile && (
  <div className="mt-2">
    <button
      type="button"
      className="btn btn-success btn-sm"  // Mantém o verde para confirmação
      onClick={async () => {
        try {
          await handleImageUpload();
          toast.success('Imagem confirmada com sucesso!');
        } catch (error) {
          toast.error('Erro ao confirmar imagem');
        }
      }}
      disabled={uploadingImage}
    >
      {uploadingImage ? (
        `Enviando... ${Math.round(uploadProgress)}%`
      ) : (
        'Confirmar Upload'
      )}
    </button>
    
    <button
      type="button"
      className="btn btn-outline-danger btn-sm ms-2"  // Vermelho apenas para cancelar
      onClick={removeImage}
      disabled={uploadingImage}
    >
      <FiX className="me-1" />
      Cancelar
    </button>
    
    {uploadingImage && (
      <div className="progress mt-2">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{ width: `${uploadProgress}%` }}
          aria-valuenow={uploadProgress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    )}
  </div>
)}                </div>
                  </div>
                </div>

                {/* Demais campos do formulário */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nome do Produto *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Categoria *</label>
                    <select
                      className="form-select"
                      value={formData.id_categoria}
                      onChange={(e) => setFormData({...formData, id_categoria: e.target.value})}
                      required
                    >
                      <option value="">Selecione...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nome || cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Preço *</label>
                    <input
                      type="number"
                      className="form-control"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={(e) => setFormData({...formData, preco: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6">
                    <label className="form-label">Marca</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.marca}
                      onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Modelos Compatíveis</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Adicionar modelo"
                        value={currentModel}
                        onChange={(e) => setCurrentModel(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addModel()}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={addModel}
                      >
                        Adicionar
                      </button>
                    </div>
                    
                    {formData.modelos_compativeis.length > 0 && (
                      <div className="d-flex flex-wrap gap-2">
                        {formData.modelos_compativeis.map((model, index) => (
                          <span key={index} className="badge bg-light text-dark d-flex align-items-center">
                            {model}
                            <button
                              type="button"
                              className="btn btn-sm p-0 ms-2"
                              onClick={() => removeModel(index)}
                            >
                              <FiX size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.ativo}
                        onChange={(e) => setFormData({...formData, ativo: e.target.checked})}
                      />
                      <label className="form-check-label">Produto ativo</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowModal(false);
                    removeImage();
                  }}
                  disabled={uploadingImage}
                >
                  Cancelar
                </button>
                <button
  type="submit"
  className={`btn btn-primary ${isSubmitting ? 'disabled' : ''}`}
  disabled={isSubmitting || uploadingImage}
>
  {isSubmitting ? (
    <>
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
      Salvando...
    </>
  ) : (
    'Salvar Produto'
  )}
</button>
              </div>
            </form>
          </div>
        </div>
      </div>

{/*Componente do Modal de Confirmação (coloque isso no return do seu componente)*/}
{showDeleteModal && (
  <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirmar Exclusão</h5>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowDeleteModal(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="modal-body">
          <p>Tem certeza que deseja excluir este produto permanentemente?</p>
          <p className="text-danger">Esta ação não pode ser desfeita!</p>
        </div>
        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setShowDeleteModal(false)}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={() => handleDelete(productToDelete)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Excluindo...
              </>
            ) : (
              'Confirmar Exclusão'
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Lista de Produtos */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gerenciamento de Produtos</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowModal(true);
            setFormData({
              name: '',
              description: '',
              preco: '',
              id_categoria: '',
              marca: '',
              modelos_compativeis: [],
              imagem: '',
              ativo: true,
              imagemFile: null
            });
            setCurrentModel('');
          }}
        >
          <FiPlus className="me-1" /> Novo Produto
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.imagem ? (
                        <img 
                          src={product.imagem} 
                          alt={product.name} 
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="img-thumbnail"
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center" 
                          style={{ width: '50px', height: '50px' }}>
                          <FiPackage size={20} className="text-muted" />
                        </div>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>R$ {product.preco?.toFixed(2)}</td>
                    <td>
                      {categories.find(c => c.id === product.id_categoria)?.nome || 
                       categories.find(c => c.id === product.id_categoria)?.name || '-'}
                    </td>
                    <td>
                      <span className={`badge bg-${product.ativo ? 'success' : 'secondary'}`}>
                        {product.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">
                        <FiEdit2 />
                      </button>
                      {/*Modifique o botão de deletar na tabela:*/}
<button 
  className="btn btn-sm btn-outline-danger"
  onClick={() => {
    setProductToDelete(product.id);
    setShowDeleteModal(true);
  }}
>
  <FiTrash2 />
</button>
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

export default ProductManagement;