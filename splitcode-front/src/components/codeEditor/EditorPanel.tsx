import Editor, {Monaco as MonacoEditorReact} from "@monaco-editor/react";
import React, {useImperativeHandle, useRef} from "react";
import * as Monaco from "monaco-editor";
import './EditorPanel.css';
import {constrainedEditor} from "constrained-editor-plugin";
import {Avatar, AvatarGroup, Box} from "@mui/material";
import {stringAvatar} from "../../utils/ColorsUtils";
import User from "../../models/User";

interface EditorPanelProps {
    isEditable: boolean;
    canBeInsert: boolean;
    defaultValue: string;
    focusedByUsers?: User[];
    onContentChange?: (content: string, event: Monaco.editor.IModelContentChangedEvent) => void;
    onCursorPositionChange?: (position: number) => void;
    onFocusChanged?: (focused: boolean) => void;
}

type EditorForwardRef = {
    editorContentChanged: (event: Monaco.editor.IModelContentChangedEvent) => void,
    userFocusedEditor: (userId: number, focused: boolean) => void,
}

const EditorPanel: React.ForwardRefRenderFunction<EditorForwardRef, EditorPanelProps> = (props, ref) => {
    const selectedLine = useRef<number>(-1);
    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor>();
    let blocked: { range: number[]; allowMultiline: boolean; }[] = [];

    useImperativeHandle(ref, () => ({
        editorContentChanged(event: Monaco.editor.IModelContentChangedEvent) {
            let editor = editorRef.current;
            editor?.getModel()?.pushEditOperations([], event.changes, () => []);
        },
        userFocusedEditor(userId: number, focused: boolean) {
        }
    }));

    function onFocus() {
        props.onFocusChanged?.(true);
    }

    function onBlur() {
        props.onFocusChanged?.(false);
    }

    function handleMount(editor: Monaco.editor.IStandaloneCodeEditor, monaco: MonacoEditorReact) {
        editorRef.current = editor;
        // Set consistent end of line between Windows and Unix platforms
        editor.getModel()?.setEOL(Monaco.editor.EndOfLineSequence.LF);

        if (editorRef.current?.getValue().includes("//CODE BEGINS HERE") && editorRef.current?.getValue().includes("//CODE ENDS HERE")) {
            const constrainedInstance = constrainedEditor(monaco);
            const model = editor.getModel();
            constrainedInstance.initializeIn(editor);
            const rangeStart = editorRef.current?.getModel()?.findMatches("//CODE BEGINS HERE", false, false, false, null, false).pop()?.range
            const rangeEnd = editorRef.current?.getModel()?.findMatches("//CODE ENDS HERE", false, false, false, null, false).pop()?.range
            if (rangeStart && rangeEnd) {
                console.log("" + rangeEnd.endLineNumber)
                blocked.push(
                    {
                        range: [rangeStart.startLineNumber + 1, 1, rangeEnd.endLineNumber, 1],
                        allowMultiline: true
                    });
                constrainedInstance.addRestrictionsTo(model, blocked);
            }
        }

        editor.onDidChangeModelContent(function (e: Monaco.editor.IModelContentChangedEvent) {
            props.onContentChange?.(editor.getValue(), e);
        });

        editor.onDidChangeCursorPosition(function (e: Monaco.editor.ICursorPositionChangedEvent) {
            if (e.position.lineNumber !== selectedLine.current) {
                selectedLine.current = e.position.lineNumber;
                props.onCursorPositionChange?.(e.position.lineNumber);
            }
        });
    }

    function insertCodeMarker() {
        const line = editorRef.current!!.getPosition();
        let range = new Monaco.Range(line!!.lineNumber, 1, line!!.lineNumber, 1);
        const id = {major: 1, minor: 1};
        let text = "//CODE BEGINS HERE\n\n";
        let op = {identifier: id, range: range, text: text, forceMoveMarkers: true};
        text = "//CODE ENDS HERE\n";
        range = new Monaco.Range(line!!.lineNumber + 1, 1, line!!.lineNumber + 1, 1);
        let op2 = {identifier: id, range: range, text: text, forceMoveMarkers: true};
        editorRef.current!!.executeEdits("my-source", [op, op2]);
    }

    return (
        <Box sx={{height: "100%", p: 1}}>
            <div className={"panelContent h-full bg-white rounded-md shadow-sm"}
                 onFocus={onFocus} onBlur={onBlur}>
                <AvatarGroup className={"absolute z-10 right-0 -top-0.5"} total={props.focusedByUsers?.length ?? 0}>
                    {
                        props.focusedByUsers?.map((user) => {
                            return <Avatar key={user.id} className={"fadeIn"} {...stringAvatar(user.name)} />
                        })
                    }
                </AvatarGroup>
                <div className={"h-full p-2"}>
                    <Editor
                        onMount={handleMount}
                        options={{
                            readOnly: !props.isEditable,
                            fixedOverflowWidgets: true,
                            minimap: {
                                enabled: false
                            }
                        }}
                        defaultLanguage="scala"
                        defaultValue={props.defaultValue}
                    />
                </div>
            </div>
        </Box>
    );

}

export default React.forwardRef(EditorPanel);
export type {EditorPanelProps, EditorForwardRef};

