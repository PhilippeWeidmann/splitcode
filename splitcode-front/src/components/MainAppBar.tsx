import * as React from 'react';
import {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import {Link} from "react-router-dom";
import {Alert, Avatar, ButtonBase, Snackbar, Typography} from "@mui/material";
import {AppStateContext} from "../App";
import {stringAvatar} from "../utils/ColorsUtils";
import ProfileDialog from "./ProfileDialog";

function MainAppBar() {
    let appState = useContext(AppStateContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [snackbarType, setSnackbarType] = React.useState("success");
    const openMenu = Boolean(anchorEl);


    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpenDialog(true)
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleClickOpenDialog = () => {
        setOpenDialog(true);
        setAnchorEl(null);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleDisplaySnackbar = (message: string, type: string) => {
        setSnackbarMessage(message);
        setSnackbarType(type);
        setOpenSnackbar(true);
    }
    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Link to={"/"}>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Splitcode
                        </Typography>
                    </Link>
                    <Box sx={{flexGrow: 1}}/>
                    {appState.value.user != null ? (
                        <>
                            <ButtonBase onClick={handleClickMenu}>
                                <Avatar {...stringAvatar(appState.value.user.name)}/>
                            </ButtonBase>
                            <ProfileDialog open={openDialog} onClose={handleCloseDialog}
                                           displaySnackbar={handleDisplaySnackbar}/>
                        </>
                    ) : (
                        <Button color="inherit">
                            <Link to={"/login"}>Login</Link>
                        </Button>
                    )}
                    {openSnackbar && (
                        <Box sx={{position: "absolute", top: "0", right: "0"}}>
                            <Snackbar open={openSnackbar} anchorOrigin={{vertical: "top", horizontal: "center"}}
                                      autoHideDuration={5000} onClose={() => {
                                setOpenSnackbar(false)
                            }}>
                                <Alert severity={"success"} sx={{width: '100%'}}>
                                    {snackbarMessage}
                                </Alert>
                            </Snackbar>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
        </Box>
    );
}


export default MainAppBar;
