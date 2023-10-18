import { firestore, auth } from '/firebase/admin';

const ADMIN_UID = 'WI7DK1KHBPNwg8qIwEnR8DTcgA92'; // process.env.ADMIN_UID

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
  const decodedToken = await auth.verifyIdToken(token).catch(() => null);
  const user = decodedToken ? decodedToken.uid : null;
  const fincaId = req.query.fincaId;
  const stationId = req.query.stationId;

  if (![ADMIN_UID].includes(user)) { // process.env.ADMIN_UID
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  if (['POST', 'GET'].includes(req.method) === false) {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.method === "GET") {
    try {
      const stations = await firestore.collection("stations").where("id", "==", stationId).get();
      const data = stations.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json(data);
    } catch (err) {
      console.error("Get stations error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
        const payload = req.body || {};
        console.log("Create station payload:", payload);
        // simple validation; require a name field
        if (!payload.name) {
        return res.status(400).json({ error: "Missing required field: name" });
        }

        const docRef = await firestore.collection("stations").add({
        ...payload,
        createdAt: new Date().getTime(),
        });

        const docSnap = await docRef.get();
        return res.status(201).json({ id: docRef.id, ...docSnap.data() });
    } catch (err) {
        console.error("Create station error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
  }

}