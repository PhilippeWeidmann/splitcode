import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmFinishAttemptDialogProps {
    isShowing: boolean;
    isGroupAttempt: boolean;
    isEnabled: boolean;
    handleClose: () => void;
    handleConfirm: () => void;
}

export default function ConfirmFinishAttemptDialog(props: ConfirmFinishAttemptDialogProps) {
    return (
        <Dialog
            open={props.isShowing}
            onClose={props.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Finish attempt ?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.isGroupAttempt ?
                        "Finishing the attempt finishes the attempt for both users. Are you sure you want to finish the attempt ?"
                        : "Once you finish your attempt, you won't be able to edit your code anymore."}
                    <br/>
                    {props.isEnabled ? "" : "You can't finish the attempt because one of the users hasn't joined yet. If no one is available, the attempt will be automatically submitted at the end of the time."}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose}>Cancel</Button>
                <Button onClick={props.handleConfirm} autoFocus disabled={!props.isEnabled}>
                    Finish Attempt
                </Button>
            </DialogActions>
        </Dialog>
    );
}
