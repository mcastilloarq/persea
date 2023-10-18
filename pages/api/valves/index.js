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

  if (['GET', 'POST'].includes(req.method) === false) {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (req.method === "GET") {
    const stationId = req.query.idPlaca;
    const slot = req.query.numValvula;
    
    try {
      const valvesSnapshot = await firestore.collection("valves")
        .where("stationId", "==", stationId)
        .where("slot", "==", slot.toString())
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();
      
      if (valvesSnapshot.empty) {
        return res.status(404).json({ error: "Valve not found" });
      }

      const data = valvesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const valveData = data[0];

      // Esta es la respuesta que espera manolo
      const response = [
        {
          "id_valvula": valveData.slot,
          "id_placa": valveData.stationId,
          "nombre": valveData.name || "Válvula",
          "id_number": 1,
          "descripcion": valveData.description || "-",
          "prg1_actv_": valveData.prg1_actv_ || "07:30:00",
          "prg2_actv_": valveData.prg2_actv_ || "07:30:00",
          "prg3_actv_": valveData.prg3_actv_ || "07:30:00",
          "prg4_actv_": valveData.prg4_actv_ || "07:30:00",
          "prg1_duracion_": valveData.prg1_duracion_ || 0,
          "prg2_duracion_": valveData.prg2_duracion_ || 0,
          "prg3_duracion_": valveData.prg3_duracion_ || 0,
          "prg4_duracion_": valveData.prg4_duracion_ || 0,
          "prg1_calendar_": valveData.prg1_calendar_ || 0,
          "prg2_calendar_": valveData.prg2_calendar_ || 0,
          "prg3_calendar_": valveData.prg3_calendar_ || 0,
          "prg4_calendar_": valveData.prg4_calendar_ || 0,
          "externo": valveData.external || 0,
          "auto": valveData.auto || 0,
          "status": valveData.status || 0
        }
      ];

      return res.status(200).json(response);
    } catch (err) {
      console.error("Get valves error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  } 

  if (req.method === "POST") {
    try {
      const payload = req.body || {};
      console.log("Create station payload:", payload);
      // simple validation; require a name field
      // if (!payload.name) {
      //   return res.status(400).json({ error: "Missing required field: name" });
      // }

      if (payload.id) {
        const docRef = await firestore.collection("valves").doc(payload.id).get();
        if (docRef.exists) {
          await docRef.ref.set({
            ...payload,
            updatedAt: new Date().getTime(),
          }, { merge: true });
          const updatedSnap = await docRef.ref.get();
          return res.status(200).json({ id: docRef.id, ...updatedSnap.data() });
        }
      } else {
        const newDocRef = await firestore.collection("valves").add({
          ...payload,
          createdAt: new Date().getTime(),
        });

        const docSnap = await newDocRef.get();
        return res.status(201).json({ id: newDocRef.id, ...docSnap.data() });
      }
    } catch (err) {
      console.error("Create station error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

}
