import React, {useContext, useEffect} from "react";
import Exercise from "../models/Exercise";
import {useNavigate} from "react-router-dom";
import {AppStateContext} from "../App";
import {Box, ButtonBase, Card, CardContent, Divider, LinearProgress, Typography} from "@mui/material";
import Attempt from "../models/Attempt";
import {getNotation} from "../utils/GradesUtils";
import APIFetcher from "../networking/APIFetcher.js";
import User from "../models/User";
import {countdownDate} from "../utils/DatesUtils";

function ExerciseCard(props: { exercise: Exercise, attempts: Attempt[] }) {
    const navigate = useNavigate();
    const appState = useContext(AppStateContext);
    const [students, setStudents] = React.useState<User[]>([]);
    const [openClosed, setOpenClosed] = React.useState<React.ReactElement>(<></>);

    useEffect(() => {
        if (appState.value.user?.role === "teacher") {
            APIFetcher.getCourseStudents(props.exercise.courseId).then(students => {
                setStudents(students);
            });
        }
    }, [props.exercise.courseId]);

    useEffect(() => {
        setOpenClosed(closedOrOpenExercise());
        const interval = setInterval(() => {
            setOpenClosed(closedOrOpenExercise());
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card sx={{
            boxShadow: 5,
            backgroundColor: "#f5f7fa",
            width: "20rem",
            height: "22rem",
            ":hover": {boxShadow: 20}
        }}>
            <ButtonBase onClick={() => {
                if (appState.value.user!.role === "teacher") {
                    navigate(`/teacher/course/${props.exercise.courseId}/exercise/${props.exercise.id}`)
                } else {
                    navigate(`/student/courses/${props.exercise.courseId}/exercises/${props.exercise.id}`)
                }
            }}>
                <CardContent sx={{
                    width: "20rem",
                }}>
                    <Typography sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical'
                    }} height={60} variant="h6" component="div" textAlign={"left"}>
                        {props.exercise.title}
                    </Typography>
                    <Typography sx={{mb: 3, mt: 1}} color="text.secondary" textAlign={"left"}>
                        {getNotation(props.exercise.notation)}
                    </Typography>
                    <Typography variant="body2" height={100} textAlign={"justify"} sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '5',
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {props.exercise.description}
                    </Typography>
                    <Divider sx={{marginTop: 1, marginBottom: 1}}/>
                    {openClosed}
                    {appState.value.user!.role === "teacher" ? (
                        <Box sx={{marginTop: 4}}>
                            Submitted attempts : {getNumberOfAttempts(props.exercise.id)} / {students.length}
                            <LinearProgress variant="determinate" color={"success"}
                                            value={getResults(props.exercise.id) / students.length * 100}/>
                        </Box>
                    ) : (
                        <></>
                    )}

                </CardContent>
            </ButtonBase>
        </Card>
    );

    function closedOrOpenExercise() {
        const startTimestamp = new Date(props.exercise.startTime).getTime();
        const endTimestamp = new Date(props.exercise.endTime).getTime();
        const currentTimestamp = new Date().getTime();
        if (startTimestamp < currentTimestamp && endTimestamp > currentTimestamp) {
            return (
                <Box display={"flex"} gap={1}>
                    <Typography variant="body2" color="#0a820c" textAlign={"justify"}>
                        Open
                    </Typography>
                    <Typography variant="body2" textAlign={"justify"}>
                        |
                    </Typography>
                    <Typography variant="body2" color="#c21300" textAlign={"justify"}>
                        Close {countdownDate(startTimestamp, endTimestamp, currentTimestamp, false)}
                    </Typography>
                </Box>
            )
        } else if (startTimestamp > currentTimestamp) {
            return (
                <Box display={"flex"} gap={1}>
                    <Typography variant="body2" color="#c21300" textAlign={"justify"}>
                        Closed
                    </Typography>
                    <Typography variant="body2" textAlign={"justify"}>
                        |
                    </Typography>
                    <Typography variant="body2" color="#0a820c" textAlign={"justify"}>
                        Open {countdownDate(startTimestamp, endTimestamp, currentTimestamp, true)}
                    </Typography>
                </Box>
            )
        } else {
            return (
                <Box>
                    <Typography variant="body2" color="#c21300" textAlign={"justify"}>
                        Closed
                    </Typography>
                </Box>
            )
        }
    }


    function getNumberOfAttempts(exerciseId: number) {
        let result = 0;
        props.attempts.forEach(attempt => {
            if (attempt.exerciseId === exerciseId && attempt.attemptResult != null) {
                result++;
            }
        });
        return result;
    }

    function getResults(exerciseId: number): number {
        let pass = 0;
        props.attempts.forEach(attempt => {
            if (attempt.exerciseId === exerciseId && attempt.attemptResult != null) {
                if (attempt.attemptResult.type === 1) {
                    if (attempt.attemptResult.result >= 4) {
                        pass++;
                    }
                } else if (attempt.attemptResult.type === 2) {
                    if (attempt.attemptResult.result !== 0) {
                        pass++;
                    }
                } else {
                    pass++;
                }
            }
        });
        return pass
    }
}


export default ExerciseCard;
