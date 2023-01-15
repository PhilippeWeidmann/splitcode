import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import APIFetcher from "../../networking/APIFetcher.js";
import {Box, Button, CircularProgress, Grid, Paper, Stack, Typography} from "@mui/material";
import Course from "../../models/Course";
import CourseCard from "../../components/CourseCard";
import {pastelPalette} from "../../utils/ColorsUtils";

function TeacherHome() {

    const [courses, setCourses] = React.useState<Course[]>([]);


    useEffect(() => {

        APIFetcher.getTeacherCourses().then(response => {
            setCourses(response);
        });
    }, []);

    return (
        <Paper sx={{margin: 4, padding: 2}}>
            <Stack className={"p-5"} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant={"h3"}>
                    My courses
                </Typography>
                <Link to={"/teacher/course/create"}>
                    <Button variant="contained">
                        Create a course
                    </Button>
                </Link>
            </Stack>
            {courses.length > 0 ? (
                <Box sx={{margin: 10}}>
                    <Grid container rowSpacing={10}>
                        {courses.map((course, index) => (
                            <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={index}>
                                <CourseCard course={course} bgColor={pastelPalette[index % pastelPalette.length]}/>
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

export default TeacherHome;
