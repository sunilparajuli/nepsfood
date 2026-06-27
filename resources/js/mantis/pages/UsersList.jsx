import React, { useEffect, useState } from 'react';
import { 
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, Typography, Box, TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    
    // Dialog state
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, username: '', role_id: '', is_active: 1, password: '' });
    
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/forms/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await api.get('/forms/roles');
            setRoles(res.data);
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    const handleOpen = (user = null) => {
        if (user) {
            setFormData({ 
                id: user.id, 
                username: user.username, 
                role_id: user.role_id || '', 
                is_active: user.is_active !== undefined ? user.is_active : 1, 
                password: '' 
            });
        } else {
            setFormData({ id: null, username: '', role_id: '', is_active: 1, password: '' });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password; // Don't send empty password
            
            if (formData.id) {
                await api.put(`/forms/users/${formData.id}`, payload);
            } else {
                await api.post('/forms/users', payload);
            }
            handleClose();
            fetchUsers();
        } catch (err) {
            console.error('Error saving user:', err);
            alert('Failed to save user. Make sure username is unique.');
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await api.put(`/forms/users/${user.id}`, { is_active: user.is_active ? 0 : 1 });
            fetchUsers();
        } catch (err) {
            console.error('Error toggling user status:', err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/forms/users/${id}`);
                fetchUsers();
            } catch (err) {
                console.error('Error deleting user:', err);
            }
        }
    };

    return (
        <MainCard 
            title="User Management" 
            secondary={
                <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={() => handleOpen()}>
                    Add User
                </Button>
            }
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.role ? row.role.name : 'None'}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.is_active ? 'Active' : 'Deactivated'} 
                                        color={row.is_active ? 'success' : 'error'} 
                                        size="small" 
                                        variant={row.is_active ? 'filled' : 'outlined'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color={row.is_active ? 'warning' : 'success'} 
                                        onClick={() => handleToggleStatus(row)}
                                        title={row.is_active ? 'Deactivate User' : 'Activate User'}
                                    >
                                        {row.is_active ? <StopOutlined /> : <CheckCircleOutlined />}
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => handleOpen(row)} title="Edit">
                                        <EditOutlined />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(row.id)} title="Delete">
                                        <DeleteOutlined />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{formData.id ? 'Edit User' : 'Add New User'}</DialogTitle>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3} mt={1}>
                        <TextField
                            fullWidth
                            label="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            helperText={formData.id ? "Leave blank to keep current password" : "Required for new users"}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Role"
                            value={formData.role_id}
                            onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {roles.map(r => (
                                <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save User
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
