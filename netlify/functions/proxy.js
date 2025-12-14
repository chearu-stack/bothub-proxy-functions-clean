const BOTHUB_API_URL = "https://api.bothub.io/v1/chat/completions";

exports.handler = async (event) => {
    // Получаем секретный ключ из настроек Netlify
    const BOTHUB_API_KEY = process.env.BOTHUB_SECRET_KEY;
    
    // Заголовки для разрешения CORS
    const headers = {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const requestBody = JSON.parse(event.body);

        const bothubResponse = await fetch(BOTHUB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BOTHUB_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await bothubResponse.json();

        return {
            statusCode: bothubResponse.status,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Server proxy error: ' + error.message })
        };
    }
};
