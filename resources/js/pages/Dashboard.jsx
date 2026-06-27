import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

export default function Dashboard() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { text: 'Form Templates', icon: <DescriptionIcon />, path: '/templates' },
        { text: 'Submissions', icon: <ListAltIcon />, path: '/submissions' },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Toolbar sx={{ my: 2, px: 3 }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: '10px', background: 'linear-gradient(135deg, #f4511e 0%, #ff844c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 18, boxShadow: '0 4px 10px rgba(244, 81, 30, 0.3)' }}>N</Box>
                    <Typography variant="h6" noWrap component="div" fontWeight="800" sx={{ background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
                        Nepsfood
                    </Typography>
                </Box>
            </Toolbar>
            <List sx={{ px: 2, flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isSelected = location.pathname.startsWith(item.path);
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileOpen(false);
                                }}
                                sx={{
                                    borderRadius: '12px',
                                    transition: 'all 0.2s ease-in-out',
                                    py: 1.5,
                                    ...(isSelected ? {
                                        bgcolor: 'rgba(244, 81, 30, 0.08)',
                                        '&:hover': { bgcolor: 'rgba(244, 81, 30, 0.12)' }
                                    } : {
                                        '&:hover': {
                                            bgcolor: 'rgba(30, 41, 59, 0.04)',
                                            transform: 'translateX(4px)'
                                        }
                                    })
                                }}
                            >
                                <ListItemIcon sx={{ color: isSelected ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ 
                                        fontWeight: isSelected ? 600 : 500,
                                        color: isSelected ? 'primary.main' : 'text.primary',
                                        fontSize: '0.95rem'
                                    }} 
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            
            <Box p={2}>
                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                <Button 
                    fullWidth 
                    color="inherit" 
                    onClick={handleLogout} 
                    startIcon={<LogoutIcon />}
                    sx={{ 
                        justifyContent: 'flex-start', 
                        px: 2, 
                        py: 1.5, 
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main', bgcolor: 'error.light', opacity: 0.9 }
                    }}
                >
                    Logout
                </Button>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
                    color: 'text.primary',
                }}
            >
                <Toolbar sx={{ minHeight: '70px !important' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderRadius: '50px', bgcolor: 'rgba(30, 41, 59, 0.03)', border: '1px solid rgba(30, 41, 59, 0.05)' }}>
                         <Typography variant="body2" fontWeight="600" color="text.secondary">Admin User</Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, 
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', boxShadow: '4px 0 24px rgba(0,0,0,0.04)' },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(226, 232, 240, 0.8)', bgcolor: '#ffffff' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: { xs: 2, sm: 4 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, pt: { xs: 10, sm: 11 } }}
            >
                <Outlet />
            </Box>
        </Box>
    );
}
