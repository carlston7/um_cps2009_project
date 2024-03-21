import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Logout } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, Link } from "@mui/material";
import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

interface TopbarLinkProps {
    to: string;
    text: string;
    external?: boolean;
}

const TopbarLink: React.FC<TopbarLinkProps> = ({ to, text, external = false }) => {
    if (external) {
        return (
            <Box mx={2}>
                <Link href={to} target="_blank" rel="noopener noreferrer" underline="none" color="inherit">
                    <Typography>{text}</Typography>
                </Link>
            </Box>
        );
    } else {
        return (
            <Box mx={2}>
                <Link component={RouterLink} to={to} underline="none" color="inherit">
                    <Typography>{text}</Typography>
                </Link>
            </Box>
        );
    }
};

export default function TopBar() {
    const { isAuthenticated, isAdmin, logout } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        localStorage.clear();
        navigate('/');
    };
    console.log("isAdmin: " + isAdmin);
    return (
        <>
            <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(to right, #097969, #209e61)' }}>
                <Toolbar>
                    <TopbarLink to="/" text="Home" />
                    <TopbarLink to="/view-courts" text="View Courts" />
                    {isAdmin && (
                        <>
                            <TopbarLink to="/new-court" text="Create Court" />
                            <TopbarLink to="/edit-court" text="Edit Court" />
                        </>
                    )}
                    {isAuthenticated && (
                        <>
                            <TopbarLink to="/topup" text="Topup" />
                            <IconButton onClick={handleLogout} color="inherit">
                                <Logout />
                            </IconButton>
                        </>
                    )}
                    {!isAuthenticated && (
                        <>
                            <TopbarLink to="/signup" text="Sign Up" />
                            <TopbarLink to="/login" text="Login" />
                        </>
                    )}
                    <Box flexGrow={1} />
                </Toolbar>
            </AppBar>
            {/* Add a Box with height as padding below the AppBar */}
            <Box height="20px" />
        </>
    );
}

