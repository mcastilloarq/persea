import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { get, create, update, deleteRecord } from "/services/fecth";
import { getToken } from '/firebase/auth';

/**
 * pages/admin/stations/new.js
 *
 * Create or edit estación.
 * If query param stationId is present, page will load the station and allow editing (and deleting).
 * Expects API endpoints:
 *  - POST /api/admin/stations        -> createStation(payload, token)
 *  - GET  /api/admin/stations/:id    -> getStation(id, token)
 *  - PUT  /api/admin/stations/:id    -> updateStation(id, payload, token)
 *  - DELETE /api/admin/stations/:id  -> deleteStation(id, token)
 *
 * Payload shape:
 * {
 *   fincaId, name, description, pcb,
 *   lat, lng,
 *   config1..config8 (numbers or null)
 * }
 */

const DEVICE_TYPES = [
  'teros-12',
  'teros-10',
  'sm-100',
  'battery',
  'valve',
];

const DEVICE_NAMES = {
  'teros-12': 'Teros 12',
  'teros-10': 'Teros 10',
  'sm-100': 'SM100',
  'battery': 'Batería',
  'valve': 'Válvula',
};

export default function StationFormPage() {
    const router = useRouter();
    const { stationId: queryStationId, fincaId: queryFincaId } = router.query;

    const [form, setForm] = useState({
        fincaId: "",
        name: "",
        description: "",
        pcb: "",
        lat: "",
        lng: "",
        device1: "",
        device2: "",
        device3: "",
        device4: "",
        device5: "",
        device6: "",
        device7: "",
        device8: "",
    });
    const [loading, setLoading] = useState(false); // for submit/delete
    const [fetching, setFetching] = useState(false); // for initial load
    const [error, setError] = useState(null);

    const isEdit = Boolean(queryStationId);

    // If a fincaId is provided in the query and form doesn't have one yet, set it.
    useEffect(() => {
        if (queryFincaId) {
            setForm((s) => ({ ...s, fincaId: String(queryFincaId) }));
        }
    }, [queryFincaId]);

    // If editing, fetch the station
    useEffect(() => {
        let mounted = true;
        async function loadStation(id) {
            setError(null);
            setFetching(true);
            try {
                const token = await getToken();
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
                const station = await get('stations', id, token);
                if (!mounted) return;
                // map station fields to form (convert null numbers to empty strings)
                const next = {
                    fincaId: station.fincaId ?? "",
                    name: station.name ?? "",
                    description: station.description ?? "",
                    pcb: station.pcb ?? "",
                    lat: station.lat != null ? String(station.lat) : "",
                    lng: station.lng != null ? String(station.lng) : "",
                };
                for (let i = 1; i <= 8; i++) {
                    const k = `device${i}`;
                    const v = station[k];
                    next[k] = v == null ? "" : String(v);
                }
                setForm((s) => ({ ...s, ...next }));
            } catch (err) {
                console.error(err);
                setError(err?.message || "No se pudo cargar la estación.");
            } finally {
                setFetching(false);
            }
        }

        if (isEdit) {
            loadStation(queryStationId);
        }
        return () => {
            mounted = false;
        };
    }, [isEdit, queryStationId, router]);

    function updateField(field) {
        return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
    }

    function validate() {
        if (!form.name.trim()) return "El campo Nombre es obligatorio.";
        if (!form.fincaId || !form.fincaId.toString().trim()) return "fincaId (query param o estación) es obligatorio.";
        if (!form.pcb.trim()) return "El campo PCB es obligatorio.";
        if (form.lat === "") return "El campo Latitud es obligatorio.";
        if (form.lng === "") return "El campo Longitud es obligatorio.";

        const lat = parseFloat(form.lat);
        const lng = parseFloat(form.lng);
        if (Number.isNaN(lat) || lat < -90 || lat > 90) return "Latitud inválida. Debe ser un número entre -90 y 90.";
        if (Number.isNaN(lng) || lng < -180 || lng > 180) return "Longitud inválida. Debe ser un número entre -180 y 180.";

        return null;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const token = await getToken();
            if (!token) {
                router.push('/auth/login');
                return;
            }

            const payload = {
                fincaId: form.fincaId.toString().trim(),
                name: form.name.trim(),
                description: form.description.trim(),
                pcb: form.pcb.trim(),
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
            };
            
            for (let i = 1; i <= 8; i++) {
                payload[`device${i}`] = form[`device${i}`] || null;
            }

            if (isEdit) {
                await update('stations', queryStationId, payload, token);
            } else {
                await create('stations', payload, token);
            }

            router.push(`/admin/fincas_2/${payload.fincaId}`);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
      if (!isEdit) return;
      if (!confirm("¿Eliminar estación? Esta acción no se puede deshacer.")) return;

      setError(null);
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          router.push('/auth/login');
          return;
        }
        await deleteRecord('stations', queryStationId, token);
        router.push(`/admin/fincas_2/${form.fincaId}`);
      } catch (err) {
        console.error(err);
        setError(err?.message || "No se pudo eliminar la estación.");
      } finally {
        setLoading(false);
      }
    }

    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
      let timeout;
      if (copySuccess) {
        timeout = setTimeout(() => setCopySuccess(false), 2000);
      }
      return () => clearTimeout(timeout);
    }, [copySuccess]);

    const busy = loading || fetching;

    if (isEdit && fetching) {
      return (
        <div style={styles.container}>
          <h1 style={styles.heading}>{isEdit ? "Editar estación" : "Crear estación"}</h1>
          <p>{fetching ? "Cargando estación..." : "Procesando..."}</p>
        </div>
      );
    }

    return (
      <div style={styles.container}>
      <h1 style={styles.heading}>{isEdit ? "Editar estación" : "Crear estación"}</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        {error && <div style={styles.error}>{error}</div>}

        {/* estación id como texto (no input) + botón copiar */}
        <label style={styles.label}>
          ID
          <div style={{ display: "flex", gap: 8 }}>
            <div
              aria-readonly="true"
              style={{
                ...styles.input,
                flex: 1,
                display: "flex",
                alignItems: "center",
                background: "#f9fafb",
                cursor: "text",
              }}
            >
              {queryStationId || "(nueva estación)"}
            </div>
            <button
              type="button"
              onClick={async () => {
                const idToCopy = queryStationId;
                if (!idToCopy) return;
                try {
                  await navigator.clipboard.writeText(idToCopy);
                  setCopySuccess(true);
                } catch (err) {
                  console.error("Clipboard write failed", err);
                }
              }}
              disabled={busy || !(queryStationId)}
              style={{ ...styles.secondary, padding: "8px 10px", whiteSpace: "nowrap" }}
            >
              {copySuccess ? 'Copiado!' : 'Copiar ID'}
            </button>
          </div>
        </label>

        <label style={styles.label}>
        Nombre*
        <input
          name="name"
          value={form.name}
          onChange={updateField("name")}
          style={styles.input}
          placeholder="Nombre de la estación"
          disabled={busy}
        />
        </label>

        <label style={styles.label}>
        Descripción
        <textarea
          name="description"
          value={form.description}
          onChange={updateField("description")}
          style={{ ...styles.input, height: 100 }}
          placeholder="Descripción (opcional)"
          disabled={busy}
        />
        </label>

        <label style={styles.label}>
        PCB*
        <input
          name="pcb"
          value={form.pcb}
          onChange={updateField("pcb")}
          style={styles.input}
          placeholder="Identificador PCB"
          disabled={busy}
        />
        </label>

        <div className="flex justify-between">
        <label style={styles.label} className="flex-1 mr-4">
          Latitud*
          <input
          name="lat"
          type="number"
          step="any"
          value={form.lat}
          onChange={updateField("lat")}
          style={styles.input}
          placeholder="e.g. 40.4168"
          disabled={busy}
          />
        </label>

        <label style={styles.label} className="flex-1">
          Longitud*
          <input
          name="lng"
          type="number"
          step="any"
          value={form.lng}
          onChange={updateField("lng")}
          style={styles.input}
          placeholder="e.g. -3.7038"
          disabled={busy}
          />
        </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const idx = i + 1;
          const idKey = `device${idx}`;
          return (
          <div key={idKey} style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}>
            <label style={styles.label}>
            Puerto {idx}
            <select
            name={idKey}
            value={form[idKey] || ""}
            onChange={updateField(idKey)}
            style={styles.input}
            disabled={busy}
            >
            <option value="">-</option>
            {DEVICE_TYPES.map((t) => (
            <option key={t} value={t}>
              {DEVICE_NAMES[t]}
            </option>
            ))}
            </select>
            </label>
          </div>
          );
        })}
        </div>

        <div style={styles.actions}>
        <button type="submit" disabled={busy} style={styles.primary}>
          {loading ? (isEdit ? "Guardando..." : "Creando...") : isEdit ? "Guardar cambios" : "Crear estación"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/admin/fincas_2/${form.fincaId}`)}
          disabled={busy}
          style={styles.secondary}
        >
          Cancelar
        </button>

        {isEdit && (
          <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          style={{ ...styles.secondary, background: "#fee2e2", color: "#991b1b" }}
          >
          {loading ? "Eliminando..." : "Eliminar"}
          </button>
        )}
        </div>
      </form>
      </div>
    );
}

const styles = {
    container: {
        maxWidth: 760,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial",
    },
    heading: { margin: "0 0 18px 0", fontSize: 28 },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    label: {
        display: "flex",
        flexDirection: "column",
        fontSize: 14,
        gap: 6,
    },
    input: {
        padding: "10px 12px",
        fontSize: 14,
        borderRadius: 6,
        border: "1px solid #ddd",
        outline: "none",
    },
    actions: {
        marginTop: 12,
        display: "flex",
        gap: 8,
    },
    primary: {
        padding: "10px 14px",
        background: "#0366d6",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    secondary: {
        padding: "10px 14px",
        background: "#f3f4f6",
        color: "#111827",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
    },
    error: {
        padding: 10,
        background: "#fee2e2",
        color: "#991b1b",
        borderRadius: 6,
    },
};
