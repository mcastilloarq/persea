import { useState, useEffect } from "react";
import { getToken } from '/firebase/auth';

const lastRecordMock = {
  "name": "-",
  "id_number": 1,
  "description": "-",
  "prg1_actv_": "07:30:00",
  "prg2_actv_": "07:30:00",
  "prg3_actv_": "07:30:00",
  "prg4_actv_": "07:30:00",
  "prg1_duration_": 0,
  "prg2_duration_": 0,
  "prg3_duration_": 0,
  "prg4_duration_": 0,
  "prg1_calendar_": 0,
  "prg2_calendar_": 0,
  "prg3_calendar_": 0,
  "prg4_calendar_": 0,
  "external": 0,
  "auto": 0,
  "status": 0,
  "deviceIdType": 'valve',
};

const DAYS_TO_BYTE = {
  "L": 32,
  "M": 16,
  "X": 8,
  "J": 4,
  "V": 2,
  "S": 1,
  "D": 64,
};

export default function ValveCard({ device }) {
    const statSubtitle = device.type;
    const statTitle = device.name;
    const statArrow = "up";
    const statPercent = "3.48";
    const statPercentColor = "text-emerald-500";
    const statDescription = device.description;
    const statIconName = "fas fa-tint";
    const statIconColor = "bg-blue-500";

    const [lastRecord, setLastRecord] = useState(null);
    const [newData, setNewData] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    // modal
    const [selectedProgram, setSelectedProgram] = useState(1);

    const formatTime = (timeStr, format) => {
      const [hours, minutes, seconds] = timeStr.split(':');
      if (format === 'HH:mm') {
        return `${hours}:${minutes}`;
      }
      return timeStr;
    }

    const toggleModal = (event) => {
      event.stopPropagation();
      setNewData({...lastRecord});
      setIsOpen(!isOpen);
    }

    const handleSave = async () => {
      newData.slot = lastRecord.slot;
      newData.stationId = lastRecord.stationId;
      // newData.id = lastRecord.id;

      const token = await getToken();
      if (!token) {
          router.push('/auth/login');
          return;
      }

      console.log("Guardando datos:", newData);
      setIsOpen(false);
      try {
        const response = await fetch(
          // `/api/proxy?url=http://79.143.92.170:2010/api/Valvulas/actualizar`, {
          `/api/valves`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
          },
          referrerPolicy: 'no-referrer',
          body: JSON.stringify({
            ...newData,
            status: lastRecord.status,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Datos guardados:", data);
          setLastRecord({...data});
        } else {
          console.error("Error guardando datos:", response.statusText);
        }
      } catch (error) {
        console.error("Error guardando datos:", error);
      }
    };

    useEffect(() => {
      setLastRecord(device.lastRecord || {stationId: device.stationId, slot: device.slot, ...lastRecordMock});
    }, [device]);

    // useEffect(() => {
    //   const fetchLastRecord = async () => {
    //     try {
    //       const response = await fetch(
    //         `/api/proxy?url=http://79.143.92.170:2010/api/Valvulas/programas`,
    //         {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({
    //             method: 'GET',
    //             queryParams: {
    //               idPlaca: device.id_estacion,
    //               numValvula: device.num
    //             }
    //           })
    //         }
    //       );
    //       console.log("Fetching last record for device:", response);
    //       if (response.ok) {
    //         const data = await response.json();
    //         setLastRecord(data[0]);
    //         setNewData({ ...data[0] });
    //       } else {
    //         console.error("Error fetching last record:", response.statusText);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching last record:", error);
    //     }
    //   };
  
    //   fetchLastRecord();
    // }, [device, lastRecord?.externo]);

  return (
    <>
      <div className="flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg" onClick={e => toggleModal(e)}>
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                {statSubtitle}
              </h5>
              <span className="font-semibold text-xl text-blueGray-700">
                {lastRecord?.name || 'Cargando...'}
              </span>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              {/* descripcion */}
              <div className="text-sm text-blueGray-400">
                {lastRecord?.description || ''}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            {/* modo automatico status */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-emerald-500">
                <i className={lastRecord?.status === 1 ? "fas fa-check-circle text-emerald-500 mr-1" : "fas fa-times-circle text-red-500 mr-1"}></i>
              </div>
              <div className="text-lg font-semibold text-blueGray-700">
                {lastRecord ? (lastRecord.auto === 1 ? 'Automático' : 'Manual') : 'Cargando...'}
              </div>
            </div>
            {/* botón editar */}
            <div className="flex flex-col items-center">
              <button className="bg-blueGray-600 text-white px-3 py-1 rounded" onClick={e => toggleModal(e)}>
                <i className="fas fa-edit"></i> Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      <div className={`fixed top-0 left-0 w-full h-full ${isOpen ? 'block' : 'hidden'} inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-4 w-xs">
            <h3 className="text-lg font-semibold mb-2">Detalles de la Válvula</h3>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={newData?.name ?? ''}
                onChange={e => setNewData({ ...newData, name: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={newData?.description ?? ''}
                onChange={e => setNewData({ ...newData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={3}
              />
            </div>

            <hr className="my-4" />
            <p><strong>Estado:</strong> {lastRecord ? (lastRecord.status === 1 ? 'Abierta' : 'Cerrada') : 'Cargando...'}</p>
            <div className="my-2">
              <div className="flex items-center">
                <input type="checkbox"
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded"
                  checked={newData ? newData.auto == 1 : false}
                  onChange={() => setNewData({...newData, auto: newData.auto === 1 ? 0 : 1})}
                />
                <label className="ml-2 block text-sm text-gray-700">Modo Automático</label>
              </div>
            </div>

            {newData && newData.auto === 1 && (
              <>
                {/* tabs para los 4 programas */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Configurar Programa {selectedProgram}</h4>
                  <nav className="w-full flex space-x-4 justify-center" aria-label="Tabs">
                    {[1, 2, 3, 4].map(prgNum => (
                      <div key={prgNum} className="flex items-center">
                        <div className={`h-8 w-8 flex items-center justify-center border rounded cursor-pointer ${selectedProgram === prgNum ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700'}`}
                          onClick={() => setSelectedProgram(prgNum)}
                        >
                          {prgNum}
                        </div>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* formulario para configurar valvula */}
                <div className="mt-4">
                  <form>
                    {[1,2,3,4].map(n => (
                      <div key={n} className={`${selectedProgram === n ? 'block' : 'hidden'}`}>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">Hora de Activación</label>
                          <input type="time" defaultValue={newData ? formatTime(newData[`prg${n}_actv_`], 'HH:mm') : ''} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">Duración (min)</label>
                          <input type="number" min="0" 
                            defaultValue={newData ? newData[`prg${n}_duracion_`] : ''}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            onChange={e => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value >= 0) {
                                setNewData({...newData, [`prg${n}_duracion_`]: value});
                              }
                            }}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">Días de la Semana</label>
                          {/* checkboxes , days are expressed as byte code 1000000 is sunday, every day is a square div with a letter*/}
                          <div className="flex space-x-2 mt-1 justify-center">
                            {Object.keys(DAYS_TO_BYTE).map(day => (
                              <div key={day} className="flex items-center">
                                <div className={`h-8 w-8 flex items-center justify-center border rounded cursor-pointer ${newData && (newData[`prg${n}_calendar_`] & DAYS_TO_BYTE[day]) ? 'bg-emerald-500 text-white' : 'bg-white text-gray-700'}`}
                                  onClick={() => {
                                    if (newData) {
                                      const currentValue = newData[`prg${n}_calendar_`] || 0;
                                      const dayValue = DAYS_TO_BYTE[day];
                                      const newValue = (currentValue & dayValue) ? (currentValue - dayValue) : (currentValue + dayValue);
                                      setNewData({...newData, [`prg${n}_calendar_`]: newValue});
                                    }
                                  }}
                                >
                                  {day}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </form>
                </div>
              </>
            )}

            {newData && newData.auto === 0 && (
              <div className="mt-4 flex justify-between items-center">
                <h4 className="text-md font-semibold mb-2 mr-4">Control Manual</h4>
                <button className={`ml-4 px-4 py-2 min-w-8 rounded ${newData.externo === 1 ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-white'}`}
                  onClick={() => {
                    const newStatus = newData.externo === 1 ? 0 : 1;
                    setNewData({...newData, externo: newStatus});
                  }}
                >
                  {newData.externo === 1 ? 'Abierta' : 'Cerrada'}
                </button>
              </div>
            )}

            <hr className="my-4" />

            {/* botones */}

            <div className="mt-4 flex">
              <button className="flex-1 mr-2 bg-gray-200 text-white px-4 py-2 rounded" onClick={e => toggleModal(e)}>
                Cancelar
              </button>
              <button className="flex-1 bg-emerald-500 text-white px-4 py-2 rounded" onClick={() => handleSave()}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
