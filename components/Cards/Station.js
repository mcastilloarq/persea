import { useState, useEffect } from "react";

// components

import DeviceCard from "/components/stations/DeviceCard.js";

const DISPOSITIVOS = [
  {"id_sensor":1,"type": "teros-12","tipo":"SDI-12","param1":"Humedad %","param2":"Temperatura ºC","param3":"Conductividad dS/m","nombre":"Teros 12"},
  {"id_sensor":2,"type": "teros-10","tipo":"Analógico","param1":"Humedad %","param2":"0","param3":"0","nombre":"Teros 10"},
  {"id_sensor":3,"type": "sm-100","tipo":"Analógico","param1":"Humedad %","param2":"0","param3":"0","nombre":"SM100"},
  // {"id_sensor":4,"type": "battery","tipo":"Analógico","param1":"Nivel %","param2":"0","param3":"0","nombre":"Batería"},
  {"id_sensor":5,"type": "valve","tipo":"Valve","param1":"0","param2":"0","param3":"0","nombre":"Válvula"}
];

const RECORDS = [
  {"clienteId":1,"fincaId":1,"estacionId":1,"sensorId":1,"valor1":65.80,"valor2":0.00,"valor3":0.00,"fecha":"2025-10-10T17:24:31"},
  {"clienteId":1,"fincaId":1,"estacionId":1,"sensorId":3,"valor1":23.05,"valor2":0,"valor3":0,"fecha":"2025-10-10T17:24:31"},
  {"clienteId":1,"fincaId":1,"estacionId":1,"sensorId":4,"valor1":78.10,"valor2":0.00,"valor3":0.00,"fecha":"2025-10-10T17:24:30"},
];

const ICONS = {
  "Batería": "fas fa-battery-half",
  "Teros 10": "fas fa-thermometer-half",
  "Teros 12": "fas fa-tint",
  "SM100": "fas fa-thermometer-full",
  "Válvula": "fas fa-filter"
}

export default function Station({ station }) {
  const [devices, setDevices] = useState([]);
  const [batteryDevice, setBatteryDevice] = useState(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      if (station) {
 
        const tempDevices = [];
        for (let i = 1; i <= 8; i++) {
          const deviceIdType = station[`device${i}`];
          if (deviceIdType) {
            const device = DISPOSITIVOS.find(d => d.type === deviceIdType);
            if (device) {
              device.lastRecord = station[`measure${i}`] || null;
              device.stationId = station.id;
              device.icon = ICONS[device.nombre] || "fas fa-question";
              device.key = `${station.id}-${i}-${device.nombre}`;
              device.type = deviceIdType;
              device.slot = i.toString();
              tempDevices.push({...device});
            } else if(deviceIdType === 'battery') {
              const battery = station[`measure${i}`] || null;
              if (battery) {
                setBatteryDevice({
                  nombre: "Batería",
                  icon: ICONS["Batería"],
                  lastRecord: battery.valor1,
                  key: `${station.id}-${i}-Batería`
                });
              }
            }
          }
        }
        setDevices(tempDevices);
      }
    };

    fetchData();
  }, [station]);

  return (
    <>
      <div
        className="cursor-pointer px-4 py-2 mb-2 rounded transition bg-white border hover:bg-gray-100"
        onClick={() => setSelected(!selected)}
      >
        <div className="flex justify-between items-center">
          <div>
            <strong>{station.name}</strong>
            <span className="ml-2 text-sm text-blueGray-400">{`lat: ${station.lat} - lng: ${station.lng} `}</span>
          </div>
          <div className="flex items-center space-x-4">
            {batteryDevice ? (
              <div className="flex items-center">
                <i className={`fas ${batteryDevice.lastRecord > 50 ? 'fa-battery-full' : 'fa-battery-half'} text-${batteryDevice.lastRecord > 20 ? 'emerald' : 'red'}-500 mr-2`}></i>
                <span className="text-sm text-blueGray-400">
                  {`Batería: ${batteryDevice.lastRecord}%`}
                </span>
              </div>
            ) : (
              <div className="text-sm text-blueGray-400">No hay datos de batería</div>
            )}
            <a
              href={`/admin/stations/crud?fincaId=${station.fincaId}&stationId=${station.id}`}
              onClick={(e) => e.stopPropagation()}
              className="ml-8 text-sm hover:underline"
              style={{ color: '#0366d6' }}
            >
              <i className="fas fa-edit"></i>
            </a>
          </div>
        </div>
        <div className="text-gray-500 font-extralight">{station.description}</div>
        <div className={`relative mt-8 ${selected ? 'block' : 'hidden'}`}>
          <div className="mx-auto w-full">
            {devices.length > 0 ? (
              <div className="flex flex-wrap">
                {devices.map((device) => (
                  <div key={device.key} className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                    <DeviceCard device={device} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No hay dispositivos asociados a esta estación.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
