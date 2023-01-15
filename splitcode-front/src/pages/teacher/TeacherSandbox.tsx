import React, {useEffect, useRef, useState} from 'react';
import {Box} from "@mui/material";
import EditorPanel from "../../components/codeEditor/EditorPanel";
import APIFetcher from "../../networking/APIFetcher.js";
import {useParams} from "react-router-dom";


function TeacherSandbox(props: { solo: boolean }) {
    const [defaultValue, setDefaultValue] = useState<string | null>(null);
    const sandboxId = useRef(-1);
    const currentContent = useRef<string>("");
    const params = useParams();

    useEffect(() => {
        if (props.solo) {
            APIFetcher.getSandboxFromAttempt(parseInt(params.exerciseId as string), parseInt(params.attemptId as string)).then(res => {
                currentContent.current = res.content
                sandboxId.current = res.id
                setDefaultValue(res.content);
            })
        } else {
            APIFetcher.getSandboxFromgroupAttempt(parseInt(params.exerciseId as string), parseInt(params.attemptId as string)).then(res => {
                currentContent.current = res.content
                sandboxId.current = res.id
                setDefaultValue(res.content);
            })
        }

    }, []);

    return (
        <Box sx={{
            width: "100%",
            height: "100vh",
        }}>
            {defaultValue ?
                <EditorPanel isEditable={false}
                             canBeInsert={false}
                             defaultValue={defaultValue}
                             onContentChange={() => {
                             }}
                />
                : null}
        </Box>
    )
}

export default TeacherSandbox;
