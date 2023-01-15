import React, {useEffect} from "react";
import {Box, CircularProgress, Divider, Grid, Menu, MenuItem, Paper, Stack, Typography} from "@mui/material";
import Course from "../../models/Course";
import {useNavigate, useParams} from "react-router-dom";
import APIFetcher from "../../networking/APIFetcher.js";
import IconButton from "@mui/material/IconButton";
import MoreIcon from '@mui/icons-material/MoreVert';
import ExerciseCard from "../../components/ExerciseCard";

function StudentCourses() {
    const params = useParams();
    const navigate = useNavigate();

    const [moreMenuAnchor, setMoreMenuAnchor] = React.useState<null | HTMLElement>(null);
    const open = Boolean(moreMenuAnchor);
    const [course, setCourse] = React.useState<Course | null>(null);

    useEffect(() => {
        let courseId = params.courseId
        if (courseId) {
            APIFetcher.getCourse(parseInt(courseId)).then(setCourse);
        }
    }, []);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        setMoreMenuAnchor(event.currentTarget);
    }

    function handleClose() {
        setMoreMenuAnchor(null);
    }

    function handleUnsubscribe() {
        setMoreMenuAnchor(null);
        APIFetcher.removeCourse(course!.id!!).then(() => navigate("/student"));
    }

    return (
        <Paper sx={{margin: 4, padding: 2}}>
            <Stack className={"p-5"} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                <Typography variant={"h4"}>
                    {course ? course.name : "Loading"}
                </Typography>
                <span className={"px-4 py-2 text-3xl order-1"}>
                        <IconButton
                            size="large"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            edge="end"
                            color="inherit"
                            onClick={handleClick}
                        >
                            <MoreIcon/>
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={moreMenuAnchor}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleUnsubscribe}>Unsubscribe</MenuItem>
                        </Menu>
                    </span>
            </Stack>
            <Divider/>
            {course ? (
                <Box sx={{margin: 10}}>
                    <Grid container rowSpacing={10}>
                        {course.exercises.map((exercise, index) => (
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={index}>
                                <ExerciseCard exercise={exercise} attempts={exercise.attempts!}/>
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

export default StudentCourses;
