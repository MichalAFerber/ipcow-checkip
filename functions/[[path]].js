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

    // /all endpoint - For browser, returns both IPs if available
    if (pathname === '/all') {
        // Best effort to get both IPs
        let finalIpv4 = ipv4;
        let finalIpv6 = ipv6;

        // If one is missing but we know the client supports both (based on your setup),
        // we can assume the other might be in the headers or infer it
        const allIps = [
            ...ipList,
            ...(context.request.headers.get('X-Forwarded-For')?.split(',') || [])
        ].map(ip => ip.trim());

        if (finalIpv4 === 'No IPv4 detected') {
            finalIpv4 = allIps.find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
        }
        if (finalIpv6 === 'No IPv6 detected') {
            finalIpv6 = allIps.find(ip => /:/.test(ip) && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv6 detected';
        }

        return new Response(JSON.stringify({ ipv4: finalIpv4, ipv6: finalIpv6 }), {
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