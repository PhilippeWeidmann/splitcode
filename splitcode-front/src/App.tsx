import React, {createContext, useEffect, useState} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import StudentExerciseCollaborate from "./pages/student/StudentExerciseCollaborate";
import TeacherHome from "./pages/teacher/TeacherHome";
import TeacherCreateExercise from "./pages/teacher/TeacherCreateExercise";
import StudentExercise from "./pages/student/StudentExercise";
import MainAppBar from "./components/MainAppBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import APIFetcher from "./networking/APIFetcher.js";
import {CircularProgress, Snackbar} from "@mui/material";
import StudentCourses from "./pages/student/StudentCourses";
import StudentCourseHome from "./pages/student/StudentCourseHome";
import TeacherExercisesHome from "./pages/teacher/TeacherExercisesHome";
import User from "./models/User";
import StudentAddCourse from "./pages/student/StudentAddCourse";
import MainMenu from "./components/MainMenu";
import StudentSandbox from "./pages/student/StudentSandbox";
import TeacherExercise from "./pages/teacher/TeacherExercise";
import TeacherSandbox from "./pages/teacher/TeacherSandbox";
import TeacherCreateCourse from "./pages/teacher/TeacherCreateCourse";
import Logout from "./pages/Logout";
import {loader} from "@monaco-editor/react";
import StudentQuestions from "./pages/student/StudentQuestions";

interface IAppStateContext {
    value: AppState;
    replaceAppState: (title: string, drawerOpen: boolean, user?: User) => void;
    setTitle: (title: string) => void;
    setDrawerOpen: (open: boolean) => void;
    setUser: (user?: User) => void;
}

export type AppState = {
    title: string
    drawerOpen: boolean
    user?: User
}

const AppStateContext = createContext<IAppStateContext>({
    value: {title: "", drawerOpen: false}, replaceAppState: () => {
    }, setTitle: () => {
    }, setDrawerOpen: () => {
    }, setUser: () => {
    }
});

