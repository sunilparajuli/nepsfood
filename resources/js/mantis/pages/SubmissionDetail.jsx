import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography,
    Grid,
    Button,
    Divider,
    Paper,
    CircularProgress,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Alert
} from '@mui/material';
import { 
    ArrowLeftOutlined, 
    FilePdfOutlined, 
    SaveOutlined, 
    PlusOutlined, 
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function SubmissionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [submission, setSubmission] = useState(null);
    const [templateSchema, setTemplateSchema] = useState([]);
    const [formData, setFormData] = useState({});
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');

    const [currentUser, setCurrentUser] = useState(null);
    const [auditNotes, setAuditNotes] = useState('');
    const [workflowSaving, setWorkflowSaving] = useState(false);

    useEffect(() => {
        fetchCurrentUser();
        fetchSubmission();
    }, [id]);

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get('/forms/users/me');
            setCurrentUser(res.data);
        } catch (err) {
            console.error('Failed to fetch current user');
        }
    };

    const fetchSubmission = async () => {
        try {
            const res = await api.get(`/forms/submissions/${id}`);
            const sub = res.data;
            setSubmission(sub);
            
            // Parse schema
            let parsed = [];
            if (sub.template?.schema) {
                if (Array.isArray(sub.template.schema)) {
                    parsed = sub.template.schema;
                } else if (typeof sub.template.schema === 'string') {
                    try { parsed = JSON.parse(sub.template.schema); } catch(e){}
                }
            }
            setTemplateSchema(parsed);
            
            // Init formData
            setFormData(sub.data || {});
            
        } catch (err) {
            console.error('Error fetching submission detail:', err);
            setError('Failed to load submission details');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = async () => {
        try {
            const res = await api.get(`/forms/submissions/${id}/export_pdf`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `submission_${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting PDF:', err);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccessMsg('');
        try {
            await api.put(`/forms/submissions/${id}`, {
                ...submission,
                data: formData,
                status: 'Updated',
                audit_notes: 'Updated form data'
            });
            setSuccessMsg('Submission updated successfully!');
            fetchSubmission();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error('Error saving submission:', err);
            setError('Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handleWorkflowAction = async (status) => {
        if (status === 'Reverted' && !auditNotes.trim()) {
            alert("Please provide a note explaining why this is being reverted.");
            return;
        }

        setWorkflowSaving(true);
        setError(null);
        setSuccessMsg('');
        
        try {
            await api.put(`/forms/submissions/${id}`, {
                ...submission,
                data: formData,
                status: status,
                audit_notes: auditNotes
            });
            setSuccessMsg(`Submission has been ${status.toLowerCase()}!`);
            setAuditNotes('');
            fetchSubmission();
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
            console.error(`Error changing status to ${status}:`, err);
            setError(`Failed to change status to ${status}.`);
        } finally {
            setWorkflowSaving(false);
        }
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleTableChange = (tableKey, rowIndex, colKey, value) => {
        setFormData(prev => {
            const tableData = Array.isArray(prev[tableKey]) ? [...prev[tableKey]] : [];
            if (!tableData[rowIndex]) tableData[rowIndex] = {};
            tableData[rowIndex][colKey] = value;
            return { ...prev, [tableKey]: tableData };
        });
    };

    const addTableRow = (tableKey) => {
        setFormData(prev => {
            const tableData = Array.isArray(prev[tableKey]) ? [...prev[tableKey]] : [];
            tableData.push({});
            return { ...prev, [tableKey]: tableData };
        });
    };

    const removeTableRow = (tableKey, rowIndex) => {
        setFormData(prev => {
            const tableData = Array.isArray(prev[tableKey]) ? [...prev[tableKey]] : [];
            tableData.splice(rowIndex, 1);
            return { ...prev, [tableKey]: tableData };
        });
    };

    const clearSignature = (key) => {
        if(window.confirm('Clear this signature? You can type a new one.')) {
            handleChange(key, '');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !submission) {
        return (
            <Box py={5} textAlign="center">
                <Typography color="error">{error}</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate('/submissions')}>Back to Submissions</Button>
            </Box>
        );
    }

    const isAdmin = currentUser?.role?.is_admin_override === 1;
    const isApproved = submission.status === 'Approved';

    return (
        <MainCard 
            title={`Submission #${id} - ${submission.template?.name || 'Unknown'}`} 
            secondary={
                <Box display="flex" gap={2}>
                    <Button 
                        variant="outlined" 
                        startIcon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/submissions')}
                    >
                        Back
                    </Button>
                    <Button 
                        variant="outlined" 
                        color="secondary" 
                        startIcon={<FilePdfOutlined />}
                        onClick={handleExportPdf}
                    >
                        PDF
                    </Button>
                    {!isApproved && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<SaveOutlined />}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                </Box>
            }
        >
            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                    <Typography variant="body1">
                        {submission.template?.department || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">Submitted By</Typography>
                    <Typography variant="body1">
                        {submission.user?.username || submission.employee?.username || 'Guest'}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">Date Submitted</Typography>
                    <Typography variant="body1">
                        {new Date(submission.created_at).toLocaleString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">Current Status</Typography>
                    <Typography variant="body1" fontWeight="bold" color={isApproved ? 'success.main' : submission.status === 'Reverted' ? 'error.main' : 'warning.main'}>
                        {submission.status}
                    </Typography>
                </Grid>
            </Grid>

            {isAdmin && !isApproved && (
                <Paper variant="outlined" sx={{ p: 3, mb: 4, bgcolor: '#f0f9ff', borderColor: '#bae0ff' }}>
                    <Typography variant="h6" color="primary.main" mb={2}>Admin Workflow Actions</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <TextField 
                                fullWidth 
                                label="Notes / Remarks" 
                                variant="outlined" 
                                size="small"
                                value={auditNotes}
                                onChange={(e) => setAuditNotes(e.target.value)}
                                placeholder="Optional for approval, required for reversion."
                                sx={{ bgcolor: 'white' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4} display="flex" gap={2}>
                            <Button 
                                variant="contained" 
                                color="success" 
                                startIcon={<CheckCircleOutlined />}
                                onClick={() => handleWorkflowAction('Approved')}
                                disabled={workflowSaving}
                                fullWidth
                            >
                                Approve
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                startIcon={<CloseCircleOutlined />}
                                onClick={() => handleWorkflowAction('Reverted')}
                                disabled={workflowSaving}
                                fullWidth
                            >
                                Revert
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            )}

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" mb={3}>Form Data</Typography>

            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2, bgcolor: '#fafafb', mb: 4 }}>
                <Grid container spacing={3}>
                    {templateSchema.map((field, idx) => {
                        const val = formData[field.name];
                        const isTable = field.type === 'table';

                        let inputElement = null;

                        switch (field.type) {
                            case 'text':
                            case 'number':
                            case 'date':
                            case 'time':
                                const isCheckedBy = (field.label || field.name).toLowerCase().includes('check') || (field.label || field.name).toLowerCase().includes('by');
                                inputElement = (
                                    <TextField
                                        fullWidth
                                        type={field.type === 'text' ? 'text' : field.type}
                                        value={val || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        disabled={isApproved}
                                        sx={{ bgcolor: isApproved ? '#f5f5f5' : 'white' }}
                                        InputProps={{
                                            endAdornment: isCheckedBy && currentUser && field.type === 'text' && !isApproved ? (
                                                <Button size="small" variant="text" sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }} onClick={() => handleChange(field.name, currentUser.username)}>
                                                    Fill Me
                                                </Button>
                                            ) : null
                                        }}
                                    />
                                );
                                break;
                            case 'boolean':
                                inputElement = (
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!val}
                                                onChange={(e) => handleChange(field.name, e.target.checked)}
                                                disabled={isApproved}
                                            />
                                        }
                                        label={field.label}
                                    />
                                );
                                break;
                            case 'select':
                                inputElement = (
                                    <TextField
                                        select
                                        fullWidth
                                        value={val || ''}
                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        disabled={isApproved}
                                        sx={{ bgcolor: isApproved ? '#f5f5f5' : 'white' }}
                                    >
                                        {(Array.isArray(field.options) ? field.options : []).map(opt => (
                                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                        ))}
                                    </TextField>
                                );
                                break;
                            case 'signature':
                                inputElement = (
                                    <Box p={2} border="1px dashed" borderColor="grey.400" borderRadius={1} bgcolor={isApproved ? '#f5f5f5' : 'white'}>
                                        {val && String(val).startsWith('data:image') ? (
                                            <Box>
                                                <img src={val} alt="Signature" style={{ maxHeight: '100px', display: 'block', marginBottom: '10px' }} />
                                                {!isApproved && (
                                                    <Button size="small" variant="outlined" color="error" onClick={() => clearSignature(field.name)}>
                                                        Clear Image
                                                    </Button>
                                                )}
                                            </Box>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                label="Type Signature"
                                                value={val || ''}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                disabled={isApproved}
                                                sx={{ input: { fontFamily: 'cursive', fontSize: '1.2rem' } }}
                                            />
                                        )}
                                    </Box>
                                );
                                break;
                            case 'table':
                                const cols = field.columns || [];
                                const rows = Array.isArray(val) ? val : [];
                                inputElement = (
                                    <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: isApproved ? '#f5f5f5' : 'white' }}>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: 'grey.100' }}>
                                                <TableRow>
                                                    {cols.map((c, i) => <TableCell key={i} sx={{ fontWeight: 'bold' }}>{c.label || c.name}</TableCell>)}
                                                    {!isApproved && <TableCell align="center" width={50}><b>Action</b></TableCell>}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {rows.map((row, rIdx) => (
                                                    <TableRow key={rIdx}>
                                                        {cols.map((c, i) => {
                                                            const cellVal = row[c.name] || '';
                                                            
                                                            let cellInput = null;
                                                            if (c.type === 'boolean') {
                                                                cellInput = <Checkbox checked={!!cellVal} onChange={(e) => handleTableChange(field.name, rIdx, c.name, e.target.checked)} size="small" disabled={isApproved}/>;
                                                            } else if (c.type === 'select') {
                                                                cellInput = (
                                                                    <TextField
                                                                        select
                                                                        size="small"
                                                                        value={cellVal}
                                                                        onChange={(e) => handleTableChange(field.name, rIdx, c.name, e.target.value)}
                                                                        sx={{ minWidth: 100 }}
                                                                        disabled={isApproved}
                                                                    >
                                                                        {(Array.isArray(c.options) ? c.options : []).map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                                                                    </TextField>
                                                                );
                                                            } else {
                                                                cellInput = (
                                                                    <TextField
                                                                        size="small"
                                                                        type={c.type === 'text' ? 'text' : c.type}
                                                                        value={cellVal}
                                                                        onChange={(e) => handleTableChange(field.name, rIdx, c.name, e.target.value)}
                                                                        sx={{ minWidth: c.type === 'date' || c.type === 'time' ? 140 : 100 }}
                                                                        disabled={isApproved}
                                                                    />
                                                                );
                                                            }
                                                            return <TableCell key={i}>{cellInput}</TableCell>;
                                                        })}
                                                        {!isApproved && (
                                                            <TableCell align="center">
                                                                <IconButton color="error" size="small" onClick={() => removeTableRow(field.name, rIdx)}>
                                                                    <DeleteOutlined fontSize="small" />
                                                                </IconButton>
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                ))}
                                                {!isApproved && (
                                                    <TableRow>
                                                        <TableCell colSpan={cols.length + 1} align="center">
                                                            <Button startIcon={<PlusOutlined />} onClick={() => addTableRow(field.name)} size="small">
                                                                Add Row
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                );
                                break;
                            default:
                                inputElement = <Typography color="error">Unsupported field type</Typography>;
                        }

                        return (
                            <Grid item xs={12} sm={isTable ? 12 : 6} md={isTable ? 12 : 6} key={field.name}>
                                {field.type !== 'boolean' && (
                                    <Typography variant="subtitle2" mb={1} color="textSecondary">
                                        {field.label || field.name}
                                        {field.required && <span style={{ color: 'red' }}> *</span>}
                                    </Typography>
                                )}
                                {inputElement}
                            </Grid>
                        );
                    })}

                    {templateSchema.length === 0 && (
                        <Grid item xs={12}>
                            <Typography color="textSecondary" align="center">This template has no schema defined.</Typography>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {submission.audits && submission.audits.length > 0 && (
                <Box>
                    <Typography variant="h6" mb={2}>Audit Timeline</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        {submission.audits.map((audit, idx) => (
                            <Box key={audit.id} display="flex" mb={idx === submission.audits.length - 1 ? 0 : 2} borderBottom={idx === submission.audits.length - 1 ? 'none' : '1px solid #f0f0f0'} pb={2}>
                                <Box minWidth={150}>
                                    <Typography variant="body2" color="textSecondary">{new Date(audit.created_at).toLocaleString()}</Typography>
                                    <Typography variant="subtitle2" color="primary">{audit.user?.username || 'System'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="body1" fontWeight={500}>{audit.action}</Typography>
                                    {audit.notes && <Typography variant="body2" color="textSecondary">{audit.notes}</Typography>}
                                </Box>
                            </Box>
                        ))}
                    </Paper>
                </Box>
            )}
        </MainCard>
    );
}
