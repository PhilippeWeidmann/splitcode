import React, {useContext, useEffect} from "react";
import {Link} from "react-router-dom";
import {Box, Button, CircularProgress, Grid, Paper, Stack, Typography,} from "@mui/material";
import Course from "../../models/Course";
import APIFetcher from "../../networking/APIFetcher.js";
import {AppStateContext} from "../../App";
import CourseCard from "../../components/CourseCard";
import {pastelPalette} from "../../utils/ColorsUtils";

function StudentCourses() {
    let appState = useContext(AppStateContext);
    const [courses, setCourses] = React.useState<Course[] | null>(null);

    useEffect(() => {
        appState.setTitle("Courses")
        APIFetcher.getStudentCourses().then((response) => {
            if (response.length > 0) {
                setCourses(response);
            }
        }).catch(() => {
            console.log("error")
        });
    }, []);

    return (
        <Paper sx={{margin: 4, padding: 2}}>
            <Stack className={"p-5"} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant={"h3"}>
                    My courses
                </Typography>
                <Link to={"/student/courses/add"}>
                    <Button variant="contained">
                        Sign up for a course
                    </Button>
                </Link>
            </Stack>
            {courses ? (
                courses.length > 0 ? (
                    <Box sx={{margin: 10}}>
                        <Grid container rowSpacing={10}>
                            {courses.map((course, index) => (
                                <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                                    <CourseCard course={course} bgColor={pastelPalette[index % pastelPalette.length]}/>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : (
                    <div className={"grid place-items-center h-screen"}>
                        <CircularProgress/>
                    </div>
                )) : (
                <div className={"grid place-items-center h-screen"}>
                    You are not enrolled in any course yet.
                </div>
            )}

        </Paper>
    );
}

export default StudentCourses;
