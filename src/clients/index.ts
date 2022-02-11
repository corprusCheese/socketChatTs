import WebSocket from 'ws';

export interface Client extends WebSocket {
  id: number;
  name?: string;
}
