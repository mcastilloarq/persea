import { auth, firestore } from '/firebase/admin';

const ADMIN_UID = 'WI7DK1KHBPNwg8qIwEnR8DTcgA92'; // process.env.ADMIN_UID

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
  const decodedToken = await auth.verifyIdToken(token).catch(() => null);
  const user = decodedToken ? decodedToken.uid : null;
  const clientId = req.query.clientId;

  if (![ADMIN_UID, clientId].includes(user)) { // process.env.ADMIN_UID
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  if (!clientId) {
    return res.status(400).json({ error: 'Bad Request: Missing clientId' });
  }

  if (req.method === 'GET') {
    try {
      const client = await firestore.collection('clients').doc(clientId).get();
      
      if (!client.exists) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      const clientData = client.data();
      
      const fincasSnapshot = await firestore.collection('fincas').where('clientId', '==', clientId).get();
      const fincas = fincasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (clientData && fincas.length > 0) {
        clientData.fincas = fincas;
      }

      return res.status(200).json({ client: { id: client.id, ...clientData } });
    } catch (err) {
      console.error('GET /api/clients error', err);
      return res.status(500).json({ error: 'Failed to fetch records', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
