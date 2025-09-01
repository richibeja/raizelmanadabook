import { db } from './firebaseConfig';
import { collection, setDoc, doc } from 'firebase/firestore';

const posts = [{"user":"Alice","id":1,"text":"¡Hola! Esta es mi primera publicación.","image":"/images/post1.png"},{"user":"Bob","id":2,"text":"Me encanta esta red social para mascotas!","image":"/images/post2.png"},{"user":"Charlie","id":3,"text":"Nuevo producto en la tienda: Pelotas mágicas!","image":"/images/product1.png"}];

async function migratePosts() {
  for (const p of posts) {
    await setDoc(doc(db, 'posts', p.id.toString()), p);
  }
  console.log('✅ Posts migrados a Firestore');
}

migratePosts();