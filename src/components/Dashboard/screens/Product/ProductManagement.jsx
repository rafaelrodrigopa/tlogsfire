import { useState, useEffect } from 'react';
import { FiPackage, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { productService } from '../../../../services/firebase_products';
import { categoryService } from '../../../../services/firebase_categories';
import { toast } from 'react-toastify';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase/config';
import ProductModal from './modals/ProductModal';
import DeleteConfirmationModal from './modals/DeleteModal';
import ProductStatisticsCards from './Card/ProductStatsCards';
import ProductDataTable from './Table/ProductTable';
import ProductActionBar from './ActionBar/ProductActionsBar';

const ProductManagement = () => {
  // Estados de controle da aplicação
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [currentModel, setCurrentModel] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);

  // Dados do formulário de produto
  const [productFormData, setProductFormData] = useState({
    name: '',
    description: '',
    preco: '',
    id_categoria: '',
    marca: '',
    modelos_compativeis: [],
    imagem: '',
    estoque: 0,
    ativo: true,
    imagemFile: null
  });

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(productsData);
        setAllProducts(productsData);
        setCategories(categoriesData);
      } catch (fetchError) {
        setError(fetchError.message);
        toast.error(`Erro ao carregar dados: ${fetchError.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Manipulador de seleção de imagem
  const handleImageSelection = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    const temporaryImageUrl = URL.createObjectURL(selectedFile);
    setProductFormData({
      ...productFormData,
      imagem: temporaryImageUrl,
      imagemFile: selectedFile
    });
  };

  // Função para upload de imagem
  const uploadProductImage = async () => {
    if (!productFormData.imagemFile) return null;

    try {
      setIsUploadingImage(true);
      const file = productFormData.imagemFile;
      const storageReference = ref(storage, `produtos/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      return await new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const progressPercentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progressPercentage);
          },
          (uploadError) => {
            reject(uploadError);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadUrl);
            } catch (urlError) {
              reject(urlError);
            }
          }
        );
      });
    } catch (uploadError) {
      toast.error(`Erro no upload da imagem: ${uploadError.message}`);
      throw uploadError;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Adicionar modelo compatível
  const addCompatibleModel = () => {
    if (!currentModel.trim()) return;
    setProductFormData({
      ...productFormData,
      modelos_compativeis: [...productFormData.modelos_compativeis, currentModel.trim()]
    });
    setCurrentModel('');
  };

  // Remover modelo compatível
  const removeCompatibleModel = (indexToRemove) => {
    const updatedModelsList = productFormData.modelos_compativeis.filter(
      (_, index) => index !== indexToRemove
    );
    setProductFormData({ 
      ...productFormData, 
      modelos_compativeis: updatedModelsList 
    });
  };

  // Submissão do formulário de produto
  const handleProductFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmittingForm(true);

      let productImageUrl = productFormData.imagem;
      if (productFormData.imagemFile) {
        productImageUrl = await uploadProductImage();
      }

      const productData = {
        ...productFormData,
        imagem: productImageUrl,
        preco: parseFloat(productFormData.preco),
        estoque: parseInt(productFormData.estoque),
        data_atualizacao: new Date().toISOString()
      };

      delete productData.imagemFile;

      if (isEditingProduct) {
        await productService.updateProduct(currentProductId, productData);
        toast.success('Produto atualizado com sucesso!');
      } else {
        productData.data_cadastro = new Date().toISOString();
        await productService.addProduct(productData);
        toast.success('Produto cadastrado com sucesso!');
      }

      const updatedProductsList = await productService.getProducts();
      setProducts(updatedProductsList);
      setAllProducts(updatedProductsList);
      setShowProductModal(false);
      resetProductForm();
    } catch (submitError) {
      toast.error(`Erro ao salvar produto: ${submitError.message}`);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Resetar formulário de produto
  const resetProductForm = () => {
    setProductFormData({
      name: '',
      description: '',
      preco: '',
      id_categoria: '',
      marca: '',
      modelos_compativeis: [],
      imagem: '',
      estoque: 0,
      ativo: true,
      imagemFile: null
    });
    setCurrentModel('');
    setUploadProgress(0);
    setIsEditingProduct(false);
    setCurrentProductId(null);
  };

  // Editar produto existente
  const editProduct = (productId) => {
    const productToEdit = products.find(product => product.id === productId);
    if (productToEdit) {
      setCurrentProductId(productId);
      setIsEditingProduct(true);
      setProductFormData({
        name: productToEdit.name,
        description: productToEdit.description,
        preco: productToEdit.preco.toString(),
        id_categoria: productToEdit.id_categoria,
        marca: productToEdit.marca || '',
        modelos_compativeis: productToEdit.modelos_compativeis || [],
        imagem: productToEdit.imagem || '',
        estoque: productToEdit.estoque || 0,
        ativo: productToEdit.ativo !== false,
        imagemFile: null
      });
      setShowProductModal(true);
    }
  };

  // Confirmar exclusão de produto
  const confirmProductDeletion = async () => {
    if (!productIdToDelete) return;
    
    try {
      setIsDeletingProduct(true);
      const product = products.find(product => product.id === productIdToDelete);
      if (product) {
        await productService.deleteProduct(productIdToDelete, product.imagem);
        const updatedProductsList = products.filter(
          product => product.id !== productIdToDelete
        );
        setProducts(updatedProductsList);
        setAllProducts(updatedProductsList);
        toast.success('Produto excluído com sucesso!');
      }
    } catch (deletionError) {
      toast.error(`Erro ao excluir produto: ${deletionError.message}`);
    } finally {
      setIsDeletingProduct(false);
      setShowDeleteConfirmationModal(false);
      setProductIdToDelete(null);
    }
  };

  // Filtrar produtos
  const filterProducts = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      setProducts(allProducts);
      return;
    }

    const filteredProducts = allProducts.filter(product => {
      const productCategory = categories.find(
        category => category.id === product.id_categoria
      );
      
      return (
        product.name.toLowerCase().includes(searchTerm) ||
        (product.marca && product.marca.toLowerCase().includes(searchTerm)) ||
        (productCategory && (
          productCategory.nome?.toLowerCase().includes(searchTerm) || 
          productCategory.name?.toLowerCase().includes(searchTerm)
        )
      ));
    });

    setProducts(filteredProducts);
  };

  // Exibir loading enquanto os dados são carregados
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // Exibir erro se ocorrer algum problema no carregamento
  if (error) {
    return (
      <div className="alert alert-danger text-center">
        Erro ao carregar produtos: {error}
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      {/* Modal de edição/criação de produto */}
      <ProductModal
        showModal={showProductModal}
        setShowModal={setShowProductModal}
        formData={productFormData}
        setFormData={setProductFormData}
        categories={categories}
        handleSubmit={handleProductFormSubmit}
        isSubmitting={isSubmittingForm}
        uploadingImage={isUploadingImage}
        uploadProgress={uploadProgress}
        handleImageSelect={handleImageSelection}
        removeImage={() => {
          if (productFormData.imagem.startsWith('blob:')) {
            URL.revokeObjectURL(productFormData.imagem);
          }
          setProductFormData({ 
            ...productFormData, 
            imagem: '', 
            imagemFile: null 
          });
        }}
        isEditing={isEditingProduct}
        currentModel={currentModel}
        setCurrentModel={setCurrentModel}
        addModel={addCompatibleModel}
        removeModel={removeCompatibleModel}
        resetForm={resetProductForm}
      />

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        show={showDeleteConfirmationModal}
        onClose={() => setShowDeleteConfirmationModal(false)}
        onConfirm={confirmProductDeletion}
        isDeleting={isDeletingProduct}
        title="Confirmar Exclusão de Produto"
        message="Tem certeza que deseja excluir este produto permanentemente?"
      />

      {/* Cabeçalho e seção principal */}
      <div className="d-flex flex-column gap-3 mb-4">
        <h2 className="mb-0">Gerenciamento de Produtos</h2>
        
        {/* Cards de estatísticas */}
        <ProductStatisticsCards products={products} />
        
        {/* Barra de ações */}
        <ProductActionBar
          onAddNew={() => {
            resetProductForm();
            setShowProductModal(true);
          }}
          onSearch={filterProducts}
        />
      </div>

      {/* Tabela de produtos */}
      <div className="card">
        <div className="card-body p-0">
          <ProductDataTable
            products={products}
            categories={categories}
            onEdit={editProduct}
            onDelete={(productId) => {
              setProductIdToDelete(productId);
              setShowDeleteConfirmationModal(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;