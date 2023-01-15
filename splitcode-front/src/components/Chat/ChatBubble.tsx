import React, {useContext} from 'react';
import {Avatar, Box, Typography} from "@mui/material";
import ChatMessage from "../../models/ChatMessage";
import {ExerciseCollaborateContext, getUser} from "../../pages/student/StudentExerciseCollaborate";
import {stringAvatar} from "../../utils/ColorsUtils";
import {AppStateContext} from "../../App";
import "./ChatBubbleStyle.css";

interface IChatBubbleProps {
    message: ChatMessage
}

function ChatBubble(props: IChatBubbleProps) {
    const exerciseCollaborateState = useContext(ExerciseCollaborateContext);
    const appState = useContext(AppStateContext);
    if (props.message.userId === appState.value.user?.id) {
        return (
            <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                <Box className={"imessage"}>
                    <p className={"from-me"}>
                        {props.message.content}
                    </p>

                </Box>
                <Box sx={{marginTop: "auto", paddingBottom: 2}}>
                    <Typography
                        variant={"caption"}>{new Date(props.message.createdAt).getHours() + ":" + new Date(props.message.createdAt).getMinutes()}
                    </Typography>
                    <Avatar
                        key={props.message.userId}
                        {...stringAvatar(getUser(exerciseCollaborateState, props.message.userId)?.name ?? "?")}
                    />
                </Box>
            </Box>
        );
    } else {
        return (
            <Box sx={{display: "flex", justifyContent: "flex-start"}}>
                <Box sx={{marginTop: "auto", paddingBottom: 2}}>
                    <Typography
                        variant={"caption"}>{new Date(props.message.createdAt).getHours() + ":" + new Date(props.message.createdAt).getMinutes()}
                    </Typography>
                    <Avatar
                        key={props.message.userId}
                        {...stringAvatar(getUser(exerciseCollaborateState, props.message.userId)?.name ?? "?")}
                    />
                </Box>
                <Box className={"imessage"}>
                    <p className={"from-them"}>
                        {props.message.content}
                    </p>
                </Box>

            </Box>
        );
    }


}

export default ChatBubble;
export type {IChatBubbleProps};
