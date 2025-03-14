export async function onRequest(context) {
    const clientIp = context.request.headers.get('CF-Connecting-IP') || 
                     context.request.headers.get('X-Forwarded-For') || 
                     'Unknown';
    
    const ipList = clientIp.split(',').map(ip => ip.trim());
    const ipv4 = ipList.find(ip => /^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv4 detected';
    const ipv6 = ipList.find(ip => /:/.test(ip) && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) || 'No IPv6 detected';
  
    const { searchParams, pathname } = new URL(context.request.url);
    const ipVersion = searchParams.get('ip');
  
    if (pathname === '/' || pathname === '') {
      let ipToReturn;
      const firstIp = ipList[0];
      const isIPv6Connection = /:/.test(firstIp) && !/^\d+\.\d+\.\d+\.\d+$/.test(firstIp);
  
      if (ipVersion === 'v6') {
        ipToReturn = ipv6;
      } else if (ipVersion === 'v4') {
        ipToReturn = ipv4;
      } else {
        ipToReturn = isIPv6Connection ? ipv6 : ipv4;
      }
  
      return new Response(ipToReturn, {
        status: 200,
        headers: { 
          'Content-Type': 'text/plain', 
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  
    return context.next();
  }