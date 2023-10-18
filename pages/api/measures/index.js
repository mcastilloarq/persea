import { firestore } from '/firebase/admin';

const sampleMeasure = {
    stationId: 'station-123',
    puerto: '1',
    valor1: 23.5,
    valor2: 0,
    valor3: 0
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const payload = req.body;
            if (!payload.stationId || !payload.puerto) {
                return res.status(400).json({ error: 'Missing required fields: stationId, puerto' });
            }
            const newMeasure = {
                stationId: payload.stationId,
                slot: payload.puerto,
                valor1: payload.valor1 || 0,
                valor2: payload.valor2 || 0,
                valor3: payload.valor3 || 0,
                createdAt: new Date().toISOString()
            };
            const docRef = await firestore.collection('measures').add(newMeasure);
            const id = docRef.id;
            const createdAt = newMeasure.createdAt;

            return res.status(201).json({ id, createdAt });
        } catch (err) {
            console.error('POST /api/measures error', err);
            return res.status(500).json({ error: 'Failed to save measure', details: err.message });
        }
    }

    if (req.method === 'GET') {
        try {
            const { sensorId, limit = '50' } = req.query;
            const lim = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500);

            // queryRecords should return an array of records already normalized
            const records = await list('measures');

            return res.status(200).json({ count: records.length, records });
        } catch (err) {
            console.error('GET /api/records error', err);
            return res.status(500).json({ error: 'Failed to fetch records', details: err.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
