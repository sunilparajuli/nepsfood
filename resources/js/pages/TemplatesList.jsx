import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Button, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Typography,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function TemplatesList() {
    const [templates, setTemplates] = useState([]);
    const navigate = useNavigate();

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/forms/templates');
            setTemplates(res.data);
        } catch (err) {
            console.error('Error fetching templates:', err);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this template?')) {
            try {
                await api.delete(`/forms/templates/${id}`);
                fetchTemplates();
            } catch (err) {
                console.error('Error deleting template:', err);
            }
        }
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">Form Templates</Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/templates/create')}
                >
                    Create Template
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={1}>
                <Table>
                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                        <TableRow>
                            <TableCell fontWeight="bold">ID</TableCell>
                            <TableCell fontWeight="bold">Name</TableCell>
                            <TableCell fontWeight="bold">Department</TableCell>
                            <TableCell fontWeight="bold">Version</TableCell>
                            <TableCell fontWeight="bold">Issue Date</TableCell>
                            <TableCell fontWeight="bold" align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {templates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No templates found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            templates.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.version}</TableCell>
                                    <TableCell>{row.issue_date}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => navigate(`/templates/${row.id}/edit`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
