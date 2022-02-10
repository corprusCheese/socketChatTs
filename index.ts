import config from "./src/config";
import WebSocket from 'ws';

const address = `ws://${config.host}:${config.port}`

const wsServer = new WebSocket.Server(config)

wsServer.on('connection', function(webSocket) {
  console.log("New user");
});

wsServer.on('close', function() {
  console.log("Close");
});


