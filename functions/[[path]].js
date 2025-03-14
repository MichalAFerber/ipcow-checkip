export async function onRequest(context) {
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                     context.request.headers.get('X-Forwarded-For') || 
                     'Unknown';
    
    const ipList = clientIp.split(',').map(ip => ip.trim());
    const ipv4 = ipList.find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
    const ipv6 = ipList.find(ip => /:/.test(ip) && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv6 detected';
  
    const { searchParams, pathname } = new URL(context.request.url);
    const forceIPv6 = searchParams.get('ip') === 'v6';
  
    if (pathname === '/' || pathname === '') {
      let ipToReturn;
      const firstIp = ipList[0];
      const isIPv6Connection = /:/.test(firstIp) && !/^\d+\.\d+\.\d+\.\d+$/.test(firstIp);
  
      if (forceIPv6) {
        ipToReturn = ipv6;
      } else {
        ipToReturn = isIPv6Connection ? ipv6 : ipv4;
      }
  
      return new Response(ipToReturn, {
        status: 200,
        headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' }
      });
    }
  
    return context.next();
  }