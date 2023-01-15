import {PacketContent} from "./Packet";

class PacketUserFocusedEditor extends PacketContent {
    type = "PacketUserFocusedEditor";
    sandboxId: number;
    userId: number;
    focused: boolean;

    constructor(sandboxId: number, userId: number, focused: boolean) {
        super();
        this.sandboxId = sandboxId;
        this.userId = userId;
        this.focused = focused;
    }
}

export default PacketUserFocusedEditor;
