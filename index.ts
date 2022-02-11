import { Server } from 'ws';
import config from './src/config';
import { Client } from './src/clients';
import { closeAction, nameAndMessage, saveClientWithId } from './src/server';

const wsServer = new Server(config);

function onConnection(client: Client): void {
  client.on('message', (data) => {
    console.log('received: %s', data);
    nameAndMessage(data, client);
  });

  client.on('close', closeAction);
}

wsServer.on('connection', (client: Client) => {
  client.send('Hello, what is your name?');
  onConnection(saveClientWithId(client));
});
