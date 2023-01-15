import React from 'react';
import Question from "../models/Question";
import {Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from "@mui/material";

function QuestionElement(props: { question: Question, sendAnswer: (answer: string, id: number) => void }) {
    const [answer, setAnswer] = React.useState("");

    const handleChange = (ev: any) => {
        setAnswer(ev.target.value);
        props.sendAnswer(ev.target.value, props.question.id);
    };

    return (
        <FormControl>
            <FormLabel>{props.question.question}</FormLabel>
            <RadioGroup row={true} onChange={handleChange}>
                <Box sx={{display: "flex", justifyContent: "space-evenly"}}>
                    <FormControlLabel value={"0"} labelPlacement={"top"} control={<Radio/>}
                                      label={"Totally disagree (1)"}/>
                    <FormControlLabel value={"1"} labelPlacement={"top"} control={<Radio/>} label={"2"}/>
                    <FormControlLabel value={"2"} labelPlacement={"top"} control={<Radio/>} label={"3"}/>
                    <FormControlLabel value={"3"} labelPlacement={"top"} control={<Radio/>} label={"4"}/>
                    <FormControlLabel value={"4"} labelPlacement={"top"} control={<Radio/>}
                                      label={"Totally agree (5)"}/>
                </Box>
            </RadioGroup>
        </FormControl>
    )
}

export default QuestionElement
