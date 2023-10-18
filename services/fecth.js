export const list = async (modelName, token) => {
    const res = await fetch(`/api/${modelName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data || [];
};

export const get = async (modelName, id, token) => {
    const res = await fetch(`/api/${modelName}/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data;
};

export const create = async (modelName, data, token) => {
    const res = await fetch(`/api/${modelName}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const resData = await res.json();
    return resData;
};

export const update = async (modelName, id, data, token) => {
    const res = await fetch(`/api/${modelName}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const resData = await res.json();
    return resData;
};

export const deleteRecord = async (modelName, id, token) => {
    const res = await fetch(`/api/${modelName}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    return res;
};





export const fetchClients = async (token) => {
    const res = await fetch('/api/clients', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.clients || [];
};

export const createClient = async (clientData, token) => {
    const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(clientData),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.client;
};

export const createFinca = async (fincaData, token) => {
    const res = await fetch('/api/fincas_2', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(fincaData),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data;
}

export const createStation = async (stationData, token) => {
    const res = await fetch('/api/stations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(stationData),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data;
}

export const getStation = async (stationId, token) => {
    const res = await fetch(`/api/stations/${encodeURIComponent(stationId)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API responded ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.station;
};
