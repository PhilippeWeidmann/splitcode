import {PacketContent} from "./Packet";

class PacketEditorFocused extends PacketContent {
    type = "PacketEditorFocused";
    sandboxId: number;
    focused: boolean;

    constructor(sandboxId: number, focused: boolean) {
        super();
        this.sandboxId = sandboxId;
        this.focused = focused;
    }
}

export default PacketEditorFocused;
