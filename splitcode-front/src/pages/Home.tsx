import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {AppStateContext} from "../App";
import {Box, Button, Container, Typography} from "@mui/material";

function Home() {
    let appState = useContext(AppStateContext);
    const navigate = useNavigate();
    useEffect(() => {
        appState.setTitle("Home")
    }, [])
    return (
        <Container>
            <Typography variant={"h2"} align={"center"} sx={{mt: 5, mb: "5%"}}>Splitcode</Typography>
            <Box sx={{display: "flex", width: "100%", height: "100%"}}>
                <Button variant={"text"} sx={{
                    backgroundColor: "#ffffff",
                    width: "60%",
                    height: "70%",
                    marginTop: 2,
                    marginRight: 10,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 5,
                    "&:hover": {boxShadow: 20, backgroundColor: "#ffffff"}
                }} onClick={() => navigate("/login")}>
                    <img className={"object-contain w-72 h-72 mx-auto p-5"} src={"/cherry-619.png"}/>
                    <p className={"font-sans text-3xl p-5 text-center"}>I'm learning</p>
                </Button>
                <Button variant={"text"} sx={{
                    backgroundColor: "#ffffff",
                    width: "60%",
                    height: "70%",
                    marginTop: 2,
                    marginLeft: 10,
                    display: "flex",
                    boxShadow: 5,
                    flexDirection: "column",
                    "&:hover": {boxShadow: 20, backgroundColor: "#ffffff"}
                }} onClick={() => navigate("/login")}>
                    <img className={"object-contain w-72 h-72 mx-auto p-5"} src={"/cherry-620.png"}/>
                    <p className={"font-sans text-3xl p-5 text-center"}>I'm teaching</p>
                </Button>
                <div className={"flex-auto"}/>
            </Box>
        </Container>
    );
}

export default Home;
