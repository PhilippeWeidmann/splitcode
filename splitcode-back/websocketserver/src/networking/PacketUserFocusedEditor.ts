import {PacketContent} from "./Packet";

class PacketUserFocusedEditor implements PacketContent {
    sandboxId: number;
    userId: number;
    focused: boolean;

    constructor(sandboxId: number, userId: number, focused: boolean) {
        this.sandboxId = sandboxId;
        this.userId = userId;
        this.focused = focused;
    }
}

export default PacketUserFocusedEditor;
