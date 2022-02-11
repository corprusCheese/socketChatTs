import WebSocket from 'ws';
import config from './src/config';
import { Client } from './src/clients';
import { closeAction, nameAndMessage, saveClientWithId } from './src/server';

const wsServer = new WebSocket.Server(config);

function onConnection(client: Client): void {
  client.send('Hello, what is your name?');
  client = saveClientWithId(client);
  client.on('message', (data: any) => {
    console.log('received: %s', data);
    nameAndMessage(data, client);
  });

  client.on('close', closeAction);
}

wsServer.on('connection', onConnection);
