import React, {useState} from 'react';
import DateTimePicker from "react-datetime-picker";
import Exercise from "../../models/Exercise";
import {useNavigate, useParams} from "react-router-dom";
import APIFetcher from "../../networking/APIFetcher.js";
import EditorPanel from "../../components/codeEditor/EditorPanel";
import {Box, Button, Typography} from "@mui/material";
import ConceptsList from "../../components/ConceptsList";
import Concept from "../../models/Concept";
import moment from "moment";

function TeacherCreateExercise() {
    const [fromValue, fromOnChange] = useState(new Date());
    const [soloEndTime, setSoloEndTime] = useState(new Date());
    const [toValue, toOnChange] = useState(new Date());
    const [exerciseTitle, setExerciseTitle] = useState('');
    const [exerciseDescription, setExerciseDescription] = useState('');
    const [exerciseNotation, setExerciseNotation] = useState('1');
    const [sending, setSending] = useState(false);
    const [sandboxContent, setSandboxContent] = useState('');
    const [concepts, setConcepts] = useState<string[]>([]);

    let {courseId} = useParams();
    const navigate = useNavigate();


    function createExercise(event: any) {
        event.preventDefault();
        setSending(true);
        const exercise = new Exercise(exerciseTitle,
            exerciseDescription,
            "",
            moment(fromValue).format(),
            moment(soloEndTime).format(),
            moment(toValue).format(),
            parseInt(courseId as string), parseInt(exerciseNotation), undefined, sandboxContent);
        APIFetcher.createExercise(exercise, parseInt(courseId as string)).then((res) => {
            let conceptsToAdd: Concept[] = [];
            concepts.forEach(concept => {
                conceptsToAdd.push(new Concept(concept, res.id));
            });
            console.log(conceptsToAdd);
            APIFetcher.addConceptsToExercise(parseInt(courseId as string), res.id, conceptsToAdd).then(() => {
                setSending(false)
                navigate('/teacher/courses/' + courseId);
            });
        }).catch(() => {
            setSending(false)
        });
    }

    function saveSandbox(content: string) {
        setSandboxContent(content);
    }

    const getConcepts = (concepts: string[]) => {
        setConcepts(concepts);
    }


    return (
        <div className={"container mx-auto"}>
            <h1 className={"text-5xl my-5"}>Create Exercise</h1>
            <div className={"bg-white p-5 rounded-3xl"}>
                <form className="mb-6">
                    <div className="mb-6">
                        <label htmlFor="title"
                               className="block mb-2 text-xl font-medium ">Title</label>
                        <input type="text" id="title-input"
                               className="border border-gray-300  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                               value={exerciseTitle} onChange={(e) => setExerciseTitle(e.target.value)}/>
                    </div>
                    <div className={"mb-6"}>
                        <label htmlFor="description"
                               className="block mb-2 text-xl font-medium ">Instructions</label>
                        <textarea id="description-input"
                                  className="block p-2.5 w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 h-40"
                                  placeholder="..." value={exerciseDescription}
                                  onChange={(e) => setExerciseDescription(e.target.value)}/>
                    </div>
                    <div className={"mb-6"} style={{
                        width: '100%',
                        height: "300pt",
                        marginBottom: "40pt",
                        marginTop: "20pt"
                    }}>
                        <label htmlFor="result"
                               className="block mb-2 text-xl font-medium ">Code</label>
                        <EditorPanel
                            canBeInsert={true}
                            isEditable={true}
                            onContentChange={saveSandbox}
                            defaultValue={''}/>
                    </div>
                    <Box display={"flex"} justifyContent={"space-evenly"}>
                        <div>
                            <label htmlFor="date"
                                   className="block mb-2 text-xl font-medium ">Opening date</label>
                            <DateTimePicker onChange={fromOnChange} value={fromValue} format={"dd-MM-y HH:mm"}
                                            locale={"fr-FR"}/>
                        </div>
                        <div>
                            <label htmlFor="date"
                                   className="block mb-2 text-xl font-medium ">Closing solo attempts date</label>
                            <DateTimePicker onChange={setSoloEndTime}
                                            value={soloEndTime}
                                            format={"dd-MM-y HH:mm"}
                                            minDate={fromValue}
                                            locale={"fr-FR"}/>
                        </div>
                        <div>
                            <label htmlFor="date"
                                   className="block mb-2 text-xl font-medium ">Closing group attempts date</label>
                            <DateTimePicker onChange={toOnChange} value={toValue} format={"dd-MM-y HH:mm"}
                                            minDate={soloEndTime} locale={"fr-FR"}/>
                        </div>
                        <div>
                            <label htmlFor="notations"
                                   className="block mb-2 text-xl font-medium ">Notation</label>
                            <select id="notations-input"
                                    className="border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5"
                                    value={exerciseNotation} onChange={(e) => setExerciseNotation(e.target.value)}>
                                <option value="1">1-6</option>
                                <option value="2">acquis/non-acquis</option>
                                <option value="0">aucune</option>
                            </select>
                        </div>
                    </Box>
                    <Box sx={{marginTop: 4}}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            Concepts used by the students in this exercise
                        </Typography>
                        <ConceptsList getConcepts={getConcepts}/>
                    </Box>
                    <Box display={"flex"} alignItems={"flex-end"} justifyContent={"end"}>
                        <Button
                            variant="contained"
                            color="success"
                            size={"large"}
                            disabled={sending}
                            onClick={(e) => createExercise(e)}>
                            Create
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    )
}


export default TeacherCreateExercise;
