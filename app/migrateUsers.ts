import { db } from './firebaseConfig';
import { collection, setDoc, doc } from 'firebase/firestore';

const users = [{"name":"Alice","id":1,"avatar":"/images/pet1.png"},{"name":"Bob","id":2,"avatar":"/images/pet1.png"},{"name":"Charlie","id":3,"avatar":"/images/pet1.png"}];

async function migrateUsers() {
  for (const u of users) {
    await setDoc(doc(db, 'users', u.id.toString()), u);
  }
  console.log('✅ Usuarios migrados a Firestore');
}

migrateUsers();