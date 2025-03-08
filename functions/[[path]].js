export async function onRequest(context) {
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                    context.request.headers.get('X-Forwarded-For') || 
                    'Unknown';
    
    const ipList = clientIp.split(',');
    const ipv4 = ipList.map(ip => ip.trim()).find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
    const ipv6 = ipList.map(ip => ip.trim()).find(ip => /:/.test(ip) && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv6 detected';

    // Determine connection protocol
    const firstIp = ipList[0].trim();
    const isIPv6 = /:/.test(firstIp) && !/^\d+\.\d+\.\d+\.\d+$/.test(firstIp);
    
    const { pathname } = new URL(context.request.url);

    // Root path (/)
    if (pathname === '/' || pathname === '') {
        // Check User-Agent to distinguish curl from browser
        const userAgent = context.request.headers.get('User-Agent') || '';
        const isCurl = userAgent.toLowerCase().includes('curl');

        if (isCurl) {
            // For curl, check if protocol is forced via -4 or -6 (best effort via IP)
            const ipToReturn = isIPv6 ? ipv6 : ipv4;

            // If no protocol forced (plain curl), return JSON with both
            if (!context.request.cf?.clientTcpRtt) { // Rough heuristic for no -4/-6
                return new Response(JSON.stringify({ ipv4, ipv6 }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
                });
            }

            // For curl -4 or -6, return plain text
            return new Response(ipToReturn, {
                status: 200,
                headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }
            });
        }

        // For browser, return default IP as plain text
        const ipToReturn = isIPv6 ? ipv6 : ipv4;
        return new Response(ipToReturn, {
            status: 200,
            headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }
        });
    }

    return context.next();
}