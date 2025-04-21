import { db } from '../firebase/config';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, categoryData);
    return id;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
    return id;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    throw error;
  }
};