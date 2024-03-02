import React, { useContext, useState } from 'react';
import { ColorModeContext } from '../context/ColourModeContext';
import { DarkMode, LightMode, Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, Link } from "@mui/material";

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toggleColorMode, currentTheme } = useContext(ColorModeContext);

    const handleLogout = () => {
        setIsAuthenticated(false);
        alert('Logged out');
        // add additional logout logic here
    };

    return (
        <Box flexGrow={1}>
            <AppBar sx={{ backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#097969' : '#0BDA51' }}>
                <Toolbar>
                    <TopbarLink href="/" text="Home" />
                    {isAuthenticated ? (
                        <IconButton onClick={handleLogout} color="inherit">
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
