import * as http from 'http';
import * as httpProxy from 'http-proxy';

const servers = [
  { host: '127.0.0.1', port: 3000 },
  { host: '127.0.0.1', port: 3001 },
  { host: '127.0.0.1', port: 3002 },
];

const proxy = httpProxy.createProxyServer();

let currentServerIndex = 0;
function getNextServer() {
  const server = servers[currentServerIndex];
  currentServerIndex = (currentServerIndex + 1) % servers.length;
  return server;
}
const loadBalancer = http.createServer((req, res) => {
  const targetServer = getNextServer();
  console.log(`Proxying request to: ${targetServer.host}:${targetServer.port}`);

  proxy.web(req, res, { target: targetServer });
});

const PORT = 8001;
loadBalancer.listen(PORT, () => {
  console.log(`Load balancer running on port ${PORT}`);
});
