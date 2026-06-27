import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    IconButton, 
    Chip,
    Divider,
    Grid,
    Button
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SubmissionsList() {
    const [submissions, setSubmissions] = useState([]);
    const navigate = useNavigate();

    const fetchSubmissions = async () => {
        try {
            const res = await api.get('/forms/submissions');
            setSubmissions(res.data);
        } catch (err) {
            console.error('Error fetching submissions:', err);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

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

    const handleExportPdf = async (id) => {
        try {
            // We need to fetch it as a blob so we can download or open it.
            const response = await api.get(`/forms/submissions/${id}/export_pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Submission_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting PDF:', err);
            alert('Failed to export PDF');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'success';
            case 'Pending': return 'warning';
            case 'Rejected': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box maxWidth="lg">
            <Typography variant="h5" fontWeight="bold" mb={3}>Form Submissions</Typography>

            {submissions.length === 0 ? (
                <Typography align="center" color="textSecondary" sx={{ mt: 5 }}>
                    No submissions found.
                </Typography>
            ) : (
                submissions.map((row) => (
                    <Card key={row.id} sx={{ mb: 3, boxShadow: 1, borderRadius: 2 }}>
                        <CardContent>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs={12} sm={8}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight="bold" mr={2}>
                                            {row.template?.name || 'Form Submission'}
                                        </Typography>
                                        <Chip 
                                            label={row.status || 'Pending'} 
                                            color={getStatusColor(row.status)} 
                                            size="small" 
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" mb={0.5}>
                                        ID: {row.form_id} • User: {row.employee?.username || 'Unknown'}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Date: {new Date(row.created_at).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12} sm={4} sx={{ textAlign: { sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                                    <IconButton color="error" onClick={() => handleDelete(row.id)} title="Delete">
                                        <DeleteOutlinedIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => handleExportPdf(row.id)} title="Export PDF" sx={{ mx: 1 }}>
                                        <PictureAsPdfIcon />
                                    </IconButton>
                                    <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => navigate(`/submissions/${row.id}`)}
                                        sx={{ textTransform: 'none', fontWeight: 'bold' }}
                                    >
                                        View Detail
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}
