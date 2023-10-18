import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getToken } from '/firebase/auth';
import Link from 'next/link'
import Admin from "/layouts/Admin.js";

import Station from '/components/Cards/Station.js'

export default function FincaPage() {
  const router = useRouter()
  const { fincaId } = router.query

  const [finca, setFinca] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFinca = async () => {
      if (!fincaId) return

      const token = await getToken();

      if (!token) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      fetch(`/api/fincas_2/${encodeURIComponent(fincaId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load finca')
        return res.json()
      })
      .then((data) => setFinca(data.finca))
      .catch((err) => setError(err.message || 'Unknown error'))
      .finally(() => setLoading(false))

    };

    fetchFinca()
  }, [fincaId])

  return (
    <div className="p-8">
      {loading && fincaId && <p>Cargando datos de la finca...</p>}

      {finca && (
        <>
          <Link legacyBehavior href={`/admin/clients/${finca.clientId}`}>
              <a>← Volver</a>
          </Link>
          <section style={{ marginTop: 12 }}>
            <div className="mb-4">
              <div>Finca: </div>
              <div className="text-3xl font-bold">{finca?.name || `Finca ${fincaId}`}</div>
              <div className="text-xs text-gray-500">ID: {fincaId}</div>
            </div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-lg mt-1 mb-4">
                  {finca?.description || ''}
                </h3>
                <h3 className="text-2xl font-bold">Estaciones</h3>
              </div>
              <Link legacyBehavior href={`/admin/stations/crud?fincaId=${fincaId}`}>
                  <a
                      style={{
                          backgroundColor: '#0366d6',
                          color: '#fff',
                          padding: '6px 12px',
                          borderRadius: 4,
                          textDecoration: 'none',
                      }}
                  >
                      Nueva Estación
                  </a>
              </Link>
            </div>

            <hr className="my-4" />

            {finca.stations?.length > 0 ? (
              <ul className="mb-4">
                {finca.stations.map((station) => (
                  <Station station={station} key={station.id} />
                ))}
              </ul>
            ) : (
              <p className="mb-4">No hay estaciones disponibles para esta finca.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

FincaPage.layout = Admin;
