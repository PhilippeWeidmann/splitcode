import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, Checkbox, Container, Divider, FormControlLabel, Paper, Stack, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {AppStateContext} from "../App";
import APIFetcher from "../networking/APIFetcher.js";

function Login() {
    const navigate = useNavigate();
    const appState = useContext(AppStateContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMeChecked, setRememberMeChecked] = useState(true);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    useEffect(() => {
        appState.setTitle("Login")
    }, [])

    function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (validateEmail(email)) {
            if (validatePassword(password)) {
                APIFetcher.login(email, password, rememberMeChecked)
                    .then((user) => {
                        appState.setUser(user)
                        navigate("/")
                    })
                    .catch((error) => {
                        console.log(error)
                        setEmailError(true)
                        setPasswordError(true)
                        setPasswordErrorMessage("Invalid email or password")
                    })
            }
        }
    }

    function validateEmail(input: string) {
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.match(validRegex)) {
            setEmailError(false)
            setEmailErrorMessage("")
            return true
        } else {
            setEmailError(true)
            setEmailErrorMessage("You must enter a valid email address")
            return false
        }
    }

    function validatePassword(input: string) {
        if (input.length >= 8) {
            setPasswordError(false)
            setPasswordErrorMessage("")
            return true
        } else {
            setPasswordError(true)
            setPasswordErrorMessage("Your password must be at least 8 characters long")
            return false
        }
    }

    return (
        <Container component={Paper} sx={{my: "auto", padding: 5, borderRadius: 2, borderWidth: 1}} elevation={5}>
            <Box display={"flex"} sx={{flexDirection: {xs: "column", lg: "row"}}}>
                <Box flexDirection={"column"} sx={{
                    display: "flex",
                    flex: 1,
                    padding: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%"
                }}>
                    <Typography variant={"h4"} sx={{marginBottom: 10}}>
                        Welcome back !
                    </Typography>
                    <form onSubmit={login} style={{width: "100%"}}>
                        <Stack spacing={2}>
                            <TextField id="email" label="Email" error={emailError} helperText={emailErrorMessage}
                                       variant="outlined" fullWidth onChange={event => {
                                setEmail(event.target.value)
                            }}/>
                            <TextField id="password" label="Password" error={passwordError}
                                       helperText={passwordErrorMessage} variant="outlined" type="password" fullWidth
                                       onChange={event => {
                                           setPassword(event.target.value)
                                       }}/>
                            <FormControlLabel control={<Checkbox defaultChecked={rememberMeChecked} onChange={() => {setRememberMeChecked(!rememberMeChecked)}} />} label="Remember me" />
                        </Stack>
                        <Stack direction="column" spacing={1} alignItems="center" justifyContent="center"
                               sx={{marginTop: 3}}>
                            <Button type={"submit"} variant="contained" sx={{width: "100%"}}>Sign in</Button>

                        </Stack>
                    </form>
                </Box>
                <Divider orientation="vertical" flexItem/>
                <Box display={"flex"} flexDirection={"column"}
                     sx={{flex: 1, padding: 3, justifyContent: "center", alignItems: "center"}}>
                    <Typography variant={"h4"} sx={{marginBottom: 2}}>
                        Don't have an account ?
                    </Typography>
                    <Button variant={"text"} sx={{
                        width: "75%",
                        marginTop: 2,
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {boxShadow: 20}
                    }} onClick={() => navigate("/register")}>
                        <img src={"/cherry-689.png"}/>
                        <label style={{marginTop: "1em"}}>Create an account</label>
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;
