import { RawData } from 'ws';
import { Client } from '../clients';
import { ClientMessage } from '../messages';
import { getName, getOptionsFromRaw } from '../messages/parse';

let countClient = 1;
let countMessage = 1;
const clientArray: Client[] = [];
const clientMessages: ClientMessage[] = [];

function successMessageAction(message: ClientMessage, client: Client): void {
  if (typeof message.options.clientId === 'undefined') {
    sendMessageToAll(message, client);
  } else {
    sendPersonalMessage(message, client);
  }
}

function sendMessageToAll(message: ClientMessage, client: Client): void {
  clientArray.forEach((user) => {
    user.send(`${client.name}: ${message.options.message}`);
  });
}

function sendPersonalMessage(message: ClientMessage, client: Client): void {
  const findedClient: Client = clientArray.find(
    (user) => user.id === message.options.clientId,
  ) as Client;
  findedClient.send(`${client.name} (to you): ${message.options.message}`);
}

function failedMessageAction(): void {
  console.log('Error occured');
}

function createMessage(data: RawData): ClientMessage {
  const message: ClientMessage = {
    id: countMessage,
    options: getOptionsFromRaw(data, clientArray),
  };

  countMessage += 1;
  clientMessages.push(message);

  return message;
}

function resultMessageAction(message: ClientMessage, client: Client): void {
  if (message.options.success) {
    successMessageAction(message, client);
  } else {
    failedMessageAction();
  }
}

export function messageAction(data: RawData, client: Client): void {
  resultMessageAction(createMessage(data), client);
}

export function closeAction(client: Client): void {
  const index = clientArray.findIndex((connClient) => connClient.id !== client.id);
  if (index > -1) {
    clientArray.splice(index, 1);
  }
}

export function nameAndMessage(data: RawData, client: Client): void {
  if (typeof client.name === 'undefined') {
    client.name = getName(data);
    client.send(`Welcome, ${client.name} !`);
  } else {
    messageAction(data, client);
  }
}

export function saveClientWithId(client: Client): Client {
  client.id = countClient;
  // no-plusplus in eslint
  countClient += 1;
  clientArray.push(client);
  return client;
}