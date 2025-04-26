import { FiX, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ProductModal = ({
  showModal,
  setShowModal,
  formData,
  setFormData,
  categories,
  handleSubmit,
  isSubmitting,
  uploadingImage,
  uploadProgress,
  handleImageSelect,
  handleImageUpload,
  removeImage,
  isEditing,
  currentModel,
  setCurrentModel,
  addModel,
  removeModel,
  resetForm
}) => {
  return (
    <div className={`modal fade ${showModal ? 'show d-block' : ''}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
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
                    >
                      <FiUpload className="me-1" />
                      {formData.imagem ? 'Alterar Imagem' : 'Selecionar Imagem'}
                    </label>
                    
                    {formData.imagemFile && (
                      <div className="mt-2">
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
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
                          {uploadingImage ? `Enviando... ${Math.round(uploadProgress)}%` : 'Confirmar Upload'}
                        </button>
                        
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm ms-2"
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
                    )}
                  </div>
                </div>
              </div>

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
                  <label className="form-label">Estoque *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    value={formData.estoque}
                    onChange={(e) => setFormData({...formData, estoque: e.target.value})}
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
  );
};

export default ProductModal;