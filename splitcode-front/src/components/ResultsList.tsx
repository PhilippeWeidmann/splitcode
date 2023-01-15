import React, {useEffect} from 'react';
import Exercise from "../models/Exercise";
import {useNavigate} from "react-router-dom";
import {getTrueGrade} from "../utils/GradesUtils";
import {DataGrid, GridColDef, GridEventListener, useGridApiRef} from '@mui/x-data-grid';
import {Box, Chip, darken, lighten, Tooltip} from "@mui/material";
import {readableDate} from "../utils/DatesUtils";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import ChangeGradeDialog from "./ChangeGradeDialog";
import Attempt from "../models/Attempt";
import GroupAttempt from "../models/GroupAttempt";
import APIFetcher from "../networking/APIFetcher.js";

function ResultsList(props: { exercise: Exercise, soloWarnings: { id: number; chips: number[]; }[], groupWarnings: { id: number; chips: number[]; }[] }) {
    const [solo, setSolo] = React.useState(0);
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const [rows, setRows] = React.useState<any[]>([]);
    const [filteredRows, setFilteredRows] = React.useState<any[]>([]);
    const [filter1, setFilter1] = React.useState<boolean>(false);
    const [filter2, setFilter2] = React.useState<boolean>(false);
    const [filter3, setFilter3] = React.useState<boolean>(false);
    const [filterChipIcon1, setFilterChipIcon1] = React.useState<JSX.Element>(<FilterListOffIcon/>);
    const [filterChipIcon2, setFilterChipIcon2] = React.useState<JSX.Element>(<FilterListOffIcon/>);
    const [filterChipIcon3, setFilterChipIcon3] = React.useState<JSX.Element>(<FilterListOffIcon/>);
    const [dialogData, setDialogData] = React.useState<any>(null);

    useEffect(() => {
        let tempRows: any[];
        if (solo === 0) {
            tempRows = props.exercise.attempts!!.map((attempt) => {
                let chips: number[] = [];
                props.soloWarnings.forEach((warning) => {
                    if (warning.id === attempt.sandboxId) {
                        chips = warning.chips;
                    }
                });
                return {
                    id: attempt.id,
                    student: attempt.user!!.name,
                    submissiondate: readableDate(new Date(attempt.completedAt).getTime()),
                    grade: getTrueGrade(attempt.attemptResult?.type, attempt.attemptResult?.result).grade,
                    status: getTrueGrade(attempt.attemptResult?.type, attempt.attemptResult?.result).gradeType,
                    attempt: attempt,
                    warnings: chips
                }
            });
        } else {
            tempRows = props.exercise.groupAttempts!!.map((attempt) => {
                let chips: number[] = [];
                props.soloWarnings.forEach((warning) => {
                    if (warning.id === attempt.sharedSandboxId) {
                        chips = warning.chips;
                    }
                });
                return {
                    id: attempt.id,
                    student: attempt.firstUser?.name + " & " + attempt.secondUser?.name,
                    submissiondate: readableDate(new Date(attempt.completedAt).getTime()),
                    grade: getTrueGrade(attempt.attemptResult?.type, attempt.attemptResult?.result).grade,
                    status: getTrueGrade(attempt.attemptResult?.type, attempt.attemptResult?.result).gradeType,
                    attempt: attempt,
                    warnings: chips
                }
            });
        }
        setRows(tempRows);
        setFilteredRows(tempRows);
    }, [props.exercise.attempts, props.exercise.groupAttempts, props.soloWarnings, solo])

    useEffect(() => {

    }, []);

    const columns: GridColDef[] = [
        {
            field: 'student',
            headerName: 'Student',
            width: 300,
            editable: false,
        },
        {
            field: 'submissiondate',
            headerName: 'Submission date',
            width: 300,
            editable: false,
        },
        {
            field: 'warnings',
            headerName: 'Warnings',
            width: 400,
            renderCell: (params) => <ul>{getChips(params.value)!!}</ul>,
            editable: false,
        },
        {
            field: 'grade',
            headerName: 'Grade',
            width: 300,
            editable: false,
        }
    ]
    const handleClick: GridEventListener<'rowClick'> = (params) => {
        setDialogData({open: true, exercise: props.exercise, attempt: params.row.attempt, solo: solo === 0});
    };
    const displayDialog = () => {
        if (dialogData != null) {
            return <ChangeGradeDialog onClose={handleDialogClose} data={dialogData} onSave={onChangeGrade}/>
        }
    }
    const getBackgroundColor = (color: string, mode: string) =>
        mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

    const getHoverBackgroundColor = (color: string, mode: string) =>
        mode === 'dark' ? darken(color, 0.55) : lighten(color, 0.55);

    function getChips(chips: number[]) {
        let chipList: JSX.Element[] = [];
        chips.map((chip) => {
            let color = getChipName(chip).color;
            let tooltip = getChipName(chip).tooltip
            let label = getChipName(chip).name
            chipList.push(<Tooltip key={label} title={tooltip}><Chip sx={{mx: 1}} label={label}
                                                                     color={color as "error"}/></Tooltip>)
        });
        return chipList;
    }

    function getChipName(chip: number) {
        switch (chip) {
            case 1:
                return {name: "Lines", color: "secondary", tooltip: "Abnormal number of lines"};
            case 2:
                return {name: "Concepts", color: "error", tooltip: "Abnormal use of concepts"};
            case 3:
                return {name: "Time", color: "warning", tooltip: "Abnormal amount of time taken"};
            default:
                return {name: "Warning 1", color: "info", tooltip: "This is a warning 1"};
        }
    }

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setSolo(newValue);
    };

    function tabNavProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleChipClick = (event: { currentTarget: { id: any; }; }) => {
        switch (event.currentTarget.id) {
            case "1":
                if (filter1) {
                    setFilterChipIcon1(<FilterListOffIcon/>);
                    setFilter1(false);
                    setFilteredRows(rows);
                } else {
                    setFilterChipIcon1(<FilterListIcon/>);
                    setFilter1(true);
                    setFilteredRows(rows.filter((row) => row.warnings.includes(1)));
                }
                break;
            case "2":
                if (filter2) {
                    setFilterChipIcon2(<FilterListOffIcon/>);
                    setFilter2(false);
                    setFilteredRows(rows);
                } else {
                    setFilterChipIcon2(<FilterListIcon/>);
                    setFilter2(true);
                    setFilteredRows(rows.filter((row) => row.warnings.includes(2)));
                }
                break;
            case "3":
                if (filter3) {
                    setFilterChipIcon3(<FilterListOffIcon/>);
                    setFilter3(false);
                    setFilteredRows(rows);
                } else {
                    setFilterChipIcon3(<FilterListIcon/>);
                    setFilter3(true);
                    setFilteredRows(rows.filter((row) => row.warnings.includes(3)));
                }
                break;
        }
    };

    const handleDialogClose = () => {
        setDialogData({open: false, exercise: props.exercise, attempt: null, solo: solo === 0});
    }

    function onChangeGrade(grade: string, attempt: Attempt | GroupAttempt, solo: boolean) {
        APIFetcher.updateGrade(attempt.attemptResult!!.id, Number(grade)).then((response) => {
            rows.forEach((row) => {
                if (row.attempt.id === attempt.id) {
                    row.attempt.attemptResult = response;
                    row.grade = getTrueGrade(response.type, response.result).grade
                    row.status = getTrueGrade(response.type, response.result).gradeType
                }
            });
            handleDialogClose();
        });
    }

    return (
        <Box>
            <Box display={"flex"}>
                {displayDialog()}
                <Tabs value={solo} onChange={handleChange}>
                    <Tab label="Solo attempts" {...tabNavProps(0)} />
                    <Tab label="Group attempts" {...tabNavProps(1)} />
                </Tabs>
                <Box display={"flex"} sx={{marginLeft: "auto"}}>
                    <Chip id={"1"} icon={filterChipIcon1} sx={{m: 1}} label={"Lines"} color={"secondary"}
                          onClick={handleChipClick}/>
                    <Chip id={"2"} icon={filterChipIcon2} sx={{m: 1}} label={"Concepts"} color={"error"}
                          onClick={handleChipClick}/>
                    <Chip id={"3"} icon={filterChipIcon3} sx={{m: 1}} label={"Time"} color={"warning"}
                          onClick={handleChipClick}/>
                </Box>
            </Box>
            <Box sx={{
                height: "50vh",
                width: '100%',
                '& .row1': {
                    bgcolor: (theme) =>
                        getBackgroundColor("#05a124", theme.palette.mode),
                    '&:hover': {
                        bgcolor: (theme) =>
                            getHoverBackgroundColor(
                                "#05a124",
                                theme.palette.mode,
                            ),
                    },
                },
                '& .row2': {
                    bgcolor: (theme) =>
                        getBackgroundColor("#d31010", theme.palette.mode),
                    '&:hover': {
                        bgcolor: (theme) =>
                            getHoverBackgroundColor(
                                "#d31010",
                                theme.palette.mode,
                            ),
                    },
                },
                '& .row0': {
                    bgcolor: (theme) =>
                        getBackgroundColor("#efb52e", theme.palette.mode),
                    '&:hover': {
                        bgcolor: (theme) =>
                            getHoverBackgroundColor(
                                "#efb52e",
                                theme.palette.mode,
                            ),
                    },
                },

            }}>
                <DataGrid columns={columns} rows={filteredRows} onRowClick={handleClick}
                          getRowClassName={(params) => "row" + params.row.status}/>
            </Box>
        </Box>

    )
}

export default ResultsList;
