import {PacketContent} from "./Packet";

class PacketEditorFocused implements PacketContent {
    sandboxId: number;
    focused: boolean;

    constructor(sandboxId: number, focused: boolean) {
        this.sandboxId = sandboxId;
        this.focused = focused;
    }
}

export default PacketEditorFocused;
