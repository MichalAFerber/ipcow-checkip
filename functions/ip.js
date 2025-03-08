export async function onRequest(context) {
    // Get all connecting IPs from CF-Connecting-IP
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                    context.request.headers.get('X-Forwarded-For') || 
                    'Unknown';
    
    // Split IPs if multiple are provided (common with IPv4/IPv6 dual-stack)
    const ipList = clientIp.split(',');
    // Filter for IPv4 addresses (simple regex check)
    const ipv4 = ipList.map(ip => ip.trim()).find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
    
    return new Response(ipv4, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*'
        }
    });
}