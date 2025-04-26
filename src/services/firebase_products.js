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

  async updateProduct(productId, updatedData) {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updatedData);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw new Error("Falha ao atualizar produto");
    }
  },

  
  // Deletar produto (ou marcar como inativo)
  async deleteProduct(productId, imageUrl) {
    try {
      // Deleta do Firestore
      await deleteDoc(doc(db, 'products', productId));
      
      // Se houver imagem, deleta do Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      throw error;
    }
  }
};