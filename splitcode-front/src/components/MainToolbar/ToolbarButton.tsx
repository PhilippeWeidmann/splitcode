import React from 'react';
import {Box, ButtonBase, Typography} from "@mui/material";
import FinishAttemptIcon from '@mui/icons-material/TaskOutlined';
import RunCodeIcon from '@mui/icons-material/PlaylistPlayOutlined';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import SplitscreenIcon from '@mui/icons-material/Splitscreen';
import ChatIcon from '@mui/icons-material/Splitscreen';
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface IToolbarButtonProps {
    title: string
    icon: string
    onClick?: () => void
}

function ToolbarButton(props: IToolbarButtonProps) {

    const icons = {
        "runCode": RunCodeIcon,
        "finishAttempt": FinishAttemptIcon,
        "horizontalSplit": HorizontalSplitIcon,
        "verticalSplit": VerticalSplitIcon,
        "splitscreen": SplitscreenIcon,
        "chat": ChatIcon,
        "instructions": MenuBookIcon
    }

    const GenerateIcon = (variation: string) => {
        // @ts-ignore
        const IconName = icons[variation]
        return <IconName sx={{fontSize: 40}}/>
    };

    return (
        <ButtonBase onClick={props.onClick}>
            <Box display={"flex"}
                 flexDirection={"column"}
                 sx={{
                     p: 1,
                     mr: 2,
                     mb: 1,
                     alignItems: "center",
                     ":hover": {
                         backgroundColor: "#f2f2f7"
                     },
                     borderRadius: 2,
                 }}>
                {GenerateIcon(props.icon)}
                <Typography variant={"body2"} mt={1}>{props.title}</Typography>
            </Box>
        </ButtonBase>
    );
}

export default ToolbarButton;
export type {IToolbarButtonProps};
