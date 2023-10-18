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

  if (['PUT', 'GET', 'DELETE'].includes(req.method) === false) {
    res.setHeader("Allow", "PUT, GET, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.method === "GET") {
    try {
      const stations = await firestore.collection("stations").doc(stationId).get();
      const data = stations.exists ? { id: stations.id, ...stations.data() } : null;
      return res.status(200).json(data);
    } catch (err) {
      console.error("Get stations error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const payload = req.body || {};
      console.log("Update station payload:", payload);
      // simple validation; require a name field
      if (!payload.name) {
        return res.status(400).json({ error: "Missing required field: name" });
      }

      const docRef = firestore.collection("stations").doc(stationId);
      await docRef.update({
          ...payload,
          updatedAt: new Date().getTime(),
      });

      const docSnap = await docRef.get();
      return res.status(200).json({ id: docRef.id, ...docSnap.data() });
    } catch (err) {
      console.error("Update station error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await firestore.collection("stations").doc(stationId).delete();
      return res.status(204).end();
    } catch (err) {
      console.error("Delete station error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}