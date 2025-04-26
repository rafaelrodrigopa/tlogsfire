import { db } from '../firebase/config';
import { collection, doc, deleteDoc, addDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

const productsCollection = collection(db, 'products');

export const productService = {
  async addProduct(productData) {
    try {
      // Garante que o estoque seja um número
      const productWithStock = {
        ...productData,
        estoque: Number(productData.estoque) || 0
      };
      
      const docRef = await addDoc(collection(db, 'products'), productWithStock);
      return docRef.id;
    } catch (error) {
      console.error("Erro no Firebase:", {
        code: error.code,
        message: error.message
      });
      throw new Error("Falha na comunicação com o servidor");
    }
  },

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
      // Garante que o estoque seja um número
      const updatedDataWithStock = {
        ...updatedData,
        estoque: Number(updatedData.estoque) || 0
      };
      
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updatedDataWithStock);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw new Error("Falha ao atualizar produto");
    }
  },

  async deleteProduct(productId, imageUrl) {
    try {
      await deleteDoc(doc(db, 'products', productId));
      
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