import React, {useEffect} from 'react';
import Exercise from "../../models/Exercise";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Box, Button, CircularProgress, Grid, Paper, Stack, Typography} from "@mui/material";
import APIFetcher from "../../networking/APIFetcher.js";
import {ArcElement, Chart} from 'chart.js'
import Attempt from "../../models/Attempt";
import ExerciseCard from "../../components/ExerciseCard";
import Course from "../../models/Course";

function TeacherExercisesHome() {

    const [exercises, setExercises] = React.useState<Exercise[] | null>(null);
    const [attempts, setAttempts] = React.useState<Attempt[]>([]);
    const [course, setCourse] = React.useState<Course>();
    const [loading, setLoading] = React.useState(true)
    let {courseId} = useParams();
    Chart.register(ArcElement);
    const navigate = useNavigate();


    useEffect(() => {
        APIFetcher.getCourse(parseInt(courseId as string)).then(response => {
            setCourse(response);
            APIFetcher.getCourseExercises(parseInt(courseId as string)).then(response => {
                setExercises(response);
                response.forEach(exercise => {
                    APIFetcher.getExerciseAttempts(parseInt(courseId as string), exercise.id).then(response => {
                        setAttempts(attempts => [...attempts, ...response]);
                    })
                })
            });
        });

    }, []);

    return (
        <Paper sx={{margin: 4, padding: 2}}>
            <Stack className={"p-5"} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant={"h4"}>
                    {course ? course.name : "Loading"}
                </Typography>
                <Link to={"/teacher/course/" + courseId + "/exercise/create"}>
                    <Button variant="contained">
                        Create an exercise
                    </Button>
                </Link>
            </Stack>
            {exercises ? (
                exercises.length > 0 ? (
                    <Box sx={{margin: 10}}>
                        <Grid container rowSpacing={10}>
                            {exercises.map((exercise, index) => (
                                <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={index}>
                                    <ExerciseCard exercise={exercise} attempts={attempts}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <div className={"grid place-items-center h-screen"}>
                        No exercises yet
                    </div>
                )
            ) : (
                <div className={"grid place-items-center h-screen"}>
                    <CircularProgress/>
                </div>
            )}

        </Paper>
    );


}

export default TeacherExercisesHome;
