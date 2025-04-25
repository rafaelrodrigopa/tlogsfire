import { db } from '../firebase/config'; // Ajuste o caminho conforme sua estrutura
import { collection, doc, deleteDoc, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';  // Importe as funções do Storage
import { storage } from '../firebase/config';  // Importe o storage do seu arquivo de configuração

const productsCollection = collection(db, 'products');

export const productService = {
  async addProduct(productData) {
    try {
      const docRef = await addDoc(collection(db, 'products'), productData);
      return docRef.id;
    } catch (error) {
      console.error("Erro no Firebase:", {
        code: error.code,
        message: error.message
      });
      throw new Error("Falha na comunicação com o servidor");
    }
  },

  // Buscar todos os produtos
  async getProducts() {
    try {
      const querySnapshot = await getDocs(productsCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao buscar produtos: ", error);
      throw error;
    }
  },

  // Atualizar produto
  async updateProduct(productId, updatedData) {
    try {
      await updateDoc(doc(productsCollection, productId), updatedData);
    } catch (error) {
      console.error("Erro ao atualizar produto: ", error);
      throw error;
    }
  },

  
  async deleteProduct(productId, imageUrl) {
    try {
      // Deleta do Firestore
      await deleteDoc(doc(db, 'products', productId));
      
      // Se houver imagem, deleta do Storage
      if (imageUrl) {
        try {
          // Extrai o path da URL completa
          const imagePath = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        } catch (storageError) {
          console.error("Erro ao deletar imagem:", storageError);
          // Não interrompe o fluxo principal se falhar ao deletar a imagem
        }
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  }
};