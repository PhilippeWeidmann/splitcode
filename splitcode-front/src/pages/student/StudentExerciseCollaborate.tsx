import React, {createContext, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import GroupAttempt from "../../models/GroupAttempt";
import APIFetcher from "../../networking/APIFetcher.js";
import {parseIntOrNull} from "../../utils/NumberUtils";
import Sandbox from "../../models/Sandbox";
import {Box, CircularProgress} from "@mui/material";
import MainToolbar from "../../components/MainToolbar/MainToolbar";
import {Allotment, AllotmentHandle} from "allotment";
import EditorPanel, {EditorForwardRef} from "../../components/codeEditor/EditorPanel";
import "allotment/dist/style.css";
import "../../components/codeEditor/CodeEditor.css";
import {PacketContent} from "../../networking/Packet";
import WebSocketConnection from "../../networking/WebSocketConnection";
import PacketEditorContentChanged from "../../networking/PacketEditorContentChanged";
import Monaco from "monaco-editor";
import NoCollaboratorCard from "../../components/NoCollaboratorCard";
import PacketEditorFocused from "../../networking/PacketEditorFocused";
import User from "../../models/User";
import Exercise from "../../models/Exercise";
import {ifvisible} from "@rosskevin/ifvisible";

type ExerciseCollaborateState = {
    webSocketConnection?: WebSocketConnection
    groupAttempt?: GroupAttempt
}

export function getUser(state: ExerciseCollaborateState, userId: number): User | undefined {
    if (state.groupAttempt) {
        if (state.groupAttempt.user.id === userId) {
            return state.groupAttempt.user
        } else if (state.groupAttempt.remoteUser.id === userId) {
            return state.groupAttempt.remoteUser
        }
    }
    return undefined
}

const ExerciseCollaborateContext = createContext<ExerciseCollaborateState>({});

function StudentExerciseCollaborate() {
    const params = useParams();
    const [exerciseCollaborateState, setExerciseCollaborateState] = useState<ExerciseCollaborateState>({});

    const [usersFocusingUserSandbox, setUsersFocusingUserSandbox] = useState<User[]>([]);
    const [usersFocusingRemoteSandbox, setUsersFocusingRemoteSandbox] = useState<User[]>([]);
    const [usersFocusingSharedSandbox, setUsersFocusingSharedSandbox] = useState<User[]>([]);
    const lastEventReceived = useRef<Monaco.editor.IModelContentChangedEvent>();

    const [groupAttempt, setGroupAttempt] = useState<GroupAttempt | null>(null);
    const [currentSandbox, setCurrentSandbox] = useState<Sandbox | null>(null);
    const [userSandbox, setUserSandbox] = useState<Sandbox | null>(null);
    const userSandboxEditorRef = useRef<EditorForwardRef>(null);
    const [remoteSandbox, setRemoteSandbox] = useState<Sandbox | null>(null);
    const remoteSandboxEditorRef = useRef<EditorForwardRef>(null);
    const [sharedSandbox, setSharedSandbox] = useState<Sandbox | null>(null);
    const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
    const sharedSandboxEditorRef = useRef<EditorForwardRef>(null);
    const userSandboxDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const sharedSandboxDebounceTimer = useRef<NodeJS.Timeout | null>(null);
    const verticalPanelRef = useRef() as React.MutableRefObject<AllotmentHandle>;
    const horizontalPanelRef = useRef() as React.MutableRefObject<AllotmentHandle>;

    useEffect(() => {
        let courseId = parseIntOrNull(params.courseId);
        let exerciseId = parseIntOrNull(params.exerciseId);
        let attemptId = parseIntOrNull(params.attemptId);

        if (courseId && exerciseId && attemptId) {
            APIFetcher.getGroupAttempt(attemptId).then((groupAttempt) => {
                setExerciseCollaborateState({groupAttempt: groupAttempt})
                setGroupAttempt(groupAttempt)
                APIFetcher.getWebSocketToken(groupAttempt.id).then((websocketToken) => {
                    setExerciseCollaborateState({
                        webSocketConnection: new WebSocketConnection(websocketToken.token, groupAttempt.id),
                        groupAttempt: groupAttempt
                    })
                })
                APIFetcher.getSandbox(groupAttempt.userSandboxId).then((sandbox) => {
                    setUserSandbox(sandbox)
                    setCurrentSandbox(sandbox)
                })
                if (groupAttempt.remoteSandboxId != null) {
                    APIFetcher.getSandbox(groupAttempt.remoteSandboxId).then(setRemoteSandbox).catch(() => {
                    })
                }
                APIFetcher.getSandbox(groupAttempt.sharedSandboxId).then(setSharedSandbox).catch(() => {
                })
                APIFetcher.getExercise(exerciseId!).then(setCurrentExercise)
            })
        }
    }, []);

    useEffect(() => {
        let timer = ifvisible.onEvery(30, function () {
            if (groupAttempt?.id) {
                APIFetcher.checkInGroupAttempt(groupAttempt.id).then(res => {
                }).catch(err => {
                })
            }
        });
        return () => {
            timer.stop()
        }
    }, [groupAttempt?.id]);

    useEffect(() => {
        if (exerciseCollaborateState.webSocketConnection) {
            exerciseCollaborateState.webSocketConnection.focusEventListener = userDidFocusEditor
            exerciseCollaborateState.webSocketConnection.changeEventListener = editorContentChanged
        }
    });

    useEffect(() => {
        const currentSandboxId = currentSandbox?.id;
        if (currentSandboxId == null) {
            return;
        }

        if (currentSandboxId == userSandbox?.id) {
            setCurrentSandbox(userSandbox)
        } else if (currentSandboxId == sharedSandbox?.id) {
            setCurrentSandbox(sharedSandbox)
        } else if (currentSandboxId == remoteSandbox?.id) {
            setCurrentSandbox(remoteSandbox)
        }
    }, [userSandbox, remoteSandbox, sharedSandbox]);


    if (groupAttempt === null || currentSandbox === null || userSandbox === null || sharedSandbox === null) {
        return (
            <div className={"grid place-items-center h-screen"}>
                <CircularProgress/>
            </div>
        )
    }

    function editorContentChanged(sandboxId: number, data: Monaco.editor.IModelContentChangedEvent) {
        if (sandboxId === remoteSandbox?.id) {
            remoteSandboxEditorRef.current?.editorContentChanged(data)
        } else if (sandboxId === sharedSandbox?.id) {
            lastEventReceived.current = data;
            sharedSandboxEditorRef.current?.editorContentChanged(data)
        }
    }

    function userDidFocusEditor(sandboxId: number, userId: number, focused: boolean) {
        if (sandboxId === remoteSandbox?.id) {
            updateSandboxFocusingUsers(userId, focused, usersFocusingRemoteSandbox, setUsersFocusingRemoteSandbox)
        } else if (sandboxId === sharedSandbox?.id) {
            updateSandboxFocusingUsers(userId, focused, usersFocusingSharedSandbox, setUsersFocusingSharedSandbox)
        } else if (sandboxId === userSandbox?.id) {
            updateSandboxFocusingUsers(userId, focused, usersFocusingUserSandbox, setUsersFocusingUserSandbox)
        }
    }

    function updateSandboxFocusingUsers(userId: number, focused: boolean, oldSandboxUsersFocusing: User[], updateFunction: React.Dispatch<React.SetStateAction<User[]>>) {
        let newFocusingSandbox: User[]
        if (focused) {
            newFocusingSandbox = [...oldSandboxUsersFocusing]
            let user = getUser(exerciseCollaborateState, userId)
            if (user) {
                newFocusingSandbox.push(user)
            }
        } else {
            newFocusingSandbox = oldSandboxUsersFocusing.filter((user) => user.id !== userId)
        }
        updateFunction(newFocusingSandbox)
    }

    function sendPacket(packet: PacketContent) {
        exerciseCollaborateState.webSocketConnection?.sendPacket(packet);
    }

    function saveSandbox(timer: React.MutableRefObject<NodeJS.Timeout | null>, sandboxId: number, content: string) {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        let timeout = setTimeout(() => {
            APIFetcher.updateSandbox(sandboxId, content).then(res => {
            })
        }, 1000);
        timer.current = timeout;
    }

    function userEditorChanged(code: string, event: Monaco.editor.IModelContentChangedEvent) {
        if (userSandbox == null) {
            return;
        }

        let newUserSandbox = {
            id: userSandbox.id,
            content: code,
            attempt: userSandbox.attempt,
            groupAttempt: userSandbox.groupAttempt
        }
        setUserSandbox(newUserSandbox)

        saveSandbox(userSandboxDebounceTimer, userSandbox.id, code);
        sendPacket(new PacketEditorContentChanged(userSandbox.id, event))
    }

    function remoteEditorChanged(code: string, event: Monaco.editor.IModelContentChangedEvent) {
        if (remoteSandbox == null) {
            return;
        }

        let newRemoteSandbox = {
            id: remoteSandbox.id,
            content: code,
            attempt: remoteSandbox.attempt,
            groupAttempt: remoteSandbox.groupAttempt
        }
        setRemoteSandbox(newRemoteSandbox)
    }

    function sharedEditorChanged(code: string, event: Monaco.editor.IModelContentChangedEvent) {
        if (sharedSandbox == null) {
            return;
        }

        let newSharedSandbox = {
            id: sharedSandbox.id,
            content: code,
            attempt: sharedSandbox.attempt,
            groupAttempt: sharedSandbox.groupAttempt
        }
        setSharedSandbox(newSharedSandbox)

        saveSandbox(sharedSandboxDebounceTimer, sharedSandbox.id, code);
        if (!changeEventsEqual(event, lastEventReceived.current)) {
            sendPacket(new PacketEditorContentChanged(sharedSandbox.id, event))
        }
    }

    function changeEventsEqual(currentEvent: Monaco.editor.IModelContentChangedEvent, lastEvent?: Monaco.editor.IModelContentChangedEvent) {
        if (lastEvent === undefined || lastEvent === null) {
            return false;
        }
        if (lastEvent.changes.length !== currentEvent.changes.length) {
            return false;
        }
        for (let i = 0; i < lastEvent.changes.length; i++) {
            let lastChange = lastEvent.changes[i];
            let currentChange = currentEvent.changes[i];
            if (lastChange.rangeLength !== currentChange.rangeLength) {
                return false;
            }
            if (lastChange.text !== currentChange.text) {
                return false;
            }
            if (lastChange.rangeOffset !== currentChange.rangeOffset) {
                return false;
            }
            if (lastChange.range.startColumn !== currentChange.range.startColumn
                || lastChange.range.startLineNumber !== currentChange.range.startLineNumber
                || lastChange.range.endColumn !== currentChange.range.endColumn
                || lastChange.range.endLineNumber !== currentChange.range.endLineNumber) {
                return false;
            }
        }
        return true;
    }

    function sharedCursorPositionChanged(lineNumber: number) {
        if (sharedSandbox == null || groupAttempt == null) {
            return;
        }
    }

    function getRemoteSandbox() {
        if (remoteSandbox) {
            return <EditorPanel ref={remoteSandboxEditorRef}
                                isEditable={false}
                                canBeInsert={false}
                                defaultValue={remoteSandbox.content}
                                focusedByUsers={usersFocusingRemoteSandbox}
                                onContentChange={remoteEditorChanged}
                                onFocusChanged={(focused) => {
                                    focusChangedForSandbox(remoteSandbox.id, focused)
                                }}
            />
        } else {
            return <NoCollaboratorCard/>
        }
    }

    function focusChangedForSandbox(id: number, focused: boolean) {
        if (focused) {
            if (id == userSandbox?.id) {
                setCurrentSandbox(userSandbox)
            } else if (id == sharedSandbox?.id) {
                setCurrentSandbox(sharedSandbox)
            } else if (id == remoteSandbox?.id) {
                setCurrentSandbox(remoteSandbox)
            }
        }
        exerciseCollaborateState.webSocketConnection?.sendPacket(new PacketEditorFocused(id, focused))
    }


    return (
        <ExerciseCollaborateContext.Provider value={exerciseCollaborateState}>
            <Box sx={{
                width: "100%",
                height: "100%",
                display: 'flex',
                flexFlow: 'column'
            }}>
                <MainToolbar
                    currentSandbox={currentSandbox}
                    verticalPanelRef={verticalPanelRef.current}
                    horizontalPanelRef={horizontalPanelRef.current}
                    currentExercise={currentExercise!}
                />
                <Allotment vertical ref={verticalPanelRef} snap minSize={0} defaultSizes={[100, 100]}>
                    <Allotment.Pane>
                        <Allotment ref={horizontalPanelRef} snap minSize={0} defaultSizes={[100, 100]}>
                            <EditorPanel ref={userSandboxEditorRef}
                                         isEditable={true}
                                         canBeInsert={false}
                                         defaultValue={userSandbox.content}
                                         focusedByUsers={usersFocusingUserSandbox}
                                         onContentChange={userEditorChanged}
                                         onFocusChanged={(focused) => {
                                             focusChangedForSandbox(userSandbox.id, focused)
                                         }}
                            />
                            {getRemoteSandbox()}
                        </Allotment>
                    </Allotment.Pane>
                    <EditorPanel ref={sharedSandboxEditorRef}
                                 isEditable={true}
                                 canBeInsert={false}
                                 defaultValue={sharedSandbox.content}
                                 focusedByUsers={usersFocusingSharedSandbox}
                                 onContentChange={sharedEditorChanged}
                                 onCursorPositionChange={(lineNumber) => {
                                     sharedCursorPositionChanged(lineNumber)
                                 }}
                                 onFocusChanged={(focused) => {
                                     focusChangedForSandbox(sharedSandbox.id, focused)
                                 }}
                    />
                </Allotment>
            </Box>
        </ExerciseCollaborateContext.Provider>
    );
}

export default StudentExerciseCollaborate;
export {ExerciseCollaborateContext};
