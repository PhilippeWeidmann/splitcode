import React, {useContext} from "react";
import Course from "../models/Course";
import {ButtonBase, Card, CardContent, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {AppStateContext} from "../App";

function CourseCard(props: { course: Course, bgColor: string }) {
    const navigate = useNavigate();
    const appState = useContext(AppStateContext);

    return (
        <Card sx={{
            width: "20rem",
            height: "20rem",
            backgroundColor: props.bgColor,
            boxShadow: 5,
            ":hover": {boxShadow: 20}
        }}>
            <ButtonBase onClick={() => {
                if (appState.value.user!.role === "teacher") {
                    navigate(`/teacher/courses/${props.course.id}`)
                } else {
                    navigate(`/student/courses/${props.course.id}`)
                }
            }}>
                <CardContent sx={{
                    width: 300,
                }}>
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
                </CardContent>
            </ButtonBase>
        </Card>
    );
}


export default CourseCard;
