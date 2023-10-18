import { list, get, save } from '/firebase/db';
import { auth, firestore } from '/firebase/admin';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  if (req.method === 'POST') {
    // create client
    try {
      const { email, password, displayName } = req.body;
      const userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });

      await save('clients', userRecord.uid, { email, displayName });

      return res.status(201).json({ client: userRecord });
    } catch (err) {
      console.error('Error creating client: ', err);
      return res.status(500).json({ error: 'Failed to save record', details: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const clients = await firestore.collection('clients').get().then(snapshot => {
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      });
      
      return res.status(200).json({ count: clients.length, clients: clients });
    } catch (err) {
      console.error('GET /api/records error', err);
      return res.status(500).json({ error: 'Failed to fetch records', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
