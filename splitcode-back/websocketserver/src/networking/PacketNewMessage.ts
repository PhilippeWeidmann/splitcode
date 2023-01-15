import {PacketContent} from "./Packet";

class PacketNewMessage implements PacketContent {
    type = "PacketNewMessage";
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export default PacketNewMessage;
