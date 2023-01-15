import React, {useContext, useEffect, useState} from 'react';
import {Box, Divider, Drawer, InputAdornment, TextField, Typography} from "@mui/material";
import ChatMessage from "../../models/ChatMessage";
import ChatBubble from "./ChatBubble";
import {ExerciseCollaborateContext} from "../../pages/student/StudentExerciseCollaborate";
import IconButton from "@mui/material/IconButton";
import SendIcon from '@mui/icons-material/Send';
import PacketNewMessage from "../../networking/PacketNewMessage";
import APIFetcher from "../../networking/APIFetcher.js";

interface IChatDrawerProps {
    isOpen: boolean,
    onClose: () => void
}

function ChatDrawer(props: IChatDrawerProps) {
    const exerciseCollaborateState = useContext(ExerciseCollaborateContext);
    const endOfMessageList = React.useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (exerciseCollaborateState.webSocketConnection) {
            exerciseCollaborateState.webSocketConnection.newMessageListener = messageReceived
        }
        if (exerciseCollaborateState.groupAttempt) {
            APIFetcher.getChatMessages(exerciseCollaborateState.groupAttempt?.id).then((messages) => {
                setMessages(messages);
            });
        }
    }, [exerciseCollaborateState]);

    useEffect(() => {
        endOfMessageList.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

    function messageReceived(message: ChatMessage) {
        setMessages(messages => [...messages, message]);
    }

    function onNewMessageTextChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewMessage(event.target.value);
    }

    function sendNewMessage() {
        exerciseCollaborateState.webSocketConnection?.sendPacket(new PacketNewMessage(newMessage));
        setNewMessage("");
    }

    const messageList = messages.map((message) => {
        if (message.content.length > 0) {
            return <ChatBubble key={message.id} message={message}/>
        } else {
            return <></>
        }
    })

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            sendNewMessage();
        }
    }

    return (<Drawer
        variant='persistent'
        anchor={'right'}
        open={props.isOpen}
        onClose={props.onClose}
    >
        <Box sx={{p: 2, width: "33vw", overflow: "hidden"}}>
            <Typography variant="h4">Chat</Typography>
            <Divider/>
            <Box sx={{height: "80vh", overflow: "auto"}}>
                {messageList}
                <div ref={endOfMessageList}></div>
            </Box>
            <Box sx={{py: 2}}>
                <TextField
                    fullWidth
                    label="New message"
                    multiline
                    onKeyPress={handleKeyPress}
                    maxRows={4}
                    value={newMessage}
                    onChange={onNewMessageTextChange}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={sendNewMessage}
                                edge="end"
                            >
                                <SendIcon/>
                            </IconButton>
                        </InputAdornment>
                    }}
                />
            </Box>
        </Box>
    </Drawer>);
}

export default ChatDrawer;
export type {IChatDrawerProps};
