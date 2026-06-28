import React, { useEffect, useState } from 'react';
import { 
    Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    IconButton, Typography, Box, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    FormGroup, FormControlLabel, Checkbox, Grid, Divider, Paper
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function RolesList() {
    const [roles, setRoles] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        id: null, 
        name: '',
        can_view_dashboard: false,
        can_manage_templates: false,
        can_manage_forms: false,
        can_manage_users: false,
        can_manage_roles: false,
        can_manage_files: false,
        can_view_reports: false,
        is_admin_override: false,
        permissions: {
            templates: {}
        }
    });

    useEffect(() => {
        fetchRoles();
        fetchTemplates();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get('/forms/roles');
            setRoles(res.data);
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/forms/templates');
            setTemplates(res.data);
        } catch (err) {
            console.error('Error fetching templates:', err);
        }
    };

    const handleOpen = (role = null) => {
        if (role) {
            const perms = role.permissions || {};
            const tplPerms = perms.templates || {};
            setFormData({ 
                id: role.id, 
                name: role.name,
                can_view_dashboard: !!role.can_view_dashboard,
                can_manage_templates: !!role.can_manage_templates,
                can_manage_forms: !!role.can_manage_forms, // legacy toggle
                can_manage_users: !!role.can_manage_users,
                can_manage_roles: !!role.can_manage_roles,
                can_manage_files: !!role.can_manage_files,
                can_view_reports: !!role.can_view_reports,
                is_admin_override: !!role.is_admin_override,
                permissions: {
                    templates: tplPerms
                }
            });
        } else {
            setFormData({ 
                id: null, 
                name: '',
                can_view_dashboard: false,
                can_manage_templates: false,
                can_manage_forms: false,
                can_manage_users: false,
                can_manage_roles: false,
                can_manage_files: false,
                can_view_reports: false,
                is_admin_override: false,
                permissions: {
                    templates: {}
                }
            });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        try {
            if (formData.id) {
                await api.put(`/forms/roles/${formData.id}`, formData);
            } else {
                await api.post('/forms/roles', formData);
            }
            handleClose();
            fetchRoles();
        } catch (err) {
            console.error('Error saving role:', err);
            alert('Failed to save role. Name must be unique.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this role? Users with this role will lose their permissions.')) {
            try {
                await api.delete(`/forms/roles/${id}`);
                fetchRoles();
            } catch (err) {
                console.error('Error deleting role:', err);
            }
        }
    };

    const handleCheckboxChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.checked });
    };

    const handleTemplatePermissionChange = (templateId, action, checked) => {
        setFormData(prev => {
            const tplPerms = prev.permissions.templates[templateId] || {
                create: false, read: false, update: false, delete: false
            };
            return {
                ...prev,
                permissions: {
                    ...prev.permissions,
                    templates: {
                        ...prev.permissions.templates,
                        [templateId]: {
                            ...tplPerms,
                            [action]: checked
                        }
                    }
                }
            };
        });
    };

    return (
        <MainCard 
            title="Role Management" 
            secondary={
                <Button variant="contained" color="primary" startIcon={<PlusOutlined />} onClick={() => handleOpen()}>
                    Add Role
                </Button>
            }
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Role Name</TableCell>
                            <TableCell>Admin?</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.is_admin_override ? 'Yes' : 'No'}</TableCell>
                                <TableCell align="right">
                                    <IconButton color="primary" onClick={() => handleOpen(row)}>
                                        <EditOutlined />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                        <DeleteOutlined />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{formData.id ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                <DialogContent dividers>
                    <Box mt={1} mb={3}>
                        <TextField
                            fullWidth
                            label="Role Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Box>
                    <Typography variant="h6" mb={2}>Top-Level Permissions</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={formData.can_view_dashboard} onChange={handleCheckboxChange} name="can_view_dashboard" />} label="Can View Dashboard" />
                                <FormControlLabel control={<Checkbox checked={formData.can_manage_templates} onChange={handleCheckboxChange} name="can_manage_templates" />} label="Can Manage Templates" />
                                <FormControlLabel control={<Checkbox checked={formData.can_manage_files} onChange={handleCheckboxChange} name="can_manage_files" />} label="Can Manage Files & Recipes" />
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={formData.can_manage_users} onChange={handleCheckboxChange} name="can_manage_users" />} label="Can Manage Users" />
                                <FormControlLabel control={<Checkbox checked={formData.can_manage_roles} onChange={handleCheckboxChange} name="can_manage_roles" />} label="Can Manage Roles" />
                                <FormControlLabel control={<Checkbox checked={formData.can_view_reports} onChange={handleCheckboxChange} name="can_view_reports" />} label="Can View Reports" />
                                <FormControlLabel control={<Checkbox checked={formData.is_admin_override} onChange={handleCheckboxChange} name="is_admin_override" color="error" />} label="Super Admin (Full Access Override)" />
                            </FormGroup>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" mb={2}>Per-Form Granular Permissions (Maker-Checker)</Typography>
                    <Typography variant="body2" color="textSecondary" mb={2}>
                        Define specific rights for each individual form template. This allows granular control over who can create, read, edit, and delete submissions for a specific type of form.
                    </Typography>
                    
                    <Grid container spacing={2}>
                        {templates.map(template => {
                            const perms = formData.permissions.templates[template.id] || { create: false, read: false, update: false, delete: false };
                            return (
                                <Grid item xs={12} key={template.id}>
                                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: { xs: 1, sm: 0 }, width: '250px' }}>
                                            {template.name}
                                        </Typography>
                                        <Box display="flex" gap={2} flexWrap="wrap">
                                            <FormControlLabel 
                                                control={<Checkbox checked={!!perms.create} onChange={(e) => handleTemplatePermissionChange(template.id, 'create', e.target.checked)} />} 
                                                label="Create" 
                                            />
                                            <FormControlLabel 
                                                control={<Checkbox checked={!!perms.read} onChange={(e) => handleTemplatePermissionChange(template.id, 'read', e.target.checked)} />} 
                                                label="Read" 
                                            />
                                            <FormControlLabel 
                                                control={<Checkbox checked={!!perms.update} onChange={(e) => handleTemplatePermissionChange(template.id, 'update', e.target.checked)} />} 
                                                label="Update" 
                                            />
                                            <FormControlLabel 
                                                control={<Checkbox checked={!!perms.delete} onChange={(e) => handleTemplatePermissionChange(template.id, 'delete', e.target.checked)} />} 
                                                label="Delete" 
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        Save Role
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
