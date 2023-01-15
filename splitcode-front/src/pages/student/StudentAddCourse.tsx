import React, {useContext, useEffect} from "react";
import {Box, CircularProgress, Grid, Paper, Stack, Typography} from "@mui/material";
import Course from "../../models/Course";
import APIFetcher from "../../networking/APIFetcher.js";
import {AppStateContext} from "../../App";
import {pastelPalette} from "../../utils/ColorsUtils";
import CourseCardToAdd from "../../components/CourseCardToAdd";

function StudentAddCourse() {
    let appState = useContext(AppStateContext);
    const [courses, setCourses] = React.useState<Course[]>([]);

    useEffect(() => {
        appState.setTitle("Add Courses")
        APIFetcher.getCourses().then((results) => {
            setCourses(results)
        });
    }, []);


    return (
        <Paper sx={{margin: 4, padding: 2}}>
            <Stack className={"p-5"} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant={"h3"}>
                    Available courses
                </Typography>
            </Stack>
            {courses.length > 0 ? (
                <Box sx={{margin: 10}}>
                    <Grid container rowSpacing={10}>
                        {courses.map((course, index) => (
                            <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                                <CourseCardToAdd course={course} bgColor={pastelPalette[index % pastelPalette.length]}/>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            ) : (
                <div className={"grid place-items-center h-screen"}>
                    <CircularProgress/>
                </div>
            )}
        </Paper>
    );
}

export default StudentAddCourse;
