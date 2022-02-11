import config from "./src/config";
import WebSocket from 'ws';
import Client from "./src/clients";
import { getName } from "./src/messages/parse";
import { closeAction, messageAction, saveClientWithId } from "./src/server";

const wsServer = new WebSocket.Server(config)

wsServer.on('connection', function (client: Client) {

    client.send('Hello, what is your name?');
    client = saveClientWithId(client)

    client.on('message', function message(data) {
        console.log('received: %s', data);
        if (typeof client.name === "undefined") {
            client.name = getName(data)
            client.send('Welcome, ' + client.name + "!");
        } else messageAction(data, client)
    });

    client.on('close', closeAction)
});



