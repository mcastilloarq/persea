import { useState, useEffect } from "react";
import { useRouter } from 'next/router'

// components

import EstacionStats from "/components/Headers/EstacionStats.js";

// layout for page

import Finca from "/layouts/Finca.js";

const FINCAS = [
  {"id_finca":1,"id_cliente":1,"nombre":"Olivares","descripcion":"Finca en río seco bajo, producción aguacate, mangos y chirimoya","latitud":36.756234,"longitud":-3.692590,"población":"Almuñécar","provincia":"Granada"},
  {"id_finca":2,"id_cliente":2,"nombre":"Herradura","descripcion":"Cultivo de aguacates","latitud":36.756347,"longitud":-3.760354,"población":"La herradura","provincia":"Granada"},
  {"id_finca":3,"id_cliente":2,"nombre":"Molvízar","descripcion":"Cultivo de mangos","latitud":36.786756,"longitud":-3.594298,"población":"Molvízar","provincia":"Granada"},
];

const ESTACIONES = [
  {"id_estacion":1,"id_finca":1,"nombre":"Catifa","descripcion":"Estación para controlar el riego y parámetros de aguacate","id_PCB":1,"latitud":36.756201,"longitud":-3.692847,"config1":4,"config2":1,"config3":3,"config4":5,"config5":5,"config6":0,"config7":0,"config8":0},
  {"id_estacion":2,"id_finca":2,"nombre":"Depósito de agua","descripcion":"Control de agua","id_PCB":1,"latitud":36.756347,"longitud":-3.760354,"config1":4,"config2":1,"config3":3,"config4":5,"config5":5,"config6":0,"config7":0,"config8":0},
  {"id_estacion":3,"id_finca":2,"nombre":"Cabezal de riego y sensores","descripcion":"Cabezal de riego y sensores","id_PCB":1,"latitud":36.756374,"longitud":-3.760380,"config1":4,"config2":1,"config3":3,"config4":5,"config5":5,"config6":0,"config7":0,"config8":0},
  {"id_estacion":4,"id_finca":3,"nombre":"Cabezal de riego 1","descripcion":"Cabezal de riego 1 (mangos Molvízar)","id_PCB":1,"latitud":36.786756,"longitud":-3.594298,"config1":4,"config2":1,"config3":3,"config4":5,"config5":5,"config6":0,"config7":0,"config8":0},
  {"id_estacion":5,"id_finca":3,"nombre":"Cabezal riego invernadero","descripcion":"Cabezal riego invernadero","id_PCB":1,"latitud":36.786133,"longitud":-3.594102,"config1":4,"config2":1,"config3":3,"config4":5,"config5":5,"config6":0,"config7":0,"config8":0},
  {"id_estacion":6,"id_finca":3,"nombre":"Cabezal riego nave","descripcion":"Cabezal riego nave","id_PCB":1,"latitud":36.785906,"longitud":-3.593899,"config1":4,"config2":1,"config3":3,"config4":5,"config5":5,"config6":0,"config7":0,"config8":0}
];

export default function Dashboard() {
  const router = useRouter();
  const { finca_id } = router.query;
  const [fincaData, setFincaData] = useState(null);
  const [estacionesData, setEstacionesData] = useState([]);

  useEffect(() => {

    if(!finca_id) {
      router.push('/admin/fincas')
    } else {
      const fetchData = async () => {
        try {
          // const fincaUrl = `/api/proxy?url=http://79.143.92.170:2010/api/fincas/fincasid`;
          // const response = await fetch(
          //   fincaUrl,
          //   { method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify({
          //       method: 'GET',
          //       queryParams: {
          //         idfinca: finca_id
          //       }
          //     })
          //   }
          // );
          const response = await fetch(`/api/fincas/${finca_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setFincaData(data);
        } catch (error) {
          console.error("Error fetching finca data:", error);
          const finca = FINCAS.find(finca => finca.id_finca === parseInt(finca_id)) || null;
          setFincaData(finca); // Fallback to static data if API fails
        }
      };
      fetchData();
    }
  }, [finca_id, router])

  // useEffect(() => {
  //   if(fincaData) {
  //     const map = new window.google.maps.Map(document.getElementById("map"), {
  //       center: { lat: fincaData.latitud, lng: fincaData.longitud },
  //       zoom: 15,
  //     });

  //     new window.google.maps.Marker({
  //       position: { lat: fincaData.latitud, lng: fincaData.longitud },
  //       map,
  //       title: fincaData.nombre,
  //     });
  //   }
  // }, [fincaData]);

  // fetch estaciones data
  useEffect(() => {
    if(!finca_id) {
      return null
    } else {
      const fetchEstaciones = async () => {
        try {
          const estacionesUrl = `/api/proxy?url=http://79.143.92.170:2010/api/Estación/estaciones?id_finca=${finca_id}`;
          const response = await fetch(estacionesUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            referrerPolicy: 'no-referrer'
          });
          const data = await response.json();
          setEstacionesData(data);
        } catch (error) {
          console.error("Error fetching estaciones data:", error);
          const estaciones = ESTACIONES.filter(estacion => estacion.id_finca === parseInt(finca_id)) || [];
          estaciones.forEach(estacion => {
            estacion.cliente_id = fincaData?.id_cliente || 1;
          });
          setEstacionesData(estaciones); // Fallback to static data if API fails
        }
      };
      fetchEstaciones();
    }
  }, [finca_id]);

  return (
    <>
      {fincaData && (
        <>
          <h1 className="text-3xl font-bold">
            Finca: {fincaData?.nombre || ''}
          </h1>
          <h3 className="text-lg mt-1 mb-4">
            {fincaData?.descripcion || ''}
          </h3>
          <hr className="mb-4" />
          
          <h1 className="text-2xl mt-1 mb-4">
            Estaciones:
          </h1>
          {fincaData?.estaciones.length > 0 ? (
            <ul className="mb-4">
              {fincaData?.estaciones.map((estacion) => (
                <EstacionStats estacion={estacion} key={estacion.id_estacion} />
              ))}
            </ul>
          ) : (
            <p className="mb-4">No hay estaciones disponibles para esta finca.</p>
          )}
        </>
      )}
    </>
  );
}

Dashboard.layout = Finca;
