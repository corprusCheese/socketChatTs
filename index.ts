import config from "./src/config";
import WebSocket, {RawData} from 'ws';

interface Client {
    id: number;
    name?: string;
}

interface MessageOptions {
    message: string;
    clientId?: number;
    success: boolean;
}

interface ClientMessage {
    id: number;
    options: MessageOptions;
}

interface Prefix {
    literal: string;
    type: 'prefix';
}

function prefixSplitString(prefix: Prefix): string {
    return " /"+ prefix.literal + " ";
}

// for example, hello /n nikita
const namePrefix: Prefix = {
    literal: 'p',
    type: 'prefix',
}

let countClient = 1
let countMessage = 1
let clientArray: Client[] = []

function getFullMessage(data: RawData): string {
    return data.toString().trim()
}

/** get first word from what client write */
function getName(data: RawData): string {
    return getFullMessage(data).split(" ")[0]
}

function messageOptionsFromSplit(tuple: [string, string]): MessageOptions {
    const possibleClient: string = tuple[1].split(" ")[0]
    const clientInArray: Client | undefined = clientArray.find(x => x.name === possibleClient)

    if (clientInArray) return { message: tuple[0], clientId: clientInArray.id, success: true }
    else return { message: tuple[0], success: true }
}

function failedMessage(): MessageOptions {
    return {message: "FAILED_MESSAGE", success: false}
}

function parseRawData(data: RawData): MessageOptions {
    const wholeMessage = getFullMessage(data)
    let split: string[] = wholeMessage.split(prefixSplitString(namePrefix))

    if (split.length == 1) {
        return messageOptionsFromSplit([split[0], ""]);
    } else if (split.length >= 2) {
        return messageOptionsFromSplit([split[0], split[1]]);
    } else {
        // it is always > 0 and number
        return failedMessage();
    }
}

const wsServer = new WebSocket.Server(config)

wsServer.on('connection', function (ws, _im) {

    let client: Client = { id: countClient++ }

    clientArray.push(client)

    ws.on('message', function message(data) {
        console.log('received: %s', data);
        if (typeof client.name === "undefined") {
            client.name = getFullMessage(data)
            ws.send('Welcome, ' + client.name + "!");
        } else {
            let message: ClientMessage = {
                id: countMessage++,
                options: parseRawData(data)
            }

            if (typeof message.options.clientId === 'undefined') {
                // to all except sender
            } else {
                // only to client
            }
        }
    });

    ws.send('Hello, what is your name?');

    ws.on('close', function (_number, _data) {
        clientArray = clientArray.filter(connClient => connClient.id !== client.id)
    })
});



