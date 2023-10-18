import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve('./firebase/firebase-service-account.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<TU_ID_DE_PROYECTO>.firebaseio.com'
  });
}

export default admin;

export const firestore = admin.firestore();
export const auth = admin.auth();
