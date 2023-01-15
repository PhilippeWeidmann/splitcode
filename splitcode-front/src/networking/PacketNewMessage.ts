import {PacketContent} from "./Packet";

class PacketNewMessage extends PacketContent {
    type = "PacketNewMessage";
    message: string;

    constructor(message: string) {
        super();
        this.message = message;
    }
}

export default PacketNewMessage;
