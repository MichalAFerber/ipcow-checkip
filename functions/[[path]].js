export async function onRequest(context) {
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                    context.request.headers.get('X-Forwarded-For') || 
                    'Unknown';
    
    const ipList = clientIp.split(',');
    const ipv4 = ipList.map(ip => ip.trim()).find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
    
    // Get the pathname from the request
    const { pathname } = new URL(context.request.url);

    // If root path (/), return plain text
    if (pathname === '/' || pathname === '') {
        return new Response(ipv4, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store'
            }
        });
    }

    // For other paths (like /ip), let it fall through to static assets or handle differently if needed
    return context.next();
}