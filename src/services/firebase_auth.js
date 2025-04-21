import { 
    auth, 
    db 
  } from '../firebase/config';
  import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { 
    doc, 
    setDoc, 
    collection, 
    getDocs, 
    query, 
    orderBy,
    serverTimestamp
  } from 'firebase/firestore';
  
  // Cadastrar novo usuário
  export const registerUser = async (email, password, userData) => {
    try {
      // 1. Cria no Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // 2. Cria documento no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: userData.displayName || '',
        role: 'user', // padrão
        createdAt: serverTimestamp(),
        lastLogin: null,
        disabled: false,
        ...userData
      });
  
      return user;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      throw error;
    }
  };
  
  // Login do usuário
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Atualiza último login no Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
  
      return userCredential.user;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };
  
  // Logout
  export const logoutUser = async () => {
    await signOut(auth);
  };
  
  // Listar usuários (do Firestore)
  export const listUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  };
  
  // Observador de estado de autenticação
  export const onAuthStateChangedListener = (callback) => {
    return onAuthStateChanged(auth, callback);
  };