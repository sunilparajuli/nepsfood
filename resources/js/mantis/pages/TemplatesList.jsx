import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    IconButton,
    Typography,
    Box,
    TextField,
    MenuItem,
    InputAdornment
} from '@mui/material';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function TemplatesList() {
    const [templates, setTemplates] = useState([]);
    const [filteredTemplates, setFilteredTemplates] = useState([]);
    
    // Filters
    const [searchTemplate, setSearchTemplate] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');

    const navigate = useNavigate();

    const fetchTemplates = async () => {
        try {
            const res = await api.get('/forms/templates');
            setTemplates(res.data);
            setFilteredTemplates(res.data);
        } catch (err) {
            console.error('Error fetching templates:', err);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    // Apply filters
    useEffect(() => {
        let result = templates;
        
        if (searchTemplate) {
            const term = searchTemplate.toLowerCase();
            result = result.filter(t => t.name.toLowerCase().includes(term));
        }
        
        if (filterDepartment !== 'All') {
            result = result.filter(t => (t.department || 'General') === filterDepartment);
        }
        
        setFilteredTemplates(result);
    }, [searchTemplate, filterDepartment, templates]);

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

    // Get unique departments for filter dropdown
    const departments = ['All', ...new Set(templates.map(t => t.department || 'General'))];

    return (
        <MainCard 
            title="Form Templates" 
            secondary={
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PlusOutlined />}
                    onClick={() => navigate('/templates/create')}
                >
                    Create Template
                </Button>
            }
        >
            {/* Filters Section */}
            <Box mb={3} display="flex" gap={2} flexWrap="wrap">
                <TextField
                    size="small"
                    placeholder="Search Template Name..."
                    value={searchTemplate}
                    onChange={(e) => setSearchTemplate(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchOutlined /></InputAdornment>,
                    }}
                    sx={{ minWidth: 250 }}
                />
                <TextField
                    select
                    size="small"
                    label="Department Filter"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    sx={{ minWidth: 200 }}
                >
                    {departments.map(dep => (
                        <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                    ))}
                </TextField>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1" fontWeight={600}>ID</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight={600}>Name</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight={600}>Department</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight={600}>Version</Typography></TableCell>
                            <TableCell><Typography variant="subtitle1" fontWeight={600}>Issue Date</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle1" fontWeight={600}>Actions</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredTemplates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    No templates found matching your search.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTemplates.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.version}</TableCell>
                                    <TableCell>{row.issue_date}</TableCell>
                                    <TableCell align="right">
                                        <IconButton color="primary" onClick={() => navigate(`/templates/${row.id}/edit`)}>
                                            <EditOutlined />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)}>
                                            <DeleteOutlined />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </MainCard>
    );
}
