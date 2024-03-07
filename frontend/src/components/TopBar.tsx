import React, { useContext } from 'react';
import { ColorModeContext } from '../context/ColourModeContext';
import { AuthContext } from '../context/AuthContext';
import { DarkMode, LightMode, Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, Link } from "@mui/material";
import { toast } from 'react-toastify';

interface TopbarLinkProps {
    href: string;
    text: string;
    external?: boolean;
}

function TopbarLink(props: TopbarLinkProps) {
    let { href, text, external } = {
        external: false,
        ...props
    };

    return <Box mx={2}>
        <Link href={href} underline="none" color="inherit"
            target={external ? "_blank" : "_self"}>
            <Typography>
                {text}
            </Typography>
        </Link>
    </Box>;
}

export default function TopBar() {
    const { toggleColorMode, currentTheme } = useContext(ColorModeContext);
    const { isAuthenticated, logout } = useContext(AuthContext); 

    return (
        <Box flexGrow={1}>
            <AppBar sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#097969' : '#0BDA51' }}>
                <Toolbar>
                    <TopbarLink href="/" text="Home" />
                    <TopbarLink href="/dummy" text="DummyTest" />
                    {isAuthenticated ? (
                        <IconButton
                            onClick={() => {
                                logout(); // Call the logout function from your AuthContext
                                toast.success('Logged out successfully'); // Show a success toast
                            }}
                            color="inherit"
                        >
                            <Logout />
                        </IconButton>
                    ) : (
                        <>
                            <TopbarLink href="/signup" text="Sign Up" />
                            <TopbarLink href="/login" text="Login" />
                        </>
                    )}
                    <Box flexGrow={1} />
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {currentTheme === "dark" ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
