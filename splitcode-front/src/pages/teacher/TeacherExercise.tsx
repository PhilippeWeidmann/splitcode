import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    CircularProgress,
    Container,
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
    Divider,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import APIFetcher from "../../networking/APIFetcher.js";
import {useNavigate, useParams} from "react-router-dom";
import Exercise from "../../models/Exercise";
import Concept from "../../models/Concept";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {Doughnut} from "react-chartjs-2";
import Sandbox from "../../models/Sandbox";
import {getTrueGrade} from "../../utils/GradesUtils";
import {teacherdoughnutOptions, teacherLinesGraphOptions} from "../../utils/GraphsUtils";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import bellCurve from "highcharts/modules/histogram-bellcurve";
import IconButton from "@mui/material/IconButton";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import ResultsList from "../../components/ResultsList";
import Attempt from "../../models/Attempt";
import GroupAttempt from "../../models/GroupAttempt";

bellCurve(Highcharts);

function TeacherExercise() {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [concepts, setConcepts] = useState<Concept[]>([]);
    const [singleSandboxes, setSingleSandboxes] = useState<Sandbox[]>([]);
    const [groupSandboxes, setGroupSandboxes] = useState<Sandbox[]>([]);

    const [conceptsDataset, setConceptsDataset] = useState<any | null>(null);
    const [groupConceptsDataset, setGroupConceptsDataset] = useState<any | null>(null);
    const [doughnutDataset, setDoughnutDataset] = useState<any | null>(null);
    const [linesDataset, setLinesDataset] = useState<any | null>(null);
    const [linesGroupsDataset, setLinesGroupsDataset] = useState<any | null>(null);
    const [graphDataset, setGraphDataset] = useState<any | null>(null);
    const [groupGraphDataset, setGroupGraphDataset] = useState<any | null>(null);
    const [timeDataset, setTimeDataset] = useState<number[]>([]);
    const [groupTimeDataset, setGroupTimeDataset] = useState<number[]>([]);

    const [isBellCurve, setIsBellCurve] = useState<boolean>(true);
    const [selectedGraph, setSelectedGraph] = useState<string>("");
    const [selectedConcept, setSelectedConcept] = useState<string>("");

    const [showStudentsDialog, setShowStudentsDialog] = useState<boolean>(false);
    const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
    const [selectedStudents, setSelectedStudents] = useState<{ attempt: Attempt | GroupAttempt, sandbox: Sandbox }[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");

    const {exerciseId} = useParams();
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
    const navigate = useNavigate();

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        Filler
    );

    const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
        setShowStudentsDialog(true);
        setScroll(scrollType);
    };

    const handleClose = () => {
        setShowStudentsDialog(false);
    };

    useEffect(() => {
        APIFetcher.getTeacherExercise(parseInt(exerciseId as string)).then(exercise => {
            setExercise(exercise);
            let doughnutData = [0, 0, 0]
            exercise.attempts?.forEach(attempt => {
                let passed = getTrueGrade(attempt.attemptResult?.type, attempt.attemptResult?.result).pass;
                if (passed === 0) {
                    doughnutData[0] = doughnutData[0] + 1;
                } else if (passed === 1) {
                    doughnutData[1] = doughnutData[1] + 1;
                } else {
                    doughnutData[2] = doughnutData[2] + 1;
                }
            });
            setDoughnutDataset({
                labels: ['Passed', 'Failed', "Not graded"],
                maintainAspectRatio: true,
                responsive: true,
                datasets: [{
                    data: doughnutData,
                    borderWidth: 1,
                    backgroundColor: [
                        'rgba(55,199,75,0.8)',
                        'rgba(211,16,56,0.69)',
                        'rgba(239,181,46,0.75)'
                    ]
                }]
            });
            APIFetcher.getExerciseConcepts(parseInt(exerciseId as string)).then(resConcepts => {
                setConcepts(resConcepts);
                APIFetcher.getAllSingleSandboxesForExercise(parseInt(exerciseId as string)).then(sandboxes => {
                    setSingleSandboxes(sandboxes);
                    let linesWrittenSingle = getLinesWritten(sandboxes);
                    setLinesDataset(linesWrittenSingle)
                    setTimeDataset(getTimeSpent(exercise, true));
                    APIFetcher.getAllGroupSandboxesForExercise(parseInt(exerciseId as string)).then(sandboxes => {
                        let groupSandboxes: Sandbox[] = [];
                        exercise.groupAttempts?.forEach(attempt => {
                            sandboxes.forEach(sandbox => {
                                if (attempt.sharedSandboxId === sandbox.id) {
                                    groupSandboxes.push(sandbox);
                                }
                            })
                        });
                        setGroupSandboxes(groupSandboxes);
                        let linesWrittenGroup = getLinesWritten(groupSandboxes);
                        setLinesGroupsDataset(linesWrittenGroup)
                        setGroupTimeDataset(getTimeSpent(exercise, false));
                    });
                });
            });
        });
    }, []);


    const handleSelectGraph = (event: SelectChangeEvent) => {
        setSelectedGraph(event.target.value);
        switch (event.target.value) {
            case "0":
                setGraphDataset(linesDataset);
                setGroupGraphDataset(linesGroupsDataset);
                break;
            case "1":
                setGraphDataset(conceptsDataset);
                setGroupGraphDataset(groupConceptsDataset);
                break;
            case "2":
                setGraphDataset(timeDataset);
                setGroupGraphDataset(groupTimeDataset);
                break;
        }
    }
    const handleSelectConcept = (event: SelectChangeEvent) => {
        setSelectedConcept(event.target.value);
        let concept = concepts.find(concept => concept.concept === event.target.value);
        setConceptsDataset(getUsedConcepts(singleSandboxes, concept?.concept))
        setGroupConceptsDataset(getUsedConcepts(groupSandboxes, concept?.concept))
        setGraphDataset(getUsedConcepts(singleSandboxes, concept?.concept));
        setGroupGraphDataset(getUsedConcepts(groupSandboxes, concept?.concept));
    }

    function displayGraph() {
        if (selectedGraph.length > 0) {
            return <Box sx={{width: "100%", borderWidth: 1}}>
                <Box sx={{
                    display: "flex",
                    flex: 1,
                    width: "100%",
                    justifyContent: "space-between"
                }}>
                    <IconButton sx={{m: 1}} onClick={() => {
                        setIsBellCurve(!isBellCurve);
                    }}>
                        <LeaderboardIcon/>
                    </IconButton>
                    {selectedGraph === "1" ? (<FormControl sx={{minWidth: "20%"}}>
                        <InputLabel id="concept-select-label">Concept</InputLabel>
                        <Select
                            labelId="concept-select-label"
                            id="concept-select"
                            value={selectedConcept}
                            label="Concept"
                            onChange={handleSelectConcept}
                        >
                            {concepts.map(concept => {
                                return <MenuItem value={concept.concept}
                                                 key={concept.concept}>{concept.concept}</MenuItem>
                            })}
                        </Select>
                    </FormControl>) : null}
                </Box>
                {selectedGraph === "1" && selectedConcept.length === 0 ? (
                    <Box sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <Typography sx={{textAlign: "center"}}>Please select a concept</Typography>
                    </Box>
                ) : (
                    <HighchartsReact
                        constructorType={"chart"}
                        highcharts={Highcharts}
                        options={teacherLinesGraphOptions(graphDataset, groupGraphDataset, isBellCurve ? "bellcurve" : "histogram", selectedGraph, getStudentsDialog).config}
                        ref={chartComponentRef}
                    />
                )}
            </Box>
        } else {
            return <Box sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}>
                <Typography sx={{textAlign: "center"}}>Please select a graph</Typography>
            </Box>
        }
    }

    if (exercise) {
        return (
            <Container component={Paper} maxWidth={"xl"} sx={{marginTop: 4, p: 3}}>
                <Typography variant={"h4"}>{exercise.title}</Typography>
                <Typography variant={"caption"}>{exercise.course?.name}</Typography>
                <Dialog open={showStudentsDialog} onClose={handleClose} scroll={scroll}>
                    <DialogTitle>Students</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                        <List>
                            {selectedStudents.map(student => {
                                return selectedType.includes("Solo") ? (
                                        <ListItem key={student.sandbox.id}>
                                            <ListItemButton>
                                                <ListItemText primary={(student.attempt as Attempt).user?.name}
                                                              onClick={() => navigate(`/teacher/exercise/${exercise?.id}/attempt/${student.attempt.id}/solo/sandbox`)}/>
                                            </ListItemButton>
                                        </ListItem>
                                    ) :
                                    (
                                        <ListItem key={student.sandbox.id}>
                                            <ListItemButton>
                                                <ListItemText
                                                    primary={(student.attempt as GroupAttempt).firstUser?.name + " & " + (student.attempt as GroupAttempt).secondUser?.name}
                                                    onClick={() => navigate(`/teacher/exercise/${exercise?.id}/attempt/${student.attempt.id}/group/sandbox`)}/>
                                            </ListItemButton>
                                        </ListItem>
                                    )

                            })}
                        </List>
                    </DialogContent>
                </Dialog>
                <Box sx={{marginTop: 4}} justifyContent={"center"} alignContent={"center"}
                     alignItems={"center"}>
                    <Typography variant={"body1"}>{exercise.description}</Typography>
                    <Divider sx={{my: 3}}/>
                    <Typography variant={"h5"}>General statistics</Typography>
                    <Box display={"flex"} sx={{marginTop: 4, marginBottom: 5, height: "55vh"}}>
                        <Box sx={{width: "50%", height: "100%"}}>
                            <Stack sx={{height: "100%"}}>
                                <Box sx={{minWidth: "10vw", mx: "auto", my: 1}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="graph-select-label">Graph</InputLabel>
                                        <Select
                                            labelId="graph-select-label"
                                            id="graph-select"
                                            value={selectedGraph}
                                            label="Graph"
                                            onChange={handleSelectGraph}
                                        >
                                            <MenuItem value={"0"}>Lines</MenuItem>
                                            <MenuItem value={"1"}>Concepts</MenuItem>
                                            <MenuItem value={"2"}>Time</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{height: "100%"}}>
                                    {linesDataset && linesGroupsDataset ?
                                        displayGraph()
                                        : <Box sx={{
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            <CircularProgress/>
                                        </Box>}
                                </Box>
                            </Stack>
                        </Box>
                        <Box sx={{margin: "auto"}}>
                            {doughnutDataset ?
                                <Doughnut data={doughnutDataset}
                                          options={teacherdoughnutOptions as any}/> :
                                <CircularProgress/>}
                        </Box>
                    </Box>
                </Box>
                <Typography variant={"h5"} sx={{marginTop: 3, marginBottom: 1}}>Results</Typography>
                <ResultsList exercise={exercise}
                             soloWarnings={getAbnormalNumberOfLines(singleSandboxes, true)}
                             groupWarnings={getAbnormalNumberOfLines(groupSandboxes, false)}/>
            </Container>
        )
    } else {
        return (
            <div className={"grid place-items-center h-screen"}>
                <CircularProgress/>
            </div>
        )
    }

    function getStudentsDialog(x: number, y: number, width: number, type: string, graph: string) {
        let sandboxes = type === "Solo attempts" ? singleSandboxes : groupSandboxes;
        let students: { attempt: Attempt | GroupAttempt, sandbox: Sandbox }[] = [];
        if (exercise) {
            if (type.includes("Solo")) {
                exercise.attempts!!.forEach(attempt => {
                    sandboxes.forEach(sandbox => {
                        if (sandbox.id === attempt.sandboxId) {
                            switch (graph) {
                                case "0":
                                    let lines = sandbox.content.split("\n").length;
                                    if (lines >= x && lines < x + width) {
                                        students.push({attempt: attempt, sandbox: sandbox})
                                    }
                                    break;
                                case "1":
                                    let count = sandbox.content.split(selectedConcept).length - 1;
                                    if (count >= x && count < x + width) {
                                        students.push({attempt: attempt, sandbox: sandbox})
                                    }
                                    break;
                                case "2":
                                    let time = sandbox.attempt.timeSpentInSeconds / 60;
                                    if (time >= x && time < x + width) {
                                        students.push({attempt: attempt, sandbox: sandbox})
                                    }
                                    break;
                            }
                        }
                    });
                })
            } else {
                exercise.groupAttempts!!.filter(attempt => {
                    sandboxes.forEach(sandbox => {
                        if (sandbox.id === attempt.sharedSandboxId) {
                            switch (graph) {
                                case "0":
                                    let lines = sandbox.content.split("\n").length;
                                    if (lines >= x && lines < x + width) {
                                        students.push({attempt: attempt, sandbox: sandbox})
                                    }
                                    break;
                                case "1":
                                    let count = sandbox.content.split(selectedConcept).length - 1;
                                    if (count >= x && count < x + width) {
                                        students.push({attempt: attempt, sandbox: sandbox})
                                    }
                                    break;
                                case "2":
                                    let time = sandbox.attempt.timeSpentInSeconds / 60;
                                    if (time >= x && time < x + width) {
                                        students.push({attempt: attempt, sandbox: sandbox})
                                    }
                                    break;
                            }
                        }
                    });
                })
            }
        }
        setSelectedType(type);
        setSelectedStudents(students);
        setShowStudentsDialog(true);
    }

    function getUsedConcepts(sandboxes: Sandbox[], concept?: string) {
        let conceptCount: number[] = [];
        if (concept !== undefined) {
            sandboxes.forEach(sandbox => {
                let count = sandbox.content.split(concept).length - 1;
                conceptCount.push(count);
            });
        }

        return conceptCount;
    }

    function getLinesWritten(sandboxes: Sandbox[]) {
        let linesWritten: number[] = [];
        sandboxes.forEach(sandbox => {
            let lines = sandbox.content.split("\n").length;
            linesWritten.push(lines);
        });
        return linesWritten;
    }

    function getTimeSpent(exercise: Exercise, solo: boolean) {
        let timeSpent: number[] = [];
        if (solo) {
            exercise.attempts!!.forEach(attempt => {
                timeSpent.push(attempt.timeSpentInSeconds / 60);
            });
        } else {
            exercise.groupAttempts!!.forEach(attempt => {
                timeSpent.push(((attempt.timeSpentInSecondsFirstUser / 60) + (attempt.timeSpentInSecondsSecondUser / 60)) / 2);
            });
        }
        return timeSpent;
    }

    function getAbnormalNumberOfLines(sandboxes: Sandbox[], solo: boolean) {
        let results: { id: number; chips: number[]; }[] = [];
        let allLines = getLinesWritten(sandboxes)
        let averageLines = getAverage(allLines);
        let standardDeviation = getStandardDeviation(allLines);
        sandboxes.forEach(sandbox => {
            let currentLines = sandbox.content.split("\n").length;
            if (currentLines > averageLines + (1.5 * standardDeviation) || currentLines < averageLines - (1.5 * standardDeviation)) {
                let result = {
                    id: sandbox.id,
                    chips: [1]
                }
                results.push(result);
            }
        });
        return getAbnormalNumberOfConcepts(sandboxes, solo, results);
    }

    function getAbnormalNumberOfConcepts(sandboxes: Sandbox[], solo: boolean,
                                         results: { id: number; chips: number[]; }[]) {
        sandboxes.forEach(sandbox => {
            concepts.forEach(concept => {
                let averageConcept = getAverage(getUsedConcepts(sandboxes, concept.concept));
                let count = 0;
                if (sandbox.content.includes(concept.concept)) {
                    count = (sandbox.content.match(new RegExp(concept.concept, "g")) || []).length;
                    if (count > averageConcept + 2 || count < averageConcept - 2) {
                        results.forEach(result => {
                            if (result.id === sandbox.id) {
                                result.chips.push(2);
                            }
                        });
                    }
                }
            });
        });
        return getAbnormalTime(sandboxes, solo, results);
    }

    function getAbnormalTime(sandboxes: Sandbox[], solo: boolean, results: { id: number; chips: number[]; }[]) {
        let averageTime = getAverage(getTimeSpent(exercise!!, solo));
        let standardDeviation = getStandardDeviation(getTimeSpent(exercise!!, solo));
        if (solo) {
            exercise!!.attempts!!.forEach(attempt => {
                let time = attempt.timeSpentInSeconds / 60;
                if (time > averageTime + (1.5 * standardDeviation) || time < averageTime - (1.5 * standardDeviation)) {
                    results.forEach(result => {
                        if (result.id === attempt.sandboxId) {
                            result.chips.push(3);
                        }
                    });
                }
            });
        } else {
            exercise!!.groupAttempts!!.forEach(attempt => {
                let time = ((attempt.timeSpentInSecondsFirstUser / 60) + (attempt.timeSpentInSecondsSecondUser / 60)) / 2;
                if (time > averageTime + (1.5 * standardDeviation) || time < averageTime - (1.5 * standardDeviation)) {
                    results.forEach(result => {
                        if (result.id === attempt.sharedSandboxId) {
                            result.chips.push(3);
                        }
                    });
                }
            });
        }
        return results;
    }


    function getAverage(lines: number[]) {
        let sum = 0;
        lines.forEach(line => {
            sum += line;
        });
        return sum / lines.length;
    }

    function getStandardDeviation(array: number[]) {
        const n = array.length
        if (n > 0) {
            const mean = array.reduce((a, b) => a + b) / n
            return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
        } else {
            return 0;
        }
    }
}

export default TeacherExercise;
