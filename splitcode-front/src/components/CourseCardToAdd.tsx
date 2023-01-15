import React, {useEffect} from "react";
import {Button, Card, CardContent, Typography} from "@mui/material";
import Course from "../models/Course";
import APIFetcher from "../networking/APIFetcher.js";
import {useNavigate} from "react-router-dom";

function CourseCardToAdd(props: { course: Course, bgColor: string }) {
    const navigate = useNavigate();
    const [sameCourse, setSameCourse] = React.useState(false);

    function addCourse(courseId: number) {
        APIFetcher.addCourse(courseId).then(() => navigate("/student"));
    }

    useEffect(() => {
        APIFetcher.getStudentCourses().then(response => {
            response.forEach(course => {
                if (course.id === props.course.id) {
                    setSameCourse(true);
                }
            })
        });
    }, []);

    return (
        <Card sx={{
            width: "20rem",
            height: "20rem",
            backgroundColor: props.bgColor,
            boxShadow: 5,
            ":hover": {boxShadow: 20}
        }}>
            <CardContent sx={{display: "flex", flexDirection: "column", height: "100%"}}>
                <Typography height={90} variant="h6" component="div" textAlign={"left"} sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical'
                }}>
                    {props.course.name}
                </Typography>
                <Typography sx={{mb: 3, mt: 1}} color="text.secondary" textAlign={"left"}>
                    {(props.course.semesterId === 1) ? "Spring" : "Fall"} | {props.course.ects} ECTS
                </Typography>
                <Typography variant="body2" textAlign={"justify"} sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '5',
                    WebkitBoxOrient: 'vertical'
                }}>
                    {props.course.description}
                </Typography>
                {sameCourse ?
                    <Button sx={{mt: "auto"}} variant="contained" disabled={true}>
                        Already added
                    </Button>
                    :
                    <Button sx={{mt: "auto"}} variant="contained" color="success"
                            onClick={() => addCourse(props.course.id!!)}>
                        Add
                    </Button>
                }
            </CardContent>
        </Card>
    )
}

export default CourseCardToAdd
