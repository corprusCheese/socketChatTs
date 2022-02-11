import { RawData } from "ws"
import { MessageOptions } from "."
import Client from "../clients"
import { namePrefix, prefixSplitString } from "./prefix"

function getFullMessage(data: RawData): string {
    return data.toString().trim()
}

function messageOptionsFromSplit(tuple: [string, string], clientArray: Client[]): MessageOptions {
    const possibleClient: string = tuple[1].split(" ")[0]
    const clientInArray: Client | undefined = clientArray.find(x => x.name === possibleClient)

    if (clientInArray) return { message: tuple[0], clientId: clientInArray.id, success: true }
    else return { message: tuple[0], success: true }
}

function failedMessage(): MessageOptions {
    return {message: "FAILED_MESSAGE", success: false}
}

/* parse message with commands */
export function getOptionsFromRaw(data: RawData, clientArray:Client[]): MessageOptions {
    const wholeMessage = getFullMessage(data)
    let split: string[] = wholeMessage.split(prefixSplitString(namePrefix))

    if (split.length == 1) {
        return messageOptionsFromSplit([split[0], ""], clientArray);
    } else if (split.length >= 2) {
        return messageOptionsFromSplit([split[0], split[1]], clientArray);
    } else {
        // it is always > 0 and number
        return failedMessage();
    }
}

/** get first word from what client write */
export function getName(data: RawData): string {
    return getFullMessage(data).split(" ")[0]
}