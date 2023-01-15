import React, {useContext, useState} from 'react';
import {
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import APIFetcher from "../../networking/APIFetcher.js";
import {useNavigate} from "react-router-dom";
import Course from '../../models/Course';
import {AppStateContext} from "../../App";

function TeacherCreateCourse() {
    const [sending, setSending] = useState(false);
    const [courseName, setCourseName] = useState("");
    const [courseDescription, setCourseDescription] = useState("");
    const [category, setCategory] = useState(0);
    const [semester, setSemester] = useState(0);
    const [ects, setEcts] = useState(0);
    const navigate = useNavigate();
    let appState = useContext(AppStateContext);


    function createCourse(event: any) {
        event.preventDefault();
        setSending(true);
        const course = new Course(courseName, courseDescription, appState.value.user!!.id, semester, ects);
        APIFetcher.createCourse(course).then(() => {
            navigate('/teacher');
            setSending(false)
        }).catch(() => {
            setSending(false)
        });
    }

    return (
        <Container maxWidth={"xl"} component={Paper} sx={{marginTop: 4, p: 3}}>
            <Typography variant={"h4"}>Create course</Typography>
            <Grid container spacing={{xs: 2, md: 3}} columns={{xs: 4, sm: 8, md: 12}} rowSpacing={3}
                  sx={{marginTop: 4}}>
                <Grid item xs={5} style={{flexGrow: 1}}>
                    <TextField id="name-basic" label="Name" variant="outlined"
                               fullWidth={true}
                               onChange={(e) => setCourseName(e.target.value)}/>
                </Grid>
                <Grid item xs={3}>
                    <FormControl fullWidth={true}>
                        <InputLabel id="demo-simple-select-label">Semestre</InputLabel>
                        <Select
                            labelId="semestre-select-label"
                            id="semestre-select"
                            label="Semestre"
                            defaultValue={0}
                            onChange={(e) => setSemester(e.target.value as number)}
                        >
                            <MenuItem value={0}>Printemps</MenuItem>
                            <MenuItem value={1}>Automne</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        id="outlined-ects"
                        label="ECTS"
                        fullWidth={true}
                        type="number"
                        onChange={(e) => setEcts(e.target.value as any)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="outlined-multiline-static"
                        label="Description"
                        multiline={true}
                        rows={4}
                        fullWidth={true}
                        onChange={(e) => setCourseDescription(e.target.value)}/>
                </Grid>
                <Grid item>
                    <Button variant="outlined" color={"success"} sx={{marginTop: 4}}
                            disabled={sending}
                            onClick={(e) => createCourse(e)}>
                        Create
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}

export default TeacherCreateCourse;
