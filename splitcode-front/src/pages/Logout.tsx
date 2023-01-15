import React, {useContext, useEffect, useState} from 'react';
import {AppStateContext} from "../App";
import {Navigate} from "react-router-dom";
import APIFetcher from "../networking/APIFetcher.js";

function Logout() {
    const appState = useContext(AppStateContext);
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => {
        APIFetcher.logout().then(() => {
            appState.replaceAppState(appState.value.title, false, undefined)
            setIsLoggedOut(true)
        });
    }, [])

    return (isLoggedOut ? <Navigate to="/"/> : <></>);
}

export default Logout;
