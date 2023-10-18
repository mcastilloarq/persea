import React, { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "/services/fecth";
import { getToken } from '/firebase/auth';

/**
 * pages/admin/clients/new.js
 *
 * Simple CRUD "Create" page for adding a client.
 * Expects a POST endpoint at /api/admin/clients that accepts JSON:
 * { name, email, phone, address, notes }
 */

export default function NewClientPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function update(field) {
        return (e) => setForm((s) => ({ ...s, [field]: e.target.value }));
    }

    function validate() {
        if (!form.name.trim()) return "El campo Nombre es obligatorio.";
        if (!form.email.trim()) return "El campo Correo electrónico es obligatorio.";
        // basic email pattern
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(form.email)) return "El campo Correo electrónico es inválido.";
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

            const clientData = await createClient(form, token);
            router.push("/admin/clients");
        } catch (err) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Crear cliente</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
                {error && <div style={styles.error}>{error}</div>}

                <label style={styles.label}>
                    Nombre*
                    <input
                        name="name"
                        value={form.name}
                        onChange={update("name")}
                        style={styles.input}
                        placeholder="Nombre del cliente"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Correo electrónico*
                    <input
                        name="email"
                        value={form.email}
                        onChange={update("email")}
                        style={styles.input}
                        placeholder="correo@ejemplo.com"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Teléfono
                    <input
                        name="phone"
                        value={form.phone}
                        onChange={update("phone")}
                        style={styles.input}
                        placeholder="123 456 789"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Dirección
                    <input
                        name="address"
                        value={form.address}
                        onChange={update("address")}
                        style={styles.input}
                        placeholder="Dirección"
                        disabled={loading}
                    />
                </label>

                <label style={styles.label}>
                    Notas
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={update("notes")}
                        style={{ ...styles.input, height: 100 }}
                        placeholder="Notas (opcional)"
                        disabled={loading}
                    />
                </label>

                <div style={styles.actions}>
                    <button type="submit" disabled={loading} style={styles.primary}>
                        {loading ? "Creando..." : "Crear cliente"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push("/admin/clients")}
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
