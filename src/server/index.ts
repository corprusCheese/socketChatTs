import { RawData } from 'ws';
import { Client } from '../clients';
import { ClientMessage } from '../messages';
import { getName, getOptionsFromRaw } from '../messages/parse';

let countClient = 1;
let countMessage = 1;
let clientArray: Client[] = [];
const clientMessages: ClientMessage[] = [];

export function saveClientWithId(client: Client): Client {
  client.id = countClient;
  // no-plusplus in eslint
  countClient += 1;
  clientArray.push(client);
  return client;
}

function successMessageAction(message: ClientMessage, client: Client): void {
  if (typeof message.options.clientId === 'undefined') {
    clientArray.forEach((user) => {
      user.send(`${client.name}: ${message.options.message}`);
    });
  } else {
    const findedClient: Client = clientArray.find(
      (user) => user.id === message.options.clientId,
    ) as Client;
    findedClient.send(`${client.name} (to you): ${message.options.message}`);
  }
}

function failedMessageAction(): void {
  console.log('Error occured');
}

export function messageAction(data: RawData, client: Client): void {
  const message: ClientMessage = {
    id: countMessage,
    options: getOptionsFromRaw(data, clientArray),
  };

  countMessage += 1;
  clientMessages.push(message);

  if (message.options.success) {
    successMessageAction(message, client);
  } else {
    failedMessageAction();
  }
}

export function closeAction(client: Client): void {
  clientArray = clientArray.filter((connClient) => connClient.id !== client.id);
}

export function nameAndMessage(data: RawData, client: Client): void {
  if (typeof client.name === 'undefined') {
    client.name = getName(data);
    client.send(`Welcome, ${client.name} !`);
  } else {
    messageAction(data, client);
  }
}
