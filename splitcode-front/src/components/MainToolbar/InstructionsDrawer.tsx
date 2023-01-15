import React from 'react';
import Exercise from "../../models/Exercise";
import {Box, Divider, Drawer, Typography} from "@mui/material";


interface IInstructionsDrawerProps {
    isOpen: boolean,
    onClose: () => void,
    exercise?: Exercise
}

function InstructionsDrawer(props: IInstructionsDrawerProps) {

    return (
        <Drawer
            variant='persistent'
            anchor={'right'}
            open={props.isOpen}
            onClose={props.onClose}
        >
            <Box sx={{p: 2, width: "33vw", overflow: "hidden"}}>
                <Typography variant="h4">Instructions</Typography>
                <Divider sx={{my: 2}}/>
                <Typography variant="h6">{props.exercise?.title}</Typography>
                <Typography style={{whiteSpace: 'pre-wrap'}} variant="body1">{props.exercise?.description}</Typography>
            </Box>
        </Drawer>
    );

}

export default InstructionsDrawer;
