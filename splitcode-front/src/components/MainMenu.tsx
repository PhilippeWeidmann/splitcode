import * as React from 'react';
import {useContext} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {AppStateContext} from "../App";
import {Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import APIFetcher from "../networking/APIFetcher.js";

function MainMenu() {
    let appState = useContext(AppStateContext);
    const navigate = useNavigate();

    function toggleDrawer(open: boolean) {
        return (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === 'keydown' &&
                ((event as React.KeyboardEvent).key === 'Tab' ||
                    (event as React.KeyboardEvent).key === 'Shift')
            ) {
                return;
            }
            appState.setDrawerOpen(open);
        };
    }

    function logout() {
        APIFetcher.logout().then(() => {
            appState.replaceAppState(appState.value.title, false, undefined)
            navigate("/")
        });
    }

    return (
        <Drawer
            anchor={'left'}
            open={appState.value.drawerOpen}
            onClose={toggleDrawer(false)}
        >
            <Box
                sx={{width: 250}}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <List>
                    <Link to={"/"}>
                        <ListItemButton key={"Home"}>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                    </Link>
                </List>
                <Divider/>
                <List>
                    <ListItemButton key={"Logout"} onClick={logout}>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Logout"/>
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    );
}

export default MainMenu;
