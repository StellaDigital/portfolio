import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyD0rvi2AiOc7xf7KJnvHQnuAdJKdZctxiQ",
  authDomain: "gallery-portfolio--development.firebaseapp.com",
  projectId: "gallery-portfolio--development",
  storageBucket: "gallery-portfolio--development.appspot.com",
  messagingSenderId: "678429459254",
  appId: "1:678429459254:web:7d4da58c19bd44cb67e997",
  measurementId: "G-GRX7RJW35L"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Performance Monitoring and get a reference to the service
const app = firebase.app();

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;

// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Gets a users/{uid} document with username
 * @param  {string} gallery
 */
export async function getGalleryByName(gallery) {
  const galleryRef = firestore.collection('gallery');
  const query = galleryRef.where('slug', '==', gallery).limit(1);
  const galleryDoc = (await query.get()).docs[0];
  return galleryDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt ? data.updatedAt.toMillis() : null,
  };
}
