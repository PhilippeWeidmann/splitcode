import {PacketContent} from "./Packet";

class PacketEditorContentChanged implements PacketContent {
    sandboxId: number;
    change: any;

    constructor(sandboxId: number, change: any) {
        this.sandboxId = sandboxId;
        this.change = change;
    }
}

export default PacketEditorContentChanged;
