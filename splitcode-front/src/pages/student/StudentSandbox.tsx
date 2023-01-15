import React, {useEffect, useRef, useState} from 'react';
import "../../components/codeEditor/CodeEditor.css";
import {Box, Paper, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import APIFetcher from "../../networking/APIFetcher.js";
import EditorPanel from "../../components/codeEditor/EditorPanel";
import Sandbox from "../../models/Sandbox";
import MainToolbar from "../../components/MainToolbar/MainToolbar";
import {ifvisible} from '@rosskevin/ifvisible'

function StudentSandbox() {
    const params = useParams();
    const sandboxId = useRef(-1);
    const [defaultValue, setDefaultValue] = useState<string | null>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const [currentSandbox, setCurrentSandbox] = useState<Sandbox | null>(null);

    useEffect(() => {
        if (params.sandboxId) {
            sandboxId.current = parseInt(params.sandboxId)
            APIFetcher.getSandbox(sandboxId.current).then(res => {
                setCurrentSandbox(res)
                if (res.content) {
                    setDefaultValue(res.content);
                } else {
                    APIFetcher.getAttemptExercise(sandboxId.current).then(exercise => {
                        if (exercise.startingCode) {
                            updateSandboxContent(exercise.startingCode)
                            setDefaultValue(exercise.startingCode);
                        } else {
                            setDefaultValue(res.content);
                        }
                    })

                }
            })
        }
    }, []);

    useEffect(() => {
        let timer = ifvisible.onEvery(30, function () {
            if (currentSandbox && currentSandbox.attempt.id) {
                APIFetcher.checkInAttempt(currentSandbox.attempt.id).then(res => {
                }).catch(err => {
                })
            }
        });
        return () => {
            timer.stop()
        }
    }, [currentSandbox?.id]);

    function updateSandboxContent(content: string) {
        if (!currentSandbox) {
            return
        }
        let newCurrentSandbox = {
            id: currentSandbox.id,
            content,
            attempt: currentSandbox.attempt,
            groupAttempt: currentSandbox.groupAttempt
        }
        setCurrentSandbox(newCurrentSandbox)
    }

    function saveSandbox(content: string) {
        updateSandboxContent(content)

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        let timeoutId = setTimeout(() => {
            if (!currentSandbox) {
                return
            }
            APIFetcher.updateSandbox(sandboxId.current, content).then(res => {
            })
        }, 1000);
        debounceTimer.current = timeoutId;
    }

    if (currentSandbox == null) {
        return null
    }

    return (
        <Box sx={{
            width: "100%",
            height: "100%",
            display: 'flex',
            flexFlow: 'column'
        }}>
            <MainToolbar
                currentSandbox={currentSandbox}
                currentExercise={currentSandbox.attempt.exercise!}
            />
            <Box sx={{
                display: 'flex',
                width: "100%",
                height: "100%",
                flexFlow: 'row',
            }}>
                <Box component={Paper} textOverflow={"auto"}
                     sx={{mx: 1, my: 2, p: 2, width: "20%", flex: '1 1 auto', overflow: "auto"}}>
                    <Typography sx={{mb: 2}} variant="h6" component="div">
                        {currentSandbox.attempt.exercise?.title}
                    </Typography>
                    <Typography style={{whiteSpace: 'pre-wrap'}} variant="body1" component="div">
                        {currentSandbox.attempt.exercise?.description}
                    </Typography>
                </Box>
                <Box sx={{flex: '1 1 auto', m: 1}}>
                    {defaultValue != null ?
                        <EditorPanel isEditable={true}
                                     defaultValue={defaultValue}
                                     onContentChange={saveSandbox}
                                     canBeInsert={false}
                        />
                        :
                        null}
                </Box>
            </Box>

        </Box>
    )
}

export default StudentSandbox;
