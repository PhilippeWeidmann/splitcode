import {PacketContent} from "./Packet";
import ChatMessage from "../models/ChatMessage";

class PacketMessage extends PacketContent {
    type = "PacketMessage";
    message: ChatMessage;

    constructor(message: ChatMessage) {
        super();
        this.message = message;
    }
}

export default PacketMessage;
