import * as React from 'react';
import {useContext} from 'react';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {TransitionProps} from "@mui/material/transitions";
import {AppStateContext} from "../App";
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from "@mui/icons-material/Logout";
import APIFetcher from "../networking/APIFetcher.js";
import {useNavigate} from "react-router-dom";

function ProfileDialog(props: { open: boolean, onClose: () => void, displaySnackbar: (message: string, type: string) => void }) {

    const appState = useContext(AppStateContext);
    const [name, setName] = React.useState(appState.value.user!.name);
    const [email, setEmail] = React.useState(appState.value.user!.email);
    const navigate = useNavigate();

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }
    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    }

    function handleResetPassword() {
        APIFetcher.forgotPassword(appState.value.user!.email).then(() => {
            //TODO
        });
    }

    function handleSaveProfile() {
        APIFetcher.updateProfile(email, name).then((user) => {
            appState.value.user = user;
            props.onClose();
            props.displaySnackbar("Profile updated", "success");
        }).catch((error) => {
            props.onClose();
            props.displaySnackbar(error.message, "error");
        });
    }

    function logout() {
        navigate("/logout")
    }

    return (
        <Dialog
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            fullWidth
            maxWidth="sm"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                Your profile
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    <Box sx={{display: "flex"}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Full name"
                            type="text"
                            value={name}
                            onChange={onNameChange}
                            fullWidth
                            variant="standard"
                        />
                    </Box>
                    <Box sx={{display: "flex"}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Email"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={onEmailChange}
                            variant="standard"
                        />
                    </Box>
                    <Box sx={{display: "flex"}}>
                        <Button variant="contained" color="primary" startIcon={<LockResetIcon/>}
                                onClick={handleResetPassword}>
                            Reset password
                        </Button>
                    </Box>
                    <Box sx={{display: "flex"}}>
                        <Button variant="contained" color="error" startIcon={<LogoutIcon/>}
                                onClick={logout}>
                            Logout
                        </Button>
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={handleSaveProfile}>Save</Button>
            </DialogActions>

        </Dialog>
    )
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default ProfileDialog;
