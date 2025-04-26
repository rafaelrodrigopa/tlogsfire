const ProductStatsCards = ({ products }) => {
    return (
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card h-100 border-primary">
            <div className="card-body">
              <h5 className="card-title">Total de Produtos</h5>
              <p className="card-text display-6">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-success">
            <div className="card-body">
              <h5 className="card-title">Valor Total em Estoque</h5>
              <p className="card-text display-6">
                {products.reduce((total, product) => 
                  total + (product.preco * (product.estoque || 0)), 
                  0
                ).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card h-100 border-info">
            <div className="card-body">
              <h5 className="card-title">Status dos Produtos</h5>
              <div className="d-flex justify-content-between mt-3">
                <div>
                  <span className="badge bg-success me-2">
                    {products.filter(product => product.ativo).length}
                  </span>
                  <span>Ativos</span>
                </div>
                <div>
                  <span className="badge bg-secondary me-2">
                    {products.filter(product => !product.ativo).length}
                  </span>
                  <span>Inativos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductStatsCards;