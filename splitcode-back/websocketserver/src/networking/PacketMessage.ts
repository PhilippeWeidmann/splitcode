import {PacketContent} from "./Packet";

interface ChatMessage {
    id: number;
    content: string;
    createdAt: Date;
    userId: number;
}

class PacketMessage implements PacketContent {
    type = "PacketMessage";
    message: ChatMessage;

    constructor(message: ChatMessage) {
        this.message = message;
    }
}

export default PacketMessage;
export {ChatMessage};
