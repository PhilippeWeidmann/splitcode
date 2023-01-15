import React, {useContext, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import APIFetcher from "../networking/APIFetcher.js";
import {AppStateContext} from "../App";
import {useNavigate} from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const appState = useContext(AppStateContext);
    const [name, setName] = useState("");
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

    useEffect(() => {
        appState.setTitle("Register")
    }, [])

    function register(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (validateName(name)) {
            if (validateEmail(email)) {
                if (validatePassword(password)) {
                    APIFetcher.register(name, email, role, password)
                        .then((user) => {
                            appState.setUser(user)
                            navigate("/")
                        })
                        .catch((error) => {
                            console.log(error)
                            setEmailError(true)
                            setEmailErrorMessage("Email already in use")
                        })
                }
            }
        }
    }

    function validateName(input: string) {
        if (input.length > 0) {
            setNameError(false)
            setNameErrorMessage("")
            return true
        } else {
            setNameError(true)
            setNameErrorMessage("You must enter a name")
            return false
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
                }}>
                    <Typography variant={"h4"} sx={{marginBottom: 10}}>
                        Almost there !
                    </Typography>
                    <form onSubmit={register} style={{width: "100%"}}>
                        <Stack spacing={2}>
                            <Stack spacing={2} direction={"row"}>
                                <TextField id="name" label="Name" error={nameError} helperText={nameErrorMessage}
                                           variant="outlined" fullWidth onChange={event => {
                                    setName(event.target.value)
                                }}/>
                                <FormControl fullWidth>
                                    <InputLabel id="roleLabel">Role</InputLabel>
                                    <Select
                                        labelId="roleLabel"
                                        id="role"
                                        value={role}
                                        label="Role"
                                        onChange={(event) => {
                                            setRole(event.target.value)
                                        }}>
                                        <MenuItem value={"student"}>Student</MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                            <TextField id="email" label="Email" error={emailError} helperText={emailErrorMessage}
                                       variant="outlined" fullWidth onChange={event => {
                                setEmail(event.target.value)
                            }}/>

                            <TextField id="password" label="Password" variant="outlined" error={passwordError}
                                       helperText={passwordErrorMessage} type="password" fullWidth
                                       onChange={event => {
                                           setPassword(event.target.value)
                                       }}/>
                            <Button type={"submit"} variant="contained">Create an account</Button>
                        </Stack>
                    </form>
                </Box>
                <Box display={"flex"} flexDirection={"column"}
                     sx={{flex: 1, padding: 3, justifyContent: "center", alignItems: "center"}}>
                    <img src={"/cherry-register.png"}/>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;