function App() {
    const [appState, setAppState] = useState<AppState>({title: "", drawerOpen: false});
    const [bootstrapping, setBootstrapping] = useState(true);
    const [debugError, setDebugError] = useState<Error | null>(null);

    useEffect(() => {
        initMonaco();
        // @ts-ignore
        window.onDebugError = function (error: Error) {
            setDebugError(error)
        }

        APIFetcher.getUser()
            .then((user) => {
                setUser(user)
                setBootstrapping(false)
            })
            .catch((error) => {
                if (error.status === 401) {
                    setUser(undefined)
                    setBootstrapping(false)
                }
                // TODO: display error
                console.log(error)
            })
    }, [])

    function initMonaco() {
        loader.init().then((monaco) => {
            monaco.languages.register({id: 'scala'});
            monaco.languages.registerHoverProvider('scala', {
                provideHover: function (model, position, token) {
                    let wordAtPosition = model.getWordAtPosition(position);
                    let hints = new Map<string, string[]>([
                        ["if", ["***if (condition) { ... }***",
                            "allows you to define a condition that will be checked before executing the following code block.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/control-structures.html#the-ifthenelse-construct"]],
                        ["else", ["***else { ... }***",
                            "allows you to define a code block that will be executed if the condition of the if statement is false.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/control-structures.html#the-ifthenelse-construct"]],
                        ["for", ["***for (var i <- Range) { ... }***",
                            "allows you to define a loop that will be executed a specific number of times.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/control-structures.html#for-loops"]],
                        ["while", ["***while (condition) { ... }***",
                            "allows you to define a loop that will be executed while the condition is true.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/taste-control-structures.html#while-loops"]],
                        ["def", ["***def myMethod() { ... }***",
                            "allows you to define a method that can be called later in the code.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/methods-most.html"]],
                        ["var", ["***var myVariable = 0***",
                            "allows you to define a variable that can be changed later in the code.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/taste-vars-data-types.html#inner-main"]],
                        ["val", ["***val myVariable = 0***",
                            "allows you to define a variable that cannot be changed later in the code.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/taste-vars-data-types.html#inner-main"]],
                        ["readLine", ["***readLine()***",
                            "allows you to read a line from the console.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/taste-hello-world.html#ask-for-user-input"]],
                        ["readDouble", ["***readDouble()***",
                            "allows you to read a double from the console.",
                            "for more informations please see https://dotty.epfl.ch/api/scala/io/StdIn$.html"]],
                        ["readInt", ["***readInt()***",
                            "allows you to read an integer from the console.",
                            "for more informations please see https://dotty.epfl.ch/api/scala/io/StdIn$.html"]],
                        ["print", ["***print(\"Hello World\")***",
                            "allows you to print a string to the console.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/taste-hello-world.html#ask-for-user-input"]],
                        ["println", ["***println(\"Hello World\")***",
                            "allows you to print a string to the console and add a new line.",
                            "for more informations please see https://docs.scala-lang.org/scala3/book/taste-hello-world.html#ask-for-user-input"]],
                    ])

                    let hint = hints.get(wordAtPosition?.word as string)
                    if (hint !== undefined) {
                        return {
                            range: new monaco.Range(
                                1,
                                1,
                                model.getLineCount(),
                                model.getLineMaxColumn(model.getLineCount())
                            ),
                            contents: [
                                {value: hint.at(0) as string},
                                {value: hint.at(1) as string},
                                {value: hint.at(2) as string}
                            ]
                        }
                    }
                }
            });
        });
    }

    function setUser(user?: User) {
        replaceAppState(appState.title, appState.drawerOpen, user)
    }

    function replaceAppState(title: string, drawerOpen: boolean, user?: User) {
        let newAppBarState = {title: title, drawerOpen: drawerOpen, user: user};
        setAppState(newAppBarState)
    }

    const debugSnack = (<Snackbar
        open={debugError != null}
        onClose={() => setDebugError(null)}
        autoHideDuration={6000}
        message={debugError?.message}
    />)

    function getHome() {
        if (appState.user === undefined) {
            return <Home/>
        } else if (appState.user.role === "teacher") {
            return <TeacherHome/>
        } else if (appState.user.role === "student") {
            return <StudentCourses/>
        }
    }

    function getAvailableRoutes() {
        if (appState.user === undefined) {
            return <Route path="/*" element={<Navigate to={"/"}/>}/>
        }

        return (
            <>
                <Route path="/student" element={<StudentCourses/>}/>
                <Route path="/student/courses/add" element={<StudentAddCourse/>}/>
                <Route path="/student/courses/:courseId" element={<StudentCourseHome/>}/>
                <Route path="/student/sandboxes/:sandboxId" element={<StudentSandbox/>}/>
                <Route path="/student/courses/:courseId/exercises/:exerciseId"
                       element={<StudentExercise/>}/>
                <Route path="/student/courses/:courseId/exercise/:exerciseId/groupattempts/:attemptId"
                       element={<StudentExerciseCollaborate/>}/>
                <Route path={"/student/exercise/:exerciseId/questions"}
                       element={<StudentQuestions/>}/>
                <Route path="/teacher" element={<TeacherHome/>}/>
                <Route path="/teacher/course/:courseId/exercise/create" element={<TeacherCreateExercise/>}/>
                <Route path="/teacher/courses/:courseId" element={<TeacherExercisesHome/>}/>
                <Route path="/teacher/course/:courseId/exercise/:exerciseId" element={<TeacherExercise/>}/>
                <Route path="/teacher/exercise/:exerciseId/attempt/:attemptId/solo/sandbox"
                       element={<TeacherSandbox solo={true}/>}/>
                <Route path="/teacher/exercise/:exerciseId/attempt/:attemptId/group/sandbox"
                       element={<TeacherSandbox solo={false}/>}/>
                <Route path={"/teacher/course/create"} element={<TeacherCreateCourse/>}/>
            </>)
    }

    return (
        <>
            <AppStateContext.Provider value={{
                value: appState, replaceAppState: replaceAppState, setTitle: (title: string) => {
                    replaceAppState(title, appState.drawerOpen, appState.user)
                }, setDrawerOpen: (open: boolean) => {
                    replaceAppState(appState.title, open, appState.user)
                }, setUser: setUser
            }}>
                {bootstrapping ? (<div className={"grid place-items-center h-screen"}>
                    <CircularProgress/>
                    {debugSnack}
                </div>) : (<Router>
                    <MainAppBar/>
                    <MainMenu/>
                    <Routes>
                        <Route path="/" element={getHome()}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/logout" element={<Logout/>}/>
                        {getAvailableRoutes()}
                    </Routes>
                    {debugSnack}
                </Router>)}
            </AppStateContext.Provider>
        </>
    )
}

export default App;
export
{
    AppStateContext
}
    ;
