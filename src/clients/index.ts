import WebSocket from "ws";

export default interface Client extends WebSocket {
    id: number;
    name?: string;
}