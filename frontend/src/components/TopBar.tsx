import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Logout, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, Link, Menu, MenuItem } from "@mui/material";

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
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
        toast.success('Logged out successfully');
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(to right, #097969, #209e61)' }}>
                <Toolbar>
                    <TopbarLink to="/" text="Home" />
                    <TopbarLink to="/view-courts" text="View Courts" />
                    {isAdmin && [
                        <TopbarLink key="new-court" to="/new-court" text="Create Court" />,
                        <TopbarLink key="edit-court" to="/edit-court" text="Edit Court" />
                    ]}
                    <Box flexGrow={1} />
                    <IconButton
                        color="inherit"
                        aria-label="menu"
                        onClick={handleMenuClick}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {!isAuthenticated ? [
                            <MenuItem key="signup" onClick={handleMenuClose} component={RouterLink} to="/signup">Sign Up</MenuItem>,
                            <MenuItem key="login" onClick={handleMenuClose} component={RouterLink} to="/login">Login</MenuItem>
                        ] : [
                            <MenuItem key="help" onClick={handleMenuClose} component={RouterLink} to="/help">Help</MenuItem>,
                            <MenuItem key="logout" onClick={handleLogout}>
                                Logout
                                <Logout fontSize="small" />
                            </MenuItem>
                        ]}
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box height="20px" />
        </>
    );
}