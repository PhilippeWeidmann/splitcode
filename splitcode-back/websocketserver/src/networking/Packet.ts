class Packet {
    type: string;
    data: PacketContent;

    constructor(type: string, data: PacketContent) {
        this.type = type;
        this.data = data;
    }
}

export interface PacketContent {
}

export default Packet;

