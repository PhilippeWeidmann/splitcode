import React from 'react';
import {Box, CircularProgress, Drawer, Typography} from "@mui/material";
import '../codeEditor/EditorPanel.css';

interface IExecutionDrawerProps {
    isOpen: boolean,
    isCompiling: boolean,
    outputText: string,
    onClose: () => void
}

function ExecutionDrawer(props: IExecutionDrawerProps) {
    return (
        <Drawer
            anchor={'bottom'}
            open={props.isOpen}
            onClose={props.onClose}
        >
            <Box sx={{p: 2}}>
                <Typography variant="h4" component="h4">
                    Result:
                </Typography>
                {props.isCompiling ?
                    <div className={"grid place-items-center"}>
                        <CircularProgress/>
                    </div> :
                    <Box className={"resultConsole p-2"}>
                        <p>{props.outputText}</p>
                    </Box>
                }
            </Box>
        </Drawer>
    );
}

export default ExecutionDrawer;
export type {IExecutionDrawerProps};
