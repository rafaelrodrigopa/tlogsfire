import { FiPackage, FiEdit2, FiTrash2 } from 'react-icons/fi';

const ProductTable = ({ 
  products, 
  categories, 
  onEdit, 
  onDelete 
}) => {
  // Função para encontrar o nome da categoria
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.nome || category?.name || 'N/A';
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <thead className="table-light">
          <tr>
            <th style={{ width: '80px' }}>Imagem</th>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Categoria</th>
            <th>Ativo no Estoque</th>
            <th>Ativo para Venda</th>
            <th style={{ width: '100px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(product => (
              <tr key={product.id}>
                <td>
                  {product.imagem ? (
                    <img
                      src={product.imagem}
                      alt={product.name}
                      className="img-thumbnail"
                      style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div className="bg-light d-flex align-items-center justify-content-center rounded"
                      style={{ width: '60px', height: '60px' }}>
                      <FiPackage className="text-muted" size={20} />
                    </div>
                  )}
                </td>
                <td className="align-middle">
                  {product.tipo || 'Não especificado'}
                </td>
                <td className="align-middle">{product.name}</td>
                <td className="align-middle">
                  {parseFloat(product.preco).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
                <td className="align-middle">
                  <span className={`badge ${product.estoque > 0 ? 'bg-success' : 'bg-warning'}`}>
                    {product.estoque || 0}
                  </span>
                </td>
                <td className="align-middle">
                  {getCategoryName(product.id_categoria)}
                </td>
                <td className="align-middle">
                  <span className={`badge ${product.ativo ? 'bg-success' : 'bg-secondary'}`}>
                    {product.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="align-middle">
                  <span className={`badge ${product.ativoVenda ? 'bg-primary' : 'bg-light text-dark'}`}>
                    {product.ativoVenda ? 'Sim' : 'Não'}
                  </span>
                </td>
                <td className="align-middle">
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary p-1"
                      onClick={() => onEdit(product.id)}
                      title="Editar"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger p-1"
                      onClick={() => onDelete(product.id)}
                      title="Excluir"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-4 text-muted">
                Nenhum produto encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;