const express = require('express');
const axios = require('axios');
const https = require('https');
const url = require('url');
const cors = require('cors');
const querystring = require('querystring');

const app = express();
const port = 3000;

const allowList = [
    'api.shodan.io',
    'ipinfo.io',
    'safebrowsing.googleapis.com',
    'dns.google.com',
    'api.hudsonrock.com',
    'cavalier.hudsonrock.com',
    'internetdb.shodan.io',
    'api.greynoise.io',
    'urlscan.io',
    'api.securitytrails.com',
    'urlhaus-api.abuse.ch',
    'api.any.run',
    'dns.google'
];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use default query parser but log for debugging
app.set('query parser', (str) => {
    const parsed = querystring.parse(str);
    console.log(`[Query Parser] Input: ${str}, Parsed: ${JSON.stringify(parsed)}`);
    return parsed;
});

app.use(cors({
    origin: (origin, callback) => {
        const allowed = !origin || origin === 'null' || origin === 'http://localhost:3000';
        console.log(`[CORS] Origin: ${origin} - ${allowed ? 'Allowed' : 'Rejected'}`);
        if (allowed) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS policy'));
        }
    },
    optionsSuccessStatus: 200
}));

// Status endpoint
app.get('/status', (req, res) => {
    console.log('[Status] Request received');
    res.json({
        status: 'running',
        version: 'fixed-2025-04-12-v6',
        port: port,
        allowList: allowList,
        timestamp: new Date().toISOString()
    });
});

function validateTargetUrl(req, res, next) {
    console.log('[Validate] Full Request Details:', {
        method: req.method,
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        body: req.body,
        timestamp: new Date().toISOString()
    });

    // Accurate raw query string
    const rawQuery = req.originalUrl.includes('?') ? req.originalUrl.split('?')[1] : 'none';
    console.log(`[Validate] Raw query string: ${rawQuery}`);

    // Reconstruct full URL from req.query
    let targetUrl = req.query.url;
    if (!targetUrl) {
        console.log('[Validate] Rejected: Missing url parameter');
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    // Append additional query parameters (e.g., type=MX)
    const additionalParams = Object.keys(req.query)
        .filter(key => key !== 'url')
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(req.query[key])}`)
        .join('&');
    if (additionalParams) {
        targetUrl += (targetUrl.includes('?') ? '&' : '?') + additionalParams;
    }

    console.log(`[Validate] Reconstructed target URL: ${targetUrl}`);

    let parsedUrl;
    try {
        parsedUrl = new url.URL(targetUrl);
    } catch (error) {
        console.log(`[Validate] Rejected: Invalid URL format - ${targetUrl} - Error: ${error.message}`);
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    const hostname = parsedUrl.hostname;
    if (!allowList.includes(hostname)) {
        console.log(`[Validate] Rejected: Domain not allowed - ${hostname}`);
        return res.status(403).json({ error: 'Target domain not in allow list' });
    }

    req.targetUrl = targetUrl;
    console.log(`[Validate] Validated: ${targetUrl} (${req.method})`);
    next();
}

async function proxyRequest(req, res) {
    console.log(`[Proxy] Processing request for: ${req.targetUrl}`);
    try {
        const axiosConfig = {
            method: req.method.toLowerCase(),
            url: req.targetUrl,
            headers: {
                'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Safari/605.1.15',
                'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded',
                'Accept': req.headers['accept'] || 'application/json'
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }),
            responseType: 'stream'
        };

        if (req.method === 'POST' && req.body) {
            axiosConfig.data = req.body;
            console.log(`[Proxy] POST data: ${JSON.stringify(req.body)}`);
        }

        ['api-key', 'key', 'apikey', 'Auth-Key'].forEach(header => {
            if (req.headers[header.toLowerCase()]) {
                axiosConfig.headers[header] = req.headers[header.toLowerCase()];
                console.log(`[Proxy] Forwarding header: ${header}`);
            }
        });

        console.log(`[Proxy] Forwarding request to: ${req.targetUrl} with config:`, {
            method: axiosConfig.method,
            url: axiosConfig.url,
            headers: axiosConfig.headers
        });

        const response = await axios(axiosConfig);

        Object.keys(response.headers).forEach(key => {
            res.setHeader(key, response.headers[key]);
        });

        response.data.pipe(res);

        console.log(`[Proxy] Response from ${req.targetUrl}:`, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(`[Proxy] Error for ${req.targetUrl}:`, error);
        if (error.response) {
            console.log(`[Proxy] Error Response from ${req.targetUrl}:`, {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                timestamp: new Date().toISOString()
            });
            error.response.data.pipe(res);
        } else {
            console.error(`[Proxy] Non-HTTP error: ${error.message}`);
            res.status(500).json({
                error: 'Proxy error',
                message: error.message,
                stack: error.stack,
                request: {
                    url: req.targetUrl,
                    method: req.method
                }
            });
        }
    }
}

app.all('/proxy', validateTargetUrl, proxyRequest);

app.use((err, req, res, next) => {
    console.error(`[Server] Error:`, {
        message: err.message,
        stack: err.stack,
        request: {
            url: req.originalUrl,
            method: req.method,
            headers: req.headers,
            body: req.body
        },
        timestamp: new Date().toISOString()
    });
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        stack: err.stack,
        request: {
            url: req.originalUrl,
            method: req.method,
            headers: req.headers,
            body: req.body
        }
    });
});

app.listen(port, () => {
    console.log(`[Server] CORS Proxy Server running on http://localhost:${port}`);
    console.log('[Server] Usage:');
    console.log('[Server]   GET:  http://localhost:3000/proxy?url=<target-url>');
    console.log('[Server] Allowed domains:', allowList.join(', '));
});
