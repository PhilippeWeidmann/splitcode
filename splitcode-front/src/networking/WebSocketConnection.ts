import {w3cwebsocket as WebSocketClient} from "websocket";
import Monaco from "monaco-editor";
import PacketEditorContentChanged from "./PacketEditorContentChanged";
import PacketUserFocusedEditor from "./PacketUserFocusedEditor";
import Packet, {PacketContent} from "./Packet";
import PacketConnect from "./PacketConnect";
import ChatMessage from "../models/ChatMessage";
import PacketMessage from "./PacketMessage";

class WebSocketConnection {
    socket?: WebSocketClient;
    changeEventListener: { (sandboxId: number, data: Monaco.editor.IModelContentChangedEvent): void; } | undefined;
    focusEventListener: { (sandboxId: number, userId: number, focused: boolean): void; } | undefined;
    newMessageListener: { (message: ChatMessage): void; } | undefined;

    constructor(token: string, attemptId: number) {
        const socketURL = process.env.REACT_APP_WEBSOCKET_URL + '?groupAttempt=' + attemptId + '&token=' + token;
        this.initSocket(socketURL);
    }

    initSocket(socketURL: string) {
        this.socket = new WebSocketClient(socketURL);
        this.socket.onopen = () => {
            console.log('WebSocket Client Connected');
            this.sendPacket(new PacketConnect())
        };
        this.socket.onmessage = (message: any) => {
            if (message.data) {
                const packet: Packet = JSON.parse(message.data);
                this.dispatchPacket(packet);
            }
        };
    }

    sendPacket(packetContent: PacketContent) {
        if (this.socket) {
            if (this.socket.readyState === this.socket.CLOSED) {
                console.log("Socket is closed, reconnecting...");
                this.initSocket(this.socket.url);
                return;
            }

            let packet = new Packet(packetContent.type, packetContent)
            this.socket.send(JSON.stringify(packet));
        }
    }

    dispatchPacket(packet: Packet) {
        if (packet.type === "PacketEditorContentChanged") {
            const packetContent = packet.data as PacketEditorContentChanged;
            this.changeEventListener?.(packetContent.sandboxId, packetContent.change)
        } else if (packet.type === "PacketUserFocusedEditor") {
            const packetContent = packet.data as PacketUserFocusedEditor;
            this.focusEventListener?.(packetContent.sandboxId, packetContent.userId, packetContent.focused);
        } else if (packet.type === "PacketMessage") {
            const packetContent = packet.data as PacketMessage;
            this.newMessageListener?.(packetContent.message);
        }
    }

}

export default WebSocketConnection;
