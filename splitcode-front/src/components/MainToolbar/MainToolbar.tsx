import React, {useState} from 'react';
import {Box, Tab, Tabs, Toolbar} from "@mui/material";
import {useNavigate} from "react-router-dom";
import Sandbox from "../../models/Sandbox";
import '../codeEditor/EditorPanel.css';
import APIFetcher, {ApiError} from "../../networking/APIFetcher.js";
import ExecutionDrawer from "./ExecutionDrawer";
import ToolbarButton, {IToolbarButtonProps} from "./ToolbarButton";
import {AllotmentHandle} from "allotment";
import ChatDrawer from "../Chat/ChatDrawer";
import InstructionsDrawer from "./InstructionsDrawer";
import Exercise from "../../models/Exercise";
import ConfirmFinishAttemptDialog from "./ConfirmFinishAttemptDialog";

interface IMainToolbarProps {
    currentSandbox: Sandbox;
    verticalPanelRef?: AllotmentHandle;
    horizontalPanelRef?: AllotmentHandle;
    currentExercise: Exercise;
}

function MainToolbar(props: IMainToolbarProps) {
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(0);
    const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
    const [instructionsDrawerOpen, setInstructionsDrawerOpen] = useState(false);
    const [executionDrawerOpen, setExecutionDrawerOpen] = useState(false);
    const [executionOutputText, setExecutionOutputText] = useState("");
    const [isCompiling, setCompiling] = useState(false);
    const [isShowingFinishAttemptDialog, setShowingFinishAttemptDialog] = useState(false);
    const [defaultView, setDefaultView] = useState(true);

    let outputText = "";
    const navigate = useNavigate();

    const mainTabButtonsSolo: Array<IToolbarButtonProps> = [
        {title: "Run Code", icon: "runCode", onClick: runCode},
        {
            title: "Finish Attempt", icon: "finishAttempt", onClick: () => {
                // We wait 1.1 seconds to be sure that the attempt is auto saved
                setTimeout(() => {
                    setShowingFinishAttemptDialog(true);
                }, 1100)
            }
        },
    ]
    const mainTabButtonsGroup: Array<IToolbarButtonProps> = [
        {title: "Run Code", icon: "runCode", onClick: runCode},
        {
            title: "Finish Attempt", icon: "finishAttempt", onClick: () => {
                // We wait 1.1 seconds to be sure that the attempt is auto saved
                setTimeout(() => {
                    setShowingFinishAttemptDialog(true);
                }, 1100)
            }
        },
        {title: "Open chat", icon: "chat", onClick: toggleChat},
        {title: "Show instructions", icon: "instructions", onClick: toggleInstructions},
    ]
    const presentationTabButtons: Array<IToolbarButtonProps> = [
        {title: "Only my code", icon: "horizontalSplit", onClick: resizeToOnlyMe},
        {title: "Only my partner's code", icon: "verticalSplit", onClick: resizeToOnlyCollaborate},
        {title: "Only shared code", icon: "splitscreen", onClick: resizeToShared}
    ]

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTabIndex(newValue);
    };

    function toggleChat() {
        setChatDrawerOpen(!chatDrawerOpen)
    }

    function resizeToOnlyMe() {
        setDefaultView(!defaultView)
        if (!defaultView) {
            props.verticalPanelRef?.resize([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
            props.horizontalPanelRef?.resize([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
        } else {
            props.verticalPanelRef?.resize([Number.MAX_SAFE_INTEGER, 0])
            props.horizontalPanelRef?.resize([Number.MAX_SAFE_INTEGER, 0])
        }

    }

    function resizeToOnlyCollaborate() {
        setDefaultView(!defaultView)
        if (!defaultView) {
            props.verticalPanelRef?.resize([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
            props.horizontalPanelRef?.resize([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
        } else {
            props.verticalPanelRef?.resize([Number.MAX_SAFE_INTEGER, 0])
            props.horizontalPanelRef?.resize([0, Number.MAX_SAFE_INTEGER])
        }
    }

    function resizeToShared() {
        setDefaultView(!defaultView)
        if (!defaultView) {
            props.verticalPanelRef?.resize([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
            props.horizontalPanelRef?.resize([Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER])
        } else {
            props.verticalPanelRef?.resize([0, Number.MAX_SAFE_INTEGER])
            props.horizontalPanelRef?.resize([0, Number.MAX_SAFE_INTEGER])
        }
    }

    function finishAttempt() {
        setShowingFinishAttemptDialog(false);
        if (props.currentSandbox.attempt) {
            finishSoloAttempt()
        } else if (props.currentSandbox.groupAttempt) {
            finishGroupAttempt()
        }
    }

    function finishSoloAttempt() {
        let currentSandbox = props.currentSandbox;
        let attemptId = currentSandbox.attempt.id;
        if (attemptId) {
            APIFetcher.finishStudentAttempt(attemptId).then(res => {
                navigate("/student/courses/" + props.currentExercise.courseId)
            })
        }
    }

    function finishGroupAttempt() {
        let currentSandbox = props.currentSandbox;
        let groupAttemptId = currentSandbox.groupAttempt.id;
        if (groupAttemptId) {
            APIFetcher.finishStudentGroupAttempt(groupAttemptId).then(res => {
                navigate("/student/exercise/" + props.currentExercise.id + "/questions")
            })
        }
    }


    function runCode() {
        setCompiling(true)
        setExecutionDrawerOpen(true)
        outputText = "";
        setExecutionOutputText(outputText)
        APIFetcher.compileCode(props.currentSandbox.content).then(res => {
            setCompiling(false)
            // Hijack console.log
            let cl = console.log;

            console.log = logToOutputText;

            eval(res)

            // restore console.log
            console.log = cl;
            setExecutionOutputText(outputText)
        }).catch(err => {
            if (err instanceof ApiError) {
                setCompiling(false)
                setExecutionOutputText((err as ApiError).errors['details'][0])
            }
        });
    }

    function logToOutputText(text: string) {
        outputText += (text + '\n')
    }

    function getButtonsForCurrentTab() {
        if (selectedTabIndex === 0) {
            //TODO : check if group or solo attempt the right way
            if (!props.currentSandbox.attempt) {
                return mainTabButtonsGroup
            } else {
                return mainTabButtonsSolo
            }
        } else if (selectedTabIndex === 1) {
            if (!props.currentSandbox.attempt) {
                return presentationTabButtons
            } else {
                return []
            }
        } else {
            return []
        }
    }

    function getTabsForCurrentAttempt() {
        if (props.currentSandbox.attempt) {
            return <Tabs value={selectedTabIndex} onChange={handleChange}>
                <Tab label="General"/>
            </Tabs>
        } else {
            return <Tabs value={selectedTabIndex} onChange={handleChange}>
                <Tab label="General"/>
                <Tab label="Presentation"/>
            </Tabs>
        }
    }

    function toggleInstructions() {
        setInstructionsDrawerOpen(!instructionsDrawerOpen)
    }

    return (
        <Box sx={{background: 'white'}}>
            <ConfirmFinishAttemptDialog isShowing={isShowingFinishAttemptDialog}
                                        isGroupAttempt={props.currentSandbox.groupAttempt !== undefined}
                                        isEnabled={
                                            props.currentSandbox.groupAttempt === undefined
                                            || (props.currentSandbox.groupAttempt?.firstUserId !== null && props.currentSandbox.groupAttempt?.secondUserId !== null)
                                        }
                                        handleClose={() => setShowingFinishAttemptDialog(false)}
                                        handleConfirm={finishAttempt}
            />
            <ExecutionDrawer isOpen={executionDrawerOpen}
                             isCompiling={isCompiling}
                             outputText={executionOutputText}
                             onClose={() => setExecutionDrawerOpen(false)}
            />
            <ChatDrawer isOpen={chatDrawerOpen}
                        onClose={() => setChatDrawerOpen(false)}
            />
            <InstructionsDrawer isOpen={instructionsDrawerOpen} onClose={() => setInstructionsDrawerOpen(false)}
                                exercise={props.currentExercise}/>
            {getTabsForCurrentAttempt()}
            <div>
                <Toolbar sx={{pt: 2}}>
                    {
                        getButtonsForCurrentTab()?.map((button) =>
                            <ToolbarButton key={button.icon}
                                           title={button.title}
                                           icon={button.icon}
                                           onClick={button.onClick}
                            />
                        )
                    }
                </Toolbar>
            </div>
        </Box>
    );
}

export default MainToolbar;
export type {IMainToolbarProps};
