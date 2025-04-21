import { db } from '../firebase/config';
import { getAuth } from "firebase/auth";
// Adicione no início do arquivo
import Resizer from 'react-image-file-resizer';
import { 
  collection, getDocs, addDoc, doc, updateDoc, deleteDoc 
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

  // Adicione esta função para redimensionar imagens no cliente
const resizeImage = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(resolve, 'image/jpeg', 0.7);
      };
    };
    reader.readAsDataURL(file);
  });

  const resizeFile = (file) => new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      800,                   // Largura máxima
      800,                   // Altura máxima
      'JPEG',                // Formato de saída
      70,                    // Qualidade
      0,                     // Rotação
      (uri) => {
        // Verifica se o resultado é válido
        if (!uri) {
          reject(new Error('Falha no redimensionamento'));
          return;
        }
        
        // Converte DataURL para Blob se necessário
        if (typeof uri === 'string') {
          fetch(uri)
            .then(res => res.blob())
            .then(resolve)
            .catch(reject);
        } else {
          resolve(uri);
        }
      },
      'blob'                // Saída como Blob (mais eficiente)
    );
  });
  

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
      ...categoryData,
      createdBy: auth.currentUser.uid,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar categoria:", error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData, oldImageUrl) => {
  try {
    // Se tiver nova imagem, deleta a antiga
    if (categoryData.imageUrl && oldImageUrl) {
      await deleteImage(oldImageUrl);
    }
    
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: new Date()
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