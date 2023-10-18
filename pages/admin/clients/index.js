import { useEffect, useState } from 'react';
import { getToken } from '/firebase/auth';
import Link from 'next/link'; 
import Admin from "/layouts/Admin.js";
import { useRouter } from "next/router";
import { fetchClients } from '/services/fecth';

export default function ClientsPage() {
  const router = useRouter();
  const [clientList, setClientList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setError('Not authenticated')
          setLoading(false)
          router.push('/auth/login')
          return
        }

        const clients = await fetchClients(token);
        setClientList(clients);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch clients:', err);
        setClientList([]);
        setLoading(false);
      }
    };

    fetchClientsData();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Link legacyBehavior href="/admin/clients/new">
          <a
            style={{
              backgroundColor: '#0366d6',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 4,
              textDecoration: 'none',
            }}
          >
            Nuevo Cliente
          </a>
        </Link>
      </div>
      <hr className="my-4" />
      {loading ? <>
        <p>Cargando clientes...</p>
      </> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {clientList.map((c) => (
            <li
              key={c.id}
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
                <div style={{ color: '#999', fontSize: 12 }}>ID: {c.id}</div>
                <div style={{ fontWeight: 600 }}>{c.name || '—'}</div>
                <div style={{ color: '#666', fontSize: 13 }}>{c.email || '—'}</div>
              </div>
              <div>
                <Link legacyBehavior href={`/admin/clients/${c.id}`}>
                  <a style={{ color: '#0366d6', textDecoration: 'none' }}>Ver</a>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ClientsPage.layout = Admin;

// export async function getServerSideProps(context) {
//     const { req } = context;
//     const proto = req.headers['x-forwarded-proto'] || (req.connection && req.connection.encrypted ? 'https' : 'http');
//     const host = req.headers.host;
//     const url = `http://localhost:2010/api/clients`;
//     const user = auth.currentUser;
//     console.log('Current user in SSR:', user);
//     const token = user ? await user.getIdToken() : null;

//     try {
//         const res = await fetch(url, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + (token || ''),
//           }
//         });
//         if (!res.ok) {
//           const text = await res.text();
//           return { props: { clients: [], error: `API responded ${res.status}: ${text}` } };
//         }
//         const clients = await res.json();
//         return { props: { clients: Array.isArray(clients) ? clients : [] } };
//     } catch (err) {
//         return { props: { clients: [], error: err.message || 'Fetch error' } };
//     }
// }