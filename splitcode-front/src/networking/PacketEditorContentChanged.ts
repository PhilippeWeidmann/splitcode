import Monaco from "monaco-editor";
import {PacketContent} from "./Packet";

class PacketEditorContentChanged extends PacketContent {
    type = "PacketEditorContentChanged";
    sandboxId: number;
    change: Monaco.editor.IModelContentChangedEvent;

    constructor(sandboxId: number, change: Monaco.editor.IModelContentChangedEvent) {
        super();
        this.sandboxId = sandboxId;
        this.change = change;
    }
}

export default PacketEditorContentChanged;
