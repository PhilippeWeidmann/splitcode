import React, {useEffect} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import Exercise from "../models/Exercise";
import Attempt from "../models/Attempt";
import GroupAttempt from "../models/GroupAttempt";
import {useNavigate} from "react-router-dom";

function ChangeGradeDialog(props: { onClose: () => void, onSave: (grade: string, attempt: Attempt | GroupAttempt, solo: boolean) => void, data: { open: boolean, exercise: Exercise, attempt: Attempt | GroupAttempt, solo: boolean } }) {
    const [grade, setGrade] = React.useState<string>("0");
    const [currentAttempt, setCurrentAttempt] = React.useState<Attempt | null>(null);
    const [currentGroupAttempt, setCurrentGroupAttempt] = React.useState<GroupAttempt | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.data.attempt) {
            if (props.data.solo) {
                setCurrentAttempt(props.data.attempt as Attempt);
                setGrade((props.data.attempt as Attempt).attemptResult?.result?.toString() ?? "0");
            } else {
                setCurrentGroupAttempt(props.data.attempt as GroupAttempt);
                setGrade((props.data.attempt as GroupAttempt).attemptResult?.result?.toString() ?? "0");
            }
        }
    }, [props.data.attempt]);

    const handleChange = (event: SelectChangeEvent) => {
        setGrade(event.target.value as string);
    }
    const handleSave = () => {
        props.onSave(grade, props.data.solo ? currentAttempt!! : currentGroupAttempt!!, props.data.solo);
    }

    return (
        <>
            {props.data ? (
                <Dialog open={props.data.open} onClose={props.onClose} fullWidth={true} maxWidth={"md"}>
                    <DialogTitle>{props.data.solo ? currentAttempt?.user?.name : (currentGroupAttempt?.firstUser?.name + " & " + currentGroupAttempt?.secondUser?.name)}</DialogTitle>
                    <DialogContent>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <Typography>Change the grade</Typography>
                            <FormControl sx={{width: "25%", ml: "1rem"}}>
                                <InputLabel id={"selectLabel"}>Grade</InputLabel>
                                <Select
                                    id={"selectGrade"}
                                    value={grade}
                                    displayEmpty={true}
                                    label={"Grade"}
                                    labelId={"selectLabel"}
                                    onChange={handleChange}
                                >
                                    {gradeSelect()}
                                </Select>
                            </FormControl>
                        </Box>
                        <Button variant={"contained"} color={"secondary"} fullWidth sx={{mt: "2rem"}} onClick={() => {
                            navigate(`/teacher/exercise/${props.data.exercise.id}/attempt/${props.data.solo ? currentAttempt!!.id : currentGroupAttempt!!.id}/${props.data.solo ? "solo" : "group"}/sandbox`);
                        }}>Go to code</Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.onClose}>Cancel</Button>
                        <Button onClick={handleSave} variant={"contained"}>Save</Button>
                    </DialogActions>
                </Dialog>
            ) : (
                <></>
            )}
        </>

    );

    function gradeSelect() {
        let grades = [];
        if (props.data?.attempt?.attemptResult?.type === undefined || props.data?.attempt?.attemptResult?.result === undefined) {
            grades.push(<MenuItem key={0} value={0}>Not evaluated</MenuItem>);
        } else {
            switch (props.data.attempt?.attemptResult?.type) {
                case 1:
                    grades.push(<MenuItem key={0} value={0}>0</MenuItem>);
                    grades.push(<MenuItem key={1} value={1}>1</MenuItem>);
                    grades.push(<MenuItem key={2} value={2}>2</MenuItem>);
                    grades.push(<MenuItem key={3} value={3}>3</MenuItem>);
                    grades.push(<MenuItem key={4} value={4}>4</MenuItem>);
                    grades.push(<MenuItem key={5} value={5}>5</MenuItem>);
                    grades.push(<MenuItem key={6} value={6}>6</MenuItem>);
                    break;
                case 2:
                    grades.push(<MenuItem key={0} value={0}>Failed</MenuItem>);
                    grades.push(<MenuItem key={1} value={1}>Passed</MenuItem>);
                    break;
                default:
                    grades.push(<MenuItem key={0} value={0}>Not evaluated</MenuItem>)
            }
        }
        return grades;
    }
}

export default ChangeGradeDialog;
