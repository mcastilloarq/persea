import { useState } from "react";

export default function Teros12Card({ device }) {
  const statSubtitle = device.tipo;
  const statTitle = device.nombre;

  const [lastRecord, setLastRecord] = useState(device.lastRecord || {});

  const ICONS = {
    "Humedad": "fas fa-tint",
    "Temperatura": "fas fa-thermometer-half",
    "Conductividad": "fas fa-bolt",
  };

  const getIconName = (param) => {
    const paramName = param.split(' ')[0]; // Get the first word
    return ICONS[paramName] || "fas fa-question";
  }

  const getUnit = (param) => {
    const parts = param.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                {statSubtitle}
              </h5>
              <span className="font-semibold text-xl text-blueGray-700">
                {statTitle}
              </span>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex flex-col items-center">
              <div className="text-sm text-emerald-500">
                <i className={getIconName(device.param1) + " mr-1"}></i>
              </div>
              <div className="text-lg font-semibold text-blueGray-700">
                {lastRecord?.valor1} <span className="font-light">{getUnit(device.param1)}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm text-emerald-500">
                <i className={getIconName(device.param2) + " mr-1"}></i>
              </div>
              <div className="text-lg font-semibold text-blueGray-700">
                {lastRecord?.valor2} <span className="font-light">{getUnit(device.param2)}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm text-emerald-500">
                <i className={getIconName(device.param3) + " mr-1"}></i>
              </div>
              <div className="text-lg font-semibold text-blueGray-700">
                {lastRecord?.valor3} <span className="font-light">{getUnit(device.param3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
