import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function NewFinca() {
    const router = useRouter();
    const { clientId: clientIdQuery } = router.query;

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [latitud, setLatitud] = useState("");
    const [longitud, setLongitud] = useState("");
    const [poblacion, setPoblacion] = useState("");
    const [provincia, setProvincia] = useState("");
    const [clientId, setClientId] = useState("");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (clientIdQuery) {
            setClientId(String(clientIdQuery));
        }
    }, [clientIdQuery]);

    function validate() {
        if (!nombre.trim()) return "El nombre es obligatorio.";
        if (!clientId.trim()) return "El clientId es obligatorio (vía query param).";
        if (latitud === "" || isNaN(Number(latitud))) return "La latitud debe ser un número.";
        if (longitud === "" || isNaN(Number(longitud))) return "La longitud debe ser un número.";
        return "";
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        const payload = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            latitud: Number(latitud),
            longitud: Number(longitud),
            poblacion: poblacion.trim(),
            provincia: provincia.trim(),
            clientId: clientId.trim(),
        };

        try {
            setSaving(true);
            const res = await fetch("/api/fincas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Error al crear la finca");
            }

            setSuccess(true);
            // opcional: limpiar formulario
            setNombre("");
            setDescripcion("");
            setLatitud("");
            setLongitud("");
            setPoblacion("");
            setProvincia("");
            // redirigir tras crear, por ejemplo a listado
            setTimeout(() => router.push("/admin/fincas"), 800);
        } catch (err) {
            setError(err.message || "Error inesperado");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div style={{ maxWidth: 720, margin: "24px auto", padding: 16 }}>
            <h1>Nueva Finca</h1>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Nombre
                    <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </label>

                <label>
                    Descripción
                    <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} />
                </label>

                <div style={{ display: "flex", gap: 12 }}>
                    <label style={{ flex: 1 }}>
                        Latitud
                        <input value={latitud} onChange={(e) => setLatitud(e.target.value)} />
                    </label>

                    <label style={{ flex: 1 }}>
                        Longitud
                        <input value={longitud} onChange={(e) => setLongitud(e.target.value)} />
                    </label>
                </div>

                <label>
                    Población
                    <input value={poblacion} onChange={(e) => setPoblacion(e.target.value)} />
                </label>

                <label>
                    Provincia
                    <input value={provincia} onChange={(e) => setProvincia(e.target.value)} />
                </label>

                <label>
                    clientId (vía query)
                    <input
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="se recibe como ?clientId=..."
                    />
                </label>

                {error && <div style={{ color: "crimson" }}>{error}</div>}
                {success && <div style={{ color: "green" }}>Finca creada correctamente. Redirigiendo...</div>}

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" disabled={saving}>
                        {saving ? "Guardando..." : "Crear finca"}
                    </button>
                    <button type="button" onClick={() => router.back()} disabled={saving}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}