class Packet {
    type: string;
    data: PacketContent;

    constructor(type: string, data: PacketContent) {
        this.type = type;
        this.data = data;
    }
}

export abstract class PacketContent {
    type: string = "PacketContent";
}

export default Packet;
