import { useState, useEffect } from "react";

// components

import DeviceCard from "/components/stations/DeviceCard.js";

const DISPOSITIVOS = [
  {"id_sensor":1,"tipo":"SDI-12","param1":"Humedad %","param2":"Temperatura ºC","param3":"Conductividad dS/m","nombre":"Teros 12"},
  {"id_sensor":2,"tipo":"Analógico","param1":"Humedad %","param2":"0","param3":"0","nombre":"Teros 10"},
  {"id_sensor":3,"tipo":"Analógico","param1":"Humedad %","param2":"0","param3":"0","nombre":"SM100"},
  {"id_sensor":4,"tipo":"Analógico","param1":"Nivel %","param2":"0","param3":"0","nombre":"Batería"},
  {"id_sensor":5,"tipo":"Valve","param1":"0","param2":"0","param3":"0","nombre":"Válvula"}
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

export default function EstacionStats({ estacion }) {
  const [devices, setDevices] = useState([]);
  const [batteryDevice, setBatteryDevice] = useState(null);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      if (estacion) {

        const tempDevices = [];
        const num = {};
        for(let i = 1; i <= 8; i++) {
          const configKey = `config${i}`;
          const deviceId = estacion[configKey];
          if (deviceId && deviceId !== 0) {
            const device = DISPOSITIVOS.find(d => d.id_sensor === deviceId);
            if (device) {
              device.lastRecord = RECORDS
                .find(r => r.estacionId === estacion.id_estacion && r.sensorId === device.id_sensor);
              num[device.nombre] = (num[device.nombre] || 0) + 1;
              if (num[device.nombre]) {
                device.num = num[device.nombre];
              }
              device.id_estacion = estacion.id_estacion;
              device.icon = ICONS[device.nombre] || "fas fa-question";
              device.key = `${estacion.id_estacion}-${i}-${device.nombre}`; // add key to identify the config slot
              device.clienteId = estacion.id_cliente || 1; // add clientId for later use
              device.fincaId = estacion.id_finca || 1; // add fincaId for later use
              if (device.nombre === "Batería") {
                setBatteryDevice(device);
              } else {
                tempDevices.push({...device});
              }
            }
          }
        }
        setDevices(tempDevices);
      }
    };

    fetchData();
  }, [estacion]);

  return (
    <>
      <div
        key={estacion.id_estacion}
        className="cursor-pointer px-4 py-2 mb-2 rounded transition bg-white border hover:bg-gray-100"
        onClick={() => setSelected(!selected)}
      >
        <div className="flex justify-between items-center">
          <div>
            <strong>{estacion.nombre}</strong>
            <span className="ml-2 text-sm text-blueGray-400">{`lat: ${estacion.latitud} - lng: ${estacion.longitud}`}</span>
          </div>
          <div>
            {estacion.battery ? (
              <div className="flex items-center">
                <i className={`fas ${estacion.battery.valor1 > 50 ? 'fa-battery-full' : 'fa-battery-half'} text-${estacion.battery.valor1 > 20 ? 'emerald' : 'red'}-500 mr-2`}></i>
                <span className="text-sm text-blueGray-400">
                  {`Batería: ${estacion.battery.valor1}%`}
                </span>
              </div>
            ) : (
              <div className="text-sm text-blueGray-400">No hay datos de batería</div>
            )}
          </div>
        </div>
        <div className="text-gray-500 font-extralight">{estacion.descripcion}</div>
        <div className={`relative mt-8 ${selected ? 'block' : 'hidden'}`}>
          <div className="mx-auto w-full">
            <div>
              <div className="flex flex-wrap">
                {devices.map((device) => (
                  <div key={device.key} className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                    <DeviceCard device={device} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
