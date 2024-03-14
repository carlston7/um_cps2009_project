import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, Link } from "@mui/material";
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

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
    const { isAuthenticated, isAdmin, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    return (
        <Box flexGrow={1}>
            <AppBar sx={{
                backgroundImage: 'linear-gradient(to right, #097969, #209e61)'
            }}>
                <Toolbar>
                    <TopbarLink href="/" text="Home" />
                    {isAuthenticated ? (
                        <>
                            <IconButton
                                onClick={() => {
                                    logout();
                                    toast.success('Logged out successfully'); 
                                    localStorage.clear();
                                    // localStorage.removeItem('token');
                                    // localStorage.removeItem('userEmail');
                                    // localStorage.removeItem('userType');
                                    // localStorage.removeItem('userPassword');
                                    navigate('/');
                                }}
                                color="inherit"
                            >
                                <Logout />
                            </IconButton>
                            {/* Use RouterLink for the "Topup" link to navigate within the app */}
                            <Box mx={2}>
                                <Link component={RouterLink} to="/topup" underline="none" color="inherit">
                                    <Typography>Topup</Typography>
                                </Link>
                            </Box>
                        </>
                    ) : (
                        <>
                            <TopbarLink href="/signup" text="Sign Up" />
                            <TopbarLink href="/login" text="Login" />
                        </>
                    )}
                    <Box flexGrow={1} />
                    {isAdmin && <TopbarLink href="/court-admin" text="Manage Courts" />}
                </Toolbar>
            </AppBar>
        </Box>
    );
}