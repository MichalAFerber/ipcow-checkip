export async function onRequest(context) {
    // Get the client's IP from Cloudflare's request headers
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                    context.request.headers.get('X-Forwarded-For') || 
                    'Unknown';
    
    // Return plain text response with just the IP
    return new Response(clientIp, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store'
        }
    });
}