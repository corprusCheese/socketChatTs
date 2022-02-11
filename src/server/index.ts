import { RawData } from "ws";
import Client from "../clients";
import { ClientMessage } from "../messages";
import { getOptionsFromRaw } from "../messages/parse";

let countClient = 1
let countMessage = 1
let clientArray: Client[] = []
let clientMessages: ClientMessage[] = []

export function saveClientWithId(client: Client): Client {
    client.id = countClient++;
    clientArray.push(client)
    
    return client;
}

function successMessageAction(message: ClientMessage, client: Client): void {
    clientArray.map((user) => {
        if (typeof message.options.clientId === "undefined") {
            user.send(client.name + ": " + message.options.message);
        } else {
            if (user.id === message.options.clientId)
                user.send(client.name + " (to you): " + message.options.message);
        }
    })
}

function failedMessageAction(): void {
    console.log("Error occured");
}

export function messageAction(data: RawData, client: Client): void {
    let message: ClientMessage = {
        id: countMessage++,
        options: getOptionsFromRaw(data, clientArray)
    }

    clientMessages.push(message)

    if (message.options.success) {
        successMessageAction(message, client)
    } else {
        failedMessageAction()
    }
}


export function closeAction(client: Client): void {
    clientArray = clientArray.filter(connClient => connClient.id !== client.id)
}