import { db } from '../firebase/config';
import { getAuth } from "firebase/auth";
// Adicione no início do arquivo
import Resizer from 'react-image-file-resizer';
import { 
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject 
} from 'firebase/storage';

const storage = getStorage();

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

export const uploadImage = async (file) => {
    try {
      // 1. Redimensiona a imagem (se estiver usando)
      // const resizedImage = await resizeFile(file);
      
      // 2. Gera nome único para o arquivo
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `category_images/${timestamp}_${Math.random().toString(36).substring(2)}.${extension}`;
      
      // 3. Faz upload da imagem
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);  // Usando uploadBytes simples
      
      // 4. Obtém a URL de download
      return await getDownloadURL(storageRef);
      
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
      throw new Error("Falha ao enviar a imagem");
    }
  };

  

export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    throw error;
  }
};

export const addCategory = async (categoryData) => {
    try {
      const auth = getAuth();
      if (!auth.currentUser) {
        throw new Error("Usuário não autenticado");
      }
  
      const docRef = await addDoc(collection(db, 'categories'), {
        name: categoryData.name,
        description: categoryData.description || '',
        imageUrl: categoryData.imageUrl || '',
        active: categoryData.active !== undefined ? categoryData.active : true,
        color: categoryData.color || '#6c757d',
        createdAt: serverTimestamp(), // Agora funcionará
        createdBy: auth.currentUser.uid
      });
      
      return docRef.id;
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      throw error;
    }
  };

  export const updateCategory = async (id, categoryData, oldImageUrl) => {
    try {
      if (categoryData.imageUrl && oldImageUrl && categoryData.imageUrl !== oldImageUrl) {
        await deleteImage(oldImageUrl);
      }
      
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, {
        name: categoryData.name,
        description: categoryData.description,
        imageUrl: categoryData.imageUrl,
        active: categoryData.active,
        color: categoryData.color,
        updatedAt: serverTimestamp() // Adicionando timestamp de atualização
      });
      
      return id;
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      throw error;
    }
  };

export const deleteCategory = async (category) => {
  try {
    // Deleta a imagem associada se existir
    if (category.imageUrl) {
      await deleteImage(category.imageUrl);
    }
    
    const categoryRef = doc(db, 'categories', category.id);
    await deleteDoc(categoryRef);
    return category.id;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    throw error;
  }
};