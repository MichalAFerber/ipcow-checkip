export async function onRequest(context) {
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                    context.request.headers.get('X-Forwarded-For') || 
                    'Unknown';
    
    return new Response(clientIp, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*' // Helpful for browser testing
        }
    });
}