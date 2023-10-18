import fetch from 'node-fetch';

export default async function handler(req, res) {
    let { url, ...rest } = req.query;
    const body = req.body;
    const method = (body && body.method) || req.method || 'GET';
    const queryParams = body && body.queryParams ? body.queryParams : {};
    url = `${url}${Object.keys(queryParams).length ? '?' + new URLSearchParams(queryParams).toString() : ''}`;

    if (!url) {
        res.status(400).json({ error: 'Missing url parameter' });
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                ...req.headers,
                host: undefined, // Remove host header
            },
            body: method !== 'GET' && method !== 'HEAD' ? JSON.stringify(body.body) : undefined,
            referrerPolicy: 'no-referrer',
        });

        const data = await response.text();

        res.status(response.status);
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
