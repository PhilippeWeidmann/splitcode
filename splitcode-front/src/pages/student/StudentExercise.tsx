import React, {useEffect, useRef} from 'react';
import "../../components/codeEditor/CodeEditor.css";
import {Box, Button, CircularProgress, Container, Divider, Paper, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import APIFetcher from "../../networking/APIFetcher.js";
import Exercise from "../../models/Exercise";
import {parseIntOrNull} from "../../utils/NumberUtils";
import Countdown from 'react-countdown';
import GroupAttempt from "../../models/GroupAttempt";

function StudentExercise() {
    const params = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = React.useState<Exercise | null>(null);
    const [soloEndTime, setSoloEndTime] = React.useState<number>(0);
    const [endTime, setEndTime] = React.useState<number>(0);
    const [attemptForQuestions, setAttemptForQuestions] = React.useState<GroupAttempt | null>(null);
    const courseId = useRef(-1);
    const exerciseId = useRef(-1);
    const currentTimestamp = new Date().getTime();

    useEffect(() => {
        let paramCourseId = parseIntOrNull(params.courseId)
        let paramExerciseId = parseIntOrNull(params.exerciseId)

        if (paramCourseId && paramExerciseId) {
            courseId.current = paramCourseId
            exerciseId.current = paramExerciseId
            APIFetcher.getStudentExercise(paramCourseId, paramExerciseId).then(exercise => {
                setExercise(exercise);
                setSoloEndTime(new Date(exercise.soloEndTime).getTime());
                setEndTime(new Date(exercise.endTime).getTime());
            });
        }

    }, []);

    function createAttempt() {
        APIFetcher.createStudentAttempt(courseId.current, exerciseId.current).then((attempt) => navigate("/student/sandboxes/" + attempt.sandboxId));
    }

    function continueAttempt() {
        if (exercise?.attempt) {
            navigate("/student/sandboxes/" + exercise.attempt.sandboxId)
        }
    }

    function continueGroupAttempt() {
        if (exercise && exercise.groupAttempt) {
            navigate("/student/courses/" + courseId.current + "/exercise/" + exercise.id + "/groupattempts/" + exercise.groupAttempt.id)
        }
    }

    function answerQuestions() {
        if (exercise && exercise.groupAttempt) {
            navigate("/student/exercise/" + exercise.id + "/questions")
        }
    }

    function buttonSolo() {
        if (currentTimestamp < soloEndTime) {
            if (exercise?.attempt) {
                if (exercise.attempt.completedAt !== null) {
                    return <Button sx={{mt: 2}} onClick={createAttempt} variant="contained"
                                   disabled={true}>Start</Button>
                } else {
                    return <Button sx={{mt: 2}} onClick={continueAttempt} variant="contained">Continue</Button>
                }
            } else {
                return <Button sx={{mt: 2}} onClick={createAttempt} variant="contained">Start</Button>
            }
        } else {
            return <Button sx={{mt: 2}} onClick={createAttempt} variant="contained" disabled={true}>Closed</Button>
        }
    }

    function buttonGroup() {
        if (currentTimestamp < endTime) {
            if (exercise?.groupAttempt) {
                if (exercise.groupAttempt.completedAt !== null) {
                    return <Button sx={{mt: 2}} onClick={continueGroupAttempt} variant="contained"
                                   disabled={true}>Start</Button>
                } else {
                    return <Button sx={{mt: 2}} onClick={continueGroupAttempt} variant="contained">Continue</Button>
                }
            } else {
                return <Button sx={{mt: 2}} onClick={continueGroupAttempt} variant="contained"
                               disabled={true}>Start</Button>
            }
        } else {
            return <Button sx={{mt: 2}} onClick={continueGroupAttempt} variant="contained"
                           disabled={true}>Closed</Button>
        }
    }

    function buttonAnswerQuestions() {
        if (exercise?.groupAttempt?.completedAt !== null && exercise?.groupAttempt?.completedAt !== undefined && exercise?.answeredQuestions === false) {
            return <Button sx={{mt: 2}} onClick={answerQuestions} variant="contained">Answer questions</Button>
        } else {
            return null
        }
    }

    const Completion = () => <span style={{color: "red"}}>Closed</span>;

    const renderer = ({days, hours, minutes, seconds, completed}:
                          { days: any, hours: any, minutes: any, seconds: any, completed: any }) => {
        if (completed) {
            return <Completion/>;
        } else {
            return <span style={{color: "green"}}>{days}:{hours}:{minutes}:{seconds}</span>;
        }
    };

    function completed(solo: boolean) {
        if (solo) {
            if (exercise?.attempt?.completedAt) {
                return <Typography variant="subtitle2" color={"green"}>
                    Successfully submitted
                </Typography>
            } else {
                return <Typography variant="subtitle2" color={"red"}>
                    Not submitted
                </Typography>
            }
        } else {
            if (exercise?.groupAttempt?.completedAt) {
                return <Typography variant="subtitle2" color={"green"}>
                    Successfully submitted
                </Typography>
            } else {
                return <Typography variant="subtitle2" color={"red"}>
                    Not submitted
                </Typography>
            }
        }
    }


    if (exercise) {
        return (
            <Container component={Paper}
                       sx={{my: "auto", padding: 5, borderRadius: 2, borderWidth: 1, maxHeight: "80%"}}
                       elevation={5}>
                <Typography variant={"h4"}>Exercise</Typography>
                <Box display={"flex"} sx={{flexDirection: {xs: "column", lg: "row", height: "100%"}}}>
                    <Box flexDirection={"column"} sx={{
                        display: "flex",
                        flex: 1,
                        padding: 3,
                        height: "95%",
                        overflowY: "auto"
                    }}>
                        <Typography variant={"h5"} sx={{mb: 2}}>{exercise?.title}</Typography>
                        <Typography variant={"body1"}>{exercise?.description}</Typography>
                    </Box>
                    <Divider orientation={"vertical"} flexItem/>
                    <Box display={"flex"} flexDirection={"column"}
                         sx={{flex: 1, padding: 3, mt: -2}}>
                        <Box sx={{
                            display: "flex",
                            mb: 1,
                            backgroundColor: "rgba(62,101,248,0.13)",
                            borderRadius: 5,
                            height: "40vh"
                        }}>
                            <img src={"/cherry-729.png"} alt={""} width={"200px"} height={"200px"}/>
                            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", ml: 3}}>
                                <Typography variant={"h4"}>Solo attempt</Typography>
                                <Typography variant={"body1"}>This attempt is done alone.</Typography>
                                <Typography variant={"subtitle2"}>
                                    Time left :&nbsp;
                                    <Countdown key={soloEndTime} date={soloEndTime} renderer={renderer}/>
                                </Typography>
                                {completed(true)}
                                {buttonSolo()}
                            </Box>
                        </Box>
                        <Box sx={{
                            display: "flex",
                            mt: 1,
                            backgroundColor: "rgba(62,101,248,0.13)",
                            borderRadius: 5,
                            height: "40vh"
                        }}>
                            <img src={"/cherry-936.png"} alt={""} width={"200px"} height={"200px"}/>
                            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", ml: 3}}>
                                <Typography variant={"h4"}>Group attempt</Typography>
                                <Typography variant={"body1"}>This attempt is done in pairs.</Typography>
                                <Typography variant={"subtitle2"}>
                                    Time left :&nbsp;
                                    <Countdown key={endTime} date={endTime} renderer={renderer}/>
                                </Typography>
                                {completed(false)}
                                {buttonGroup()}
                                {buttonAnswerQuestions()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Container>
        );
    } else {
        return (
            <div className={"grid place-items-center h-screen"}>
                <CircularProgress/>
            </div>
        )
    }

}

export default StudentExercise;
