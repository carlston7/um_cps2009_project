import { toast } from 'react-toastify';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AccountBalanceWallet, Logout, Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography, Link, Menu, MenuItem, Chip } from "@mui/material";
import { useMediaQuery, useTheme } from '@mui/material';

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
                    <Typography sx={{ fontSize: '80%' }}>{text}</Typography>
                </Link>
            </Box>
        );
    } else {
        return (
            <Box mx={2}>
                <Link component={RouterLink} to={to} underline="none" color="inherit">
                    <Typography sx={{ fontSize: '100%' }}>{text}</Typography>
                </Link>
            </Box>
        );
    }
};
export default function TopBar() {
    const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    const userCredit = localStorage.getItem('userCredit') || '0.00';
    const formattedCredit = parseFloat(userCredit).toFixed(2);

    return (
        <>
            <AppBar position="static" sx={{ backgroundImage: 'linear-gradient(to right, #097969, #209e61)' }}>
                <Toolbar>
                    <TopbarLink to="/" text="Home" />
                    {isAuthenticated && !isAdmin && !isMobile && <TopbarLink to="/view-courts" text="Book a Court" />}
                    {isAuthenticated && !isAdmin && !isMobile && <TopbarLink to="/my-bookings" text="My Bookings" />}
                    {isAdmin && [
                        <TopbarLink key="new-court" to="/new-court" text="Create Court" />,
                        <TopbarLink key="edit-court" to="/view-all-courts" text="Edit Court" />
                    ]}
                    <Box flexGrow={1} />
                    {isAuthenticated && !isAdmin && [
                        <Chip
                            icon={<AccountBalanceWallet />}
                            label={`Balance: $${formattedCredit}`}
                            color="default" />
                    ]}
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
                        {isMobile && isAuthenticated && !isAdmin && <MenuItem onClick={handleMenuClose} component={RouterLink} to="/view-courts">Book a Court</MenuItem>}
                        {isMobile && isAuthenticated && !isAdmin && <MenuItem onClick={handleMenuClose} component={RouterLink} to="/my-bookings">My Bookings</MenuItem>}
                        {isMobile && isAdmin && [
                            <MenuItem key="view-courts-mobile" onClick={handleMenuClose} component={RouterLink} to="/view-courts">Book a Court</MenuItem>,
                            <MenuItem key="my-bookings-mobile" onClick={handleMenuClose} component={RouterLink} to="/my-bookings">My Bookings</MenuItem>
                        ]}
                        <MenuItem key="help" onClick={handleMenuClose} component={RouterLink} to="/help">Help</MenuItem>
                        {!isAuthenticated ? [
                            <MenuItem key="signup" onClick={handleMenuClose} component={RouterLink} to="/signup">Sign Up</MenuItem>,
                            <MenuItem key="login" onClick={handleMenuClose} component={RouterLink} to="/login">Login</MenuItem>
                        ] : [
                                <MenuItem key="profile" onClick={handleMenuClose} component={RouterLink} to="/profile">View Profile</MenuItem>,
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
