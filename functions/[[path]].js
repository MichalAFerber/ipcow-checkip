export async function onRequest(context) {
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                    context.request.headers.get('X-Forwarded-For') || 
                    'Unknown';
    
    const ipList = clientIp.split(',');
    const ipv4 = ipList.map(ip => ip.trim()).find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
    const ipv6 = ipList.map(ip => ip.trim()).find(ip => /:/.test(ip) && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv6 detected';

    // Determine connection protocol for root path
    const firstIp = ipList[0].trim();
    const isIPv6 = /:/.test(firstIp) && !/^\d+\.\d+\.\d+\.\d+$/.test(firstIp);
    
    const { pathname } = new URL(context.request.url);

    // Root path (/) - For curl, returns based on connection protocol
    if (pathname === '/' || pathname === '') {
        const ipToReturn = isIPv6 ? ipv6 : ipv4;
        return new Response(ipToReturn, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store'
            }
        });
    }

    // /v4 endpoint - Returns only IPv4
    if (pathname === '/v4') {
        return new Response(ipv4, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // /v6 endpoint - Returns only IPv6
    if (pathname === '/v6') {
        return new Response(ipv6, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // /all endpoint - Returns both as JSON (best effort with current headers)
    if (pathname === '/all') {
        return new Response(JSON.stringify({ ipv4, ipv6 }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }

    // For other paths, let it fall through to static assets
    return context.next();
}