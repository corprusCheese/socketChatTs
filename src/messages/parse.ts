import { RawData } from 'ws';
import { MessageOptions } from '.';
import { Client } from '../clients';
import { namePrefix, prefixSplitString } from './prefix';

function getFullMessage(data: RawData): string {
  return data.toString().trim();
}

function messageOptionsFromSplit(tuple: [string, string], clientArray: Client[]): MessageOptions {
  const possibleClient: string = tuple[1].split(' ')[0];
  const clientInArray: Client | undefined = clientArray.find(
    (x: Client) => x.name === possibleClient,
  );

  return typeof clientArray !== 'undefined'
    ? { message: tuple[0], clientId: (clientInArray as Client).id, success: true }
    : { message: tuple[0], success: true };
}

function failedMessage(): MessageOptions {
  return { message: 'FAILED_MESSAGE', success: false };
}

/* parse message with commands */
export function getOptionsFromRaw(data: RawData, clientArray:Client[]): MessageOptions {
  const wholeMessage = getFullMessage(data);
  const split: string[] = wholeMessage.split(prefixSplitString(namePrefix));

  return split.length >= 1
    ? messageOptionsFromSplit([split[0], split.length > 1 ? split[1] : ''], clientArray)
    : failedMessage();
}

/** get first word from what client write */
export function getName(data: RawData): string {
  return getFullMessage(data).split(' ')[0];
}
