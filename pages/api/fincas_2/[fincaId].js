import { auth, firestore } from '/firebase/admin';

const ADMIN_UID = 'WI7DK1KHBPNwg8qIwEnR8DTcgA92'; // process.env.ADMIN_UID

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;
  const decodedToken = await auth.verifyIdToken(token).catch(() => null);
  const user = decodedToken ? decodedToken.uid : null;
  const fincaId = req.query.fincaId;

  if (![ADMIN_UID, fincaId].includes(user)) { // process.env.ADMIN_UID
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  if (!fincaId) {
    return res.status(400).json({ error: 'Bad Request: Missing fincaId' });
  }

  if (req.method === 'GET') {
    try {
      const finca = await firestore.collection('fincas').doc(fincaId).get();

      if (!finca.exists) {
        return res.status(404).json({ error: 'Finca not found' });
      }

      const fincaData = finca.data();

      const stationsSnapshot = await firestore.collection('stations').where('fincaId', '==', fincaId).get();

      if (!stationsSnapshot.empty) {
        const stations = stationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (fincaData && stations.length > 0) {
          fincaData.stations = stations;
        }

        // GET last measure for each station's devices
        fincaData.stations = await Promise.all(fincaData.stations.map(async (station) => {
          const updatedStation = { ...station };
          for (let i = 1; i <= 8; i++) {
            const deviceIdType = station[`device${i}`];
            if (deviceIdType && deviceIdType !== 'valve') {
              const measuresSnapshot = await firestore.collection('measures')
                .where('stationId', '==', station.id)
                .where('slot', '==', i.toString())
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();
              if (!measuresSnapshot.empty) {
                const measureDoc = measuresSnapshot.docs[0];
                updatedStation[`measure${i}`] = { id: measureDoc.id, ...measureDoc.data(), deviceIdType };
              }
            } else if (deviceIdType === 'valve') {
              // For valves, you might want to fetch their status differently if needed
              const valveSnapshot = await firestore.collection('valves')
                .where('stationId', '==', station.id)
                .where('slot', '==', i.toString())
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();
              if (!valveSnapshot.empty) {
                const valveDoc = valveSnapshot.docs[0];
                updatedStation[`measure${i}`] = { id: valveDoc.id, ...valveDoc.data(), deviceIdType };
              } else {
                updatedStation[`measure${i}`] = null;
              }
            }
          }
          return updatedStation;
        }));
      }


      return res.status(200).json({ finca: { id: finca.id, ...fincaData } });
    } catch (err) {
      console.error('GET /api/fincas error', err);
      return res.status(500).json({ error: 'Failed to fetch records', details: err.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
