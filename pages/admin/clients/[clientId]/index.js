import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getToken } from '/firebase/auth';
import Link from 'next/link'
import Admin from "/layouts/Admin.js";

export default function ClientPage() {
    const router = useRouter()
    const { clientId } = router.query

    const [client, setClient] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
      const fetchClient = async () => {
        if (!clientId) return

        const token = await getToken();

        if (!token) {
          setError('Not authenticated')
          setLoading(false)
          return
        }

        fetch(`/api/clients/${encodeURIComponent(clientId)}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
        })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load client')
          return res.json()
        })
        .then((data) => setClient(data.client))
        .catch((err) => setError(err.message || 'Unknown error'))
        .finally(() => setLoading(false))

      };

      fetchClient()
    }, [clientId])

    if (router.isFallback) return <p>Loading...</p>

    return (
        <div className="p-8">
            <Link legacyBehavior href="/admin/clients">
                <a>← Volver</a>
            </Link>

            {/* <h1>Client</h1> */}

            {!clientId && <p>Missing clientId in URL.</p>}

            {loading && clientId && <p>Cargando datos del cliente...</p>}

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}

            {client && (
                <section style={{ marginTop: 12 }}>
                  <div className="mb-4">
                    <div>Cliente: </div>
                    <div className="text-3xl font-bold">{client.name || `Client ${clientId}`}</div>
                    <div className="text-xs text-gray-500">ID: {clientId}</div>
                  </div>
                    <div className="flex justify-between mb-4">
                      <h3 className="text-2xl font-bold">Fincas</h3>
                      <Link legacyBehavior href={`/admin/fincas_2/new?clientId=${clientId}`}>
                          <a
                              style={{
                                  backgroundColor: '#0366d6',
                                  color: '#fff',
                                  padding: '6px 12px',
                                  borderRadius: 4,
                                  textDecoration: 'none',
                              }}
                          >
                              Nueva Finca
                          </a>
                      </Link>
                    </div>

                    <hr className="my-4" />

                    {client.fincas && client.fincas.length > 0 ? (
                        <ul>
                            {client.fincas.map((finca) => (
                                <li key={finca.id}
                                  style={{
                                      padding: '12px 16px',
                                      border: '1px solid #eaeaea',
                                      backgroundColor: '#fafafa',
                                      borderRadius: 6,
                                      marginBottom: 8,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                  }}
                                >
                                  <div>
                                      <div style={{ color: '#999', fontSize: 12 }}>ID: {finca.id}</div>
                                      <div style={{ fontWeight: 600 }}>{finca.name || '—'}</div>
                                  </div>
                                  <div>
                                      {/* <Link legacyBehavior href={`/admin/fincas_2/1`}> */}
                                      <Link legacyBehavior href={`/admin/fincas_2/${finca.id}`}>
                                          <a style={{ color: '#0366d6', textDecoration: 'none' }}>Ver</a>
                                      </Link>
                                  </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No se han encontrado fincas para este cliente.</p>
                    )}
                </section>
            )}

            {!loading && !error && !client && clientId && (
                <p>No client found for ID {clientId}</p>
            )}
        </div>
    )
}

ClientPage.layout = Admin;