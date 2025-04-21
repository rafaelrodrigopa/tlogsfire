import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const addCategory = async (categoryData) => {
  await addDoc(collection(db, 'categories'), categoryData);
};