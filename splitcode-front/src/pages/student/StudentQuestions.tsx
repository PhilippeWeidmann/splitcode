import React, {useContext, useEffect} from 'react';
import Question from "../../models/Question";
import QuestionAttempt from "../../models/QuestionAttempt";
import {AppStateContext} from "../../App";
import {useNavigate, useParams} from "react-router-dom";
import APIFetcher from "../../networking/APIFetcher.js";
import {Alert, Box, Button, CircularProgress, Container, Paper, Snackbar, Typography} from "@mui/material";
import EditorPanel from "../../components/codeEditor/EditorPanel";
import QuestionElement from "../../components/QuestionElement";
import GroupAttempt from "../../models/GroupAttempt";
import Exercise from "../../models/Exercise";

function StudentQuestions() {
    const [questions, setQuestions] = React.useState<Question[]>([]);
    const [answers, setAnswers] = React.useState<QuestionAttempt[]>([]);
    const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(null);
    const [currentGroupAttempt, setCurrentGroupAttempt] = React.useState<GroupAttempt | null>(null);
    const [snackBarOpen, setSnackBarOpen] = React.useState(false);
    const appState = useContext(AppStateContext);
    const navigate = useNavigate();
    const {exerciseId} = useParams();

    useEffect(() => {
        if (exerciseId) {
            APIFetcher.getExercise(parseInt(exerciseId)).then((exercise) => {
                setCurrentExercise(exercise);
                APIFetcher.getAttemptForQuestion(exercise.id).then((groupAttempt) => {
                    if (groupAttempt.id) {
                        setCurrentGroupAttempt(groupAttempt);
                        APIFetcher.getQuestions(groupAttempt.id).then((questions) => {
                            setQuestions(questions);
                        });
                    } else {
                        navigate("/student/courses/" + exercise.courseId)
                    }
                });
            });
        }


    }, []);

    const handleSave = () => {
        if (!exerciseId) {
            return
        }

        APIFetcher.createQuestionsAnswer(parseInt(exerciseId), answers).then(() => {
            if (currentExercise) {
                navigate("/student/courses/" + currentExercise.courseId)
            } else {
                setSnackBarOpen(true);
            }
        }).catch((err) => {
            setSnackBarOpen(true);
        });
    }

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackBarOpen(false);
    };
    return (
        <Container component={Paper}
                   sx={{my: "2rem", padding: 5, borderRadius: 2, borderWidth: 1}}
                   elevation={5}>
            <Typography variant={"h4"}>Please evaluate the following code to complete the process</Typography>
            <Box sx={{
                display: 'flex',
                width: "100%",
                flexDirection: 'column',
                alignItems: 'center',
            }}>

                {currentGroupAttempt?.sharedSandbox ? (
                    <Box sx={{width: "100%", height: "30rem"}}>
                        <EditorPanel isEditable={false} defaultValue={currentGroupAttempt.sharedSandbox.content}
                                     canBeInsert={false}/>
                    </Box>
                ) : (
                    <div className={"grid place-items-center h-screen"}>
                        <CircularProgress/>
                    </div>
                )}
                {questions.length > 0 ? (
                    displayQuestions()
                ) : (
                    <div className={"grid place-items-center h-screen"}>
                        <CircularProgress/>
                    </div>
                )}
                <Snackbar open={snackBarOpen} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{width: '100%'}}>
                        Error ! Please try to reload the page
                    </Alert>
                </Snackbar>
                <Button variant={"contained"} onClick={handleSave} sx={{
                    alignSelf: "flex-end",
                    mt: "1rem"
                }}
                        disabled={questions.length !== answers.length}>Save</Button>
            </Box>

        </Container>
    )

    function displayQuestions() {
        return questions.map((question) => {
            return (
                <Box key={question.id} sx={{mt: "2rem"}}>
                    <QuestionElement question={question} sendAnswer={getAnswer}/>
                </Box>
            )
        })
    }

    function getAnswer(selectedAnswer: string, question: number) {
        if (appState.value.user) {
            if (selectedAnswer.length > 0) {
                if (currentGroupAttempt) {
                    const answer = new QuestionAttempt(question, currentGroupAttempt.id, appState.value.user.id, parseInt(selectedAnswer));
                    answers.forEach((ans) => {
                        if (ans.questionId === answer.questionId) {
                            const index = answers.indexOf(ans);
                            setAnswers(answers.splice(index, 1));
                        }
                    });
                    setAnswers([...answers, answer]);
                } else {
                    setSnackBarOpen(true);
                }
            }
        }
    }
}

export default StudentQuestions;
