export interface MessageOptions {
    message: string;
    clientId?: number;
    success: boolean;
}

export interface ClientMessage {
    id: number;
    options: MessageOptions;
}
