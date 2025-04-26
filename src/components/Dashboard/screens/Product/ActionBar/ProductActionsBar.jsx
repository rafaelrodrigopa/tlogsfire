import { FiPlus } from 'react-icons/fi';

const ProductActionsBar = ({ 
  onAddNew, 
  onSearch 
}) => {
  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div className="flex-grow-1" style={{ maxWidth: '500px' }}>
        <div className="input-group">
          <input
            type="search"
            className="form-control"
            placeholder="Filtrar por nome, marca ou categoria..."
            onChange={onSearch}
          />
          <button className="btn btn-outline-secondary" type="button">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
      
      <button 
        className="btn btn-primary d-flex align-items-center gap-2"
        onClick={onAddNew}
      >
        <FiPlus size={18} />
        Adicionar Novo Produto
      </button>
    </div>
  );
};

export default ProductActionsBar;