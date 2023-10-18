import fetch from 'node-fetch';

const API_URL = 'http://79.143.92.170:2010/api/';

export default async function handler(req, res) {
    const finca_id = req.query.finca_id;
    if (!finca_id) {
        res.status(400).json({ error: 'Missing finca_id parameter' });
        return;
    }

    const fincaResponse = await fetch(`${API_URL}fincas/fincasid?idfinca=${finca_id}`)
    let fincaData = await fincaResponse.json();
    fincaData = fincaData.length > 0 ? fincaData[0] : null;
    if (!fincaResponse.ok) {
        res.status(fincaResponse.status).json({ error: fincaData.error || 'Error fetching finca data' });
        return;
    }


    // devices {1 - Teros 12, 2 - Teros 10, 3 - SM100}
    const devices = [];
    for (let i = 1; i <= 3; i++) {
        const deviceResponse = await fetch(`${API_URL}Dispositivo/Dispositivo?id_dispositivo=${i}`);
        const data = await deviceResponse.json();
        if (deviceResponse.ok) {
            devices.push(data[0]);
        } else {
            devices.push(null);
        }
    }

    const estacionesResponse = await fetch(`${API_URL}Estación/estaciones?id_finca=${finca_id}`);
    const estacionesData = await estacionesResponse.json();
    if (!estacionesResponse.ok) {
        res.status(estacionesResponse.status).json({ error: estacionesData.error || 'Error fetching estaciones data' });
        return;
    }

    if (estacionesData.length === 0) {
        res.status(200).json({ finca: fincaData, estaciones: [], lastRecord: null });
        return;
    }

    await Promise.all(estacionesData.map(async estacion => {
        estacion.devices = [];
        
        // battery
        const batteryResponse = await fetch(`${API_URL}Mediciones/Last?clienteId=${fincaData.id_cliente}&fincaId=${finca_id}&estacionId=${estacion.id_estacion}&dispositivoId=4`);
        const batteryData = await batteryResponse.json();
        estacion.battery = batteryResponse.ok ? batteryData : null;
        estacion.devices.push(batteryData);

        // devices data
        devices.forEach(async device => {
            if (!device) return;
            try {
                const lastRecordResponse = await fetch(`${API_URL}Mediciones/Last?clienteId=${fincaData.id_cliente}&fincaId=${finca_id}&estacionId=${estacion.id_estacion}&dispositivoId=${device.id_sensor}`);
                const lastRecordText = await lastRecordResponse.clone().text();
                if (lastRecordText.startsWith("No se encontró")) throw new Error('Error fetching last record');
                const lastRecordData = await lastRecordResponse.json();
                if (lastRecordResponse.ok) {
                    estacion[device.nombre] = {
                        ...device,
                        lastRecord: lastRecordData
                    };
                    estacion.devices.push({ ...device, lastRecord: lastRecordData });
                } else {
                    estacion[device.nombre] = {
                        ...device,
                        lastRecord: null
                    };
                }
            } catch (error) {
                console.error('Error fetching last record:', error);
                estacion[device.nombre] = {
                    ...device,
                    lastRecord: null
                };
            }
        });
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second to avoid overwhelming the API
        return estacion;
    }));

    res.status(200).json({ finca: fincaData, estaciones: estacionesData });
}
