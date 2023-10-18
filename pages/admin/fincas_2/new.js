import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createFinca } from "/services/fecth";
import { getToken } from '/firebase/auth';

/**
 * pages/admin/fincas_2/new.js
 *
 * Crear finca.
 * Espera un endpoint POST en /api/admin/fincas que acepte JSON:
 * { nombre, descripcion, latitud, longitud, poblacion, provincia, clientId }
 */

export default function NewFincaPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        description: "",
        lat: "",
        lng: "",
        city: "",
        province: "",
        clientId: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { clientId } = router.query;
        if (clientId) {
            setForm((s) => ({ ...s, clientId: String(clientId) }));
        }
    }, [router.query.clientId]);

    function update(field) {
        return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
    }

    function validate() {
        if (!form.name.trim()) return "El campo Nombre es obligatorio.";
        if (!form.clientId || !form.clientId.toString().trim()) return "clientId (query param) es obligatorio.";
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
                name: form.name.trim(),
                description: form.description.trim(),
                lat: parseFloat(form.lat),
                lng: parseFloat(form.lng),
                city: form.city.trim(),
                province: form.province.trim(),
                clientId: form.clientId.toString().trim(),
            };

            const finca = await createFinca(payload, token);
            debugger
            router.push(`/admin/fincas/${finca.id}`);
        } catch (err) {
            console.error(err);
            setError(err?.message || "Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Crear finca</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}

                <label style={styles.label}>
                    Nombre*
                    <input
                        name="name"
                        value={form.name}
                        onChange={update("name")}
                        style={styles.input}
                        placeholder="Nombre de la finca"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Descripción
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={update("description")}
                        style={{ ...styles.input, height: 100 }}
                        placeholder="Descripción (opcional)"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Latitud*
                    <input
                        name="lat"
                        type="number"
                        step="any"
                        value={form.lat}
                        onChange={update("lat")}
                        style={styles.input}
                        placeholder="e.g. 40.4168"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Longitud*
                    <input
                        name="lng"
                        type="number"
                        step="any"
                        value={form.lng}
                        onChange={update("lng")}
                        style={styles.input}
                        placeholder="e.g. -3.7038"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Población
                    <input
                        name="city"
                        value={form.city}
                        onChange={update("city")}
                        style={styles.input}
                        placeholder="Población"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Provincia
                    <input
                        name="province"
                        value={form.province}
                        onChange={update("province")}
                        style={styles.input}
                        placeholder="Provincia"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    clientId (desde query param)*
                    <input
                        name="clientId"
                        value={form.clientId}
                        onChange={update("clientId")}
                        style={styles.input}
                        placeholder="clientId (se puede pasar en la query)"
                        disabled={loading}
                    />
                </label>

                <div style={styles.actions}>
                    <button type="submit" disabled={loading} style={styles.primary}>
                        {loading ? "Creando..." : "Crear finca"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/admin/clients/${form.clientId}`)}
                        disabled={loading}
                        style={styles.secondary}
                    >
                        Cancelar
                    </button>
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
