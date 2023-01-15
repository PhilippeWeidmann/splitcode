import {WebSocketServer} from 'ws';
import Packet, {PacketContent} from "./networking/Packet";
import {IncomingMessage} from "http";
import {URL} from 'url';
import PacketEditorContentChanged from "./networking/PacketEditorContentChanged";
import axios, {AxiosError} from "axios";
import GroupAttemptRoom from "./GroupAttemptRoom";
import PacketEditorFocused from "./networking/PacketEditorFocused";
import PacketUserFocusedEditor from "./networking/PacketUserFocusedEditor";
import PacketMessage, {ChatMessage} from "./networking/PacketMessage";
import PacketNewMessage from "./networking/PacketNewMessage";

const baseURL = 'http://127.0.0.1:8000/websocket/'
const wss = new WebSocketServer({port: 4200});

declare global {
    interface WebSocket {
        userId: number | undefined;
        groupAttemptId: number | undefined;
    }
}

let rooms: { [id: number]: GroupAttemptRoom; } = {};

wss.on('connection', function connection(ws: WebSocket, request: IncomingMessage) {
    ws.onmessage = (event: MessageEvent) => {
        if (request.url == null) return;

        authenticateUser(ws, request).then((result) => {
            if (!result) {
                ws.close();
                return
            }

            let [userId, groupAttemptId] = result
            let data = event.data as string;
            if (wss.clients && rooms[groupAttemptId]) {
                handlePacket(userId, rooms[groupAttemptId], data, ws).then(() => {});
            }
        })
    }
    ws.onclose = (event: CloseEvent) => {
        /*if (lock == null) return;
        // @ts-ignore
        if (ws.userId == lock.userId) {
            console.log("Client " + lock.userId + " gave up Lock (closed)")
            let unlockPacket = new PacketLock(lock.userId, LockType.unlock);
            sendPacketToAll(unlockPacket, ws);
            lock = null;
        }*/
    }

});

async function handlePacket(userId: number, room: GroupAttemptRoom, data: string, ws: WebSocket) {
    const packet: Packet = JSON.parse(data);
    if (packet.type == PacketEditorContentChanged.name) {
        let editorChangedPacket = packet.data as PacketEditorContentChanged;
        sendPacketToRoom(PacketEditorContentChanged.name, editorChangedPacket, room, userId);
    } else if (packet.type == PacketEditorFocused.name) {
        const receivedPacket = packet.data as PacketEditorFocused;
        const packetUserFocusedEditor = new PacketUserFocusedEditor(receivedPacket.sandboxId, userId, receivedPacket.focused);
        sendPacketToRoom(PacketUserFocusedEditor.name, packetUserFocusedEditor, room);
    } else if (packet.type == PacketNewMessage.name) {
        const receivedPacket = packet.data as PacketNewMessage;
        const createdMessage = await handlePacketNewMessage(userId, room, receivedPacket)
        if (createdMessage) {
            const packetMessage = new PacketMessage(createdMessage);
            sendPacketToRoom(PacketMessage.name, packetMessage, room);
        }
    }
}

async function handlePacketNewMessage(userId: number, room: GroupAttemptRoom, packet: PacketNewMessage): Promise<ChatMessage | undefined> {
    try {
        let createdMessage = await axios.put(baseURL + 'groupattempts/'+room.groupAttemptId+'/messages', {
            message: packet.message,
            userId: userId
        })
        return {id: createdMessage.data.id, content: createdMessage.data.content, createdAt: createdMessage.data.created_at, userId: createdMessage.data.user_id}
    } catch (error) {
        console.log(error)
        return undefined
    }
}

async function authenticateUser(ws: WebSocket, request: IncomingMessage): Promise<[number, number] | null> {
    let requestUrl = new URL("https://localhost" + request.url);
    let token = requestUrl.searchParams.get('token');
    let groupAttemptId = requestUrl.searchParams.get('groupAttempt');
    if (ws.userId && ws.groupAttemptId) {
        return [ws.userId, ws.groupAttemptId]
    } else {
        try {
            let decryptedToken = await axios.get(baseURL + 'token/decrypt?encryptedToken=' + token)
            console.log('Client token verified', decryptedToken.data.userId)
            if (groupAttemptId == decryptedToken.data.groupAttemptId) {
                let groupAttemptId = decryptedToken.data.groupAttemptId
                ws.userId = decryptedToken.data.userId
                ws.groupAttemptId = groupAttemptId
                if (!rooms[groupAttemptId]) {
                    let data = decryptedToken.data
                    rooms[groupAttemptId] = new GroupAttemptRoom(
                        groupAttemptId,
                        data.first_user_id,
                        data.second_user_id,
                        data.first_user_sandbox_id,
                        data.second_user_sandbox_id,
                        data.shared_sandbox_id)
                }
                return [decryptedToken.data.userId, groupAttemptId]
            }
            return null
        } catch (error) {
            let axiosError = error as AxiosError
            if (axiosError) {
                console.log(axiosError)
            }
            return null
        }
    }
}

function sendPacketToRoom(packetType: string, packetContent: PacketContent, room: GroupAttemptRoom, exceptOriginalSenderId?: number) {
    let packet = new Packet(packetType, packetContent)
    let stringPacket = JSON.stringify(packet)
    if (wss.clients) {
        let roomSockets = Array.from(wss.clients as unknown as Set<WebSocket>).filter(client => client.groupAttemptId == room.groupAttemptId)
        for (const socket of roomSockets) {
            if (socket.userId != exceptOriginalSenderId) {
                socket.send(stringPacket)
            }
        }
    }
}
