import { db } from '../firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

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