import React, { useEffect, useState } from 'react';
import { 
    Grid,
    Button,
    Card,
    Typography,
    Chip,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Paper,
    InputAdornment,
    Drawer,
    AppBar,
    Toolbar
} from '@mui/material';
import { DeleteOutlined, EyeOutlined, SearchOutlined, FilePdfOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function SubmissionsList() {
    const [submissions, setSubmissions] = useState([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState([]);
    
    // Filters
    const [searchTemplate, setSearchTemplate] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterDate, setFilterDate] = useState('');
    const [filterUser, setFilterUser] = useState('All');
    
    // PDF Preview Drawer
    const [previewPdfId, setPreviewPdfId] = useState(null);
    const [usersList, setUsersList] = useState([]);
    
    const navigate = useNavigate();

    const fetchSubmissions = async () => {
        try {
            // Build query params
            const params = new URLSearchParams();
            if (filterStatus !== 'All') params.append('status', filterStatus);
            if (filterDate) params.append('date', filterDate);
            if (filterUser !== 'All') params.append('employee_id', filterUser);
            if (filterDepartment !== 'All') params.append('department', filterDepartment);
            
            const res = await api.get(`/forms/submissions?${params.toString()}`);
            setSubmissions(res.data);
            setFilteredSubmissions(res.data);
        } catch (err) {
            console.error('Error fetching submissions:', err);
        }
    };
    
    const fetchUsers = async () => {
        try {
            const res = await api.get('/forms/users');
            setUsersList(res.data);
        } catch (err) {}
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchSubmissions();
    }, [filterStatus, filterDate, filterUser, filterDepartment]); // re-fetch when server-side filters change

    // Apply client-side filters (Search)
    useEffect(() => {
        let result = submissions;
        
        if (searchTemplate) {
            const term = searchTemplate.toLowerCase();
            result = result.filter(s => (s.template?.name || 'Unknown Template').toLowerCase().includes(term));
        }
        
        setFilteredSubmissions(result);
    }, [searchTemplate, submissions]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this submission?')) {
            try {
                await api.delete(`/forms/submissions/${id}`);
                fetchSubmissions();
            } catch (err) {
                console.error('Error deleting submission:', err);
            }
        }
    };

    const handleExportPdf = (id) => {
        setPreviewPdfId(id);
    };
    
    const closePreview = () => {
        setPreviewPdfId(null);
    };

    // Keep unique departments from whatever was fetched (or could fetch all templates if needed)
    const departments = ['All', ...new Set(submissions.map(s => s.template?.department || 'General'))];
    const statuses = ['All', 'Draft', 'Pending', 'Approved', 'Rejected', 'Reverted'];
    
    const token = localStorage.getItem('token');

    return (
        <MainCard title="Submissions">
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
                    label="Department"
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    sx={{ minWidth: 150 }}
                >
                    {departments.map(dep => (
                        <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    label="Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{ minWidth: 120 }}
                >
                    {statuses.map(st => (
                        <MenuItem key={st} value={st}>{st}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    size="small"
                    label="Submitted By"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    sx={{ minWidth: 150 }}
                >
                    <MenuItem value="All">All Users</MenuItem>
                    {usersList.map(u => (
                        <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
                    ))}
                </TextField>
                <TextField
                    type="date"
                    size="small"
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    sx={{ minWidth: 150 }}
                />
            </Box>

            {/* Table Section */}
            <TableContainer component={Paper} elevation={0} variant="outlined">
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'grey.50' }}>
                        <TableRow>
                            <TableCell><b>ID</b></TableCell>
                            <TableCell><b>Template Name</b></TableCell>
                            <TableCell><b>Department</b></TableCell>
                            <TableCell><b>Submitted By</b></TableCell>
                            <TableCell><b>Date</b></TableCell>
                            <TableCell align="right"><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubmissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                    <Typography color="textSecondary">No submissions found matching criteria.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSubmissions.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.template ? row.template.name : 'Unknown Template'}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.template?.department || 'General'} 
                                            size="small" 
                                            color="primary" 
                                            variant="outlined" 
                                        />
                                    </TableCell>
                                    <TableCell>{row.employee?.username || 'Guest'}</TableCell>
                                    <TableCell>{new Date(row.created_at).toLocaleString()}</TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                        <IconButton color="primary" onClick={() => navigate(`/submissions/${row.id}`)} title="View / Edit Detail">
                                            <EyeOutlined />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => handleExportPdf(row.id)} title="Preview PDF">
                                            <FilePdfOutlined />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(row.id)} title="Delete">
                                            <DeleteOutlined />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* PDF Preview Drawer */}
            <Drawer 
                anchor="right" 
                open={Boolean(previewPdfId)} 
                onClose={closePreview}
                PaperProps={{ sx: { width: { xs: '100%', sm: '60%', md: '50%' } } }}
            >
                <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h6">PDF Preview</Typography>
                        <Box>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{ mr: 2 }}
                                onClick={() => {
                                    if(previewPdfId) window.open(`/api/forms/submissions/${previewPdfId}/export_pdf?token=${token}`, '_blank');
                                }}
                            >
                                Open in New Tab
                            </Button>
                            <IconButton onClick={closePreview} edge="end">
                                <CloseOutlined />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                
                <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', bgcolor: '#525659' }}>
                    {previewPdfId && (
                        <iframe 
                            src={`/api/forms/submissions/${previewPdfId}/export_pdf?token=${token}`}
                            width="100%" 
                            height="100%" 
                            style={{ border: 'none' }}
                            title="PDF Preview"
                        />
                    )}
                </Box>
            </Drawer>
        </MainCard>
    );
}
