import { FiGrid } from 'react-icons/fi';
import { useState } from 'react';

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

export default CategoryManagement;