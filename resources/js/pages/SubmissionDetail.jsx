import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Grid,
    Divider,
    Button,
    Chip,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableContainer
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function SubmissionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [submission, setSubmission] = useState(null);

    const fetchSubmission = async () => {
        try {
            const res = await api.get(`/forms/submissions/${id}`);
            setSubmission(res.data);
        } catch (err) {
            console.error('Error fetching submission detail:', err);
        }
    };

    useEffect(() => {
        fetchSubmission();
    }, [id]);

    const handleExportPdf = async () => {
        try {
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

    const handleStatusChange = async (newStatus) => {
        try {
            await api.put(`/forms/submissions/${id}`, { status: newStatus });
            fetchSubmission();
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status');
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

    if (!submission) {
        return <Typography p={3}>Loading...</Typography>;
    }

    // Process submitted data
    let submittedData = {};
    if (submission.data) {
        const parsedData = typeof submission.data === 'string' ? JSON.parse(submission.data) : submission.data;
        // The mobile app wraps data in 'rows' array
        if (parsedData.rows && parsedData.rows.length > 0) {
            submittedData = parsedData.rows[0];
        } else {
            submittedData = parsedData;
        }
    }

    return (
        <Box maxWidth="lg">
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/submissions')}
                sx={{ mb: 2 }}
            >
                Back to Submissions
            </Button>
            
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap">
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        {submission.template?.name || 'Form Submission'}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        ID: {submission.form_id}
                    </Typography>
                </Box>
                
                <Box display="flex" gap={1} mt={{ xs: 2, sm: 0 }}>
                    <Button 
                        variant="outlined" 
                        color="primary" 
                        startIcon={<PictureAsPdfIcon />}
                        onClick={handleExportPdf}
                    >
                        Export PDF
                    </Button>
                    {submission.status !== 'Approved' && (
                        <Button 
                            variant="contained" 
                            color="success" 
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleStatusChange('Approved')}
                        >
                            Approve
                        </Button>
                    )}
                    {submission.status !== 'Rejected' && (
                        <Button 
                            variant="contained" 
                            color="error" 
                            startIcon={<CancelIcon />}
                            onClick={() => handleStatusChange('Rejected')}
                        >
                            Reject
                        </Button>
                    )}
                </Box>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" mb={2}>Submission Details</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box mb={2}>
                            <Typography variant="caption" color="textSecondary" display="block">Status</Typography>
                            <Chip 
                                label={submission.status || 'Pending'} 
                                color={getStatusColor(submission.status)} 
                                size="small" 
                                sx={{ fontWeight: 'bold' }}
                            />
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="textSecondary" display="block">Department</Typography>
                            <Typography variant="body1">{submission.department}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="textSecondary" display="block">Submitted By</Typography>
                            <Typography variant="body1">{submission.employee?.username || 'Unknown'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="caption" color="textSecondary" display="block">Date Submitted</Typography>
                            <Typography variant="body1">{new Date(submission.created_at).toLocaleString()}</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>Submitted Content</Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <TableContainer>
                            <Table size="small">
                                <TableBody>
                                    {Object.keys(submittedData).length === 0 ? (
                                        <TableRow>
                                            <TableCell align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                No data content found in this submission.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        Object.entries(submittedData).map(([key, value]) => {
                                            // Format the key to look like a label (e.g. date_of_sighting -> Date Of Sighting)
                                            const formattedKey = key
                                                .replace(/_/g, ' ')
                                                .replace(/\b\w/g, l => l.toUpperCase());
                                                
                                            return (
                                                <TableRow key={key}>
                                                    <TableCell component="th" scope="row" sx={{ fontWeight: 'bold', width: '40%' }}>
                                                        {formattedKey}
                                                    </TableCell>
                                                    <TableCell>
                                                        {typeof value === 'boolean' 
                                                            ? (value ? 'Yes' : 'No') 
                                                            : (value !== null && value !== '' ? value.toString() : '-')}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
