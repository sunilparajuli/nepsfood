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
    Alert,
    Autocomplete
} from '@mui/material';
import { PlusOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function NewSubmission() {
    const navigate = useNavigate();
    
    const [templates, setTemplates] = useState([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');
    const [templateSchema, setTemplateSchema] = useState([]);
    const [formData, setFormData] = useState({});
    
    const [loadingTemplates, setLoadingTemplates] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        api.get('/forms/users/me').then(res => setCurrentUser(res.data)).catch(() => {});
    }, []);

    // Fetch all available templates
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await api.get('/forms/templates');
                setTemplates(res.data);
            } catch (err) {
                console.error('Error fetching templates:', err);
                setError('Failed to load templates.');
            } finally {
                setLoadingTemplates(false);
            }
        };
        fetchTemplates();
    }, []);

    // When template selection changes, parse schema and reset formData
    useEffect(() => {
        if (!selectedTemplateId) {
            setTemplateSchema([]);
            setFormData({});
            return;
        }

        const template = templates.find(t => t.id === selectedTemplateId);
        if (template) {
            let parsed = [];
            if (template.schema) {
                if (Array.isArray(template.schema)) {
                    parsed = template.schema;
                } else if (typeof template.schema === 'string') {
                    try { parsed = JSON.parse(template.schema); } catch(e){}
                }
            }
            setTemplateSchema(parsed);
            
            // Initialize formData
            const initialData = {};
            parsed.forEach(field => {
                if (field.type === 'table') {
                    initialData[field.name] = []; // Start with empty table
                } else if (field.type === 'boolean') {
                    initialData[field.name] = false;
                } else {
                    initialData[field.name] = '';
                }
            });
            setFormData(initialData);
            setError(null);
        }
    }, [selectedTemplateId, templates]);

    const handleSubmit = async () => {
        if (!selectedTemplateId) return;
        
        const template = templates.find(t => t.id === selectedTemplateId);
        if (!template) return;

        setSubmitting(true);
        setError(null);
        try {
            await api.post(`/forms/submissions`, {
                form_id: 'SUB-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                template_id: selectedTemplateId,
                department: template.department || 'General',
                status: 'Pending',
                data: formData
            });
            navigate('/submissions');
        } catch (err) {
            console.error('Error creating submission:', err);
            setError('Failed to submit form. Please check your data.');
        } finally {
            setSubmitting(false);
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
        handleChange(key, '');
    };

    if (loadingTemplates) {
        return (
            <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <MainCard title="New Submission">
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            
            <Box mb={4} maxWidth={600}>
                <Typography variant="subtitle2" mb={1} color="textSecondary">Select a Template to Fill</Typography>
                <Autocomplete
                    fullWidth
                    options={templates}
                    getOptionLabel={(option) => `${option.name} (${option.department})`}
                    value={templates.find(t => t.id === selectedTemplateId) || null}
                    onChange={(event, newValue) => {
                        setSelectedTemplateId(newValue ? newValue.id : '');
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Search and Choose Form Template" variant="outlined" />
                    )}
                />
            </Box>

            {selectedTemplateId && templateSchema.length > 0 && (
                <>
                    <Divider sx={{ mb: 4 }} />
                    <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2, bgcolor: '#fafafb', mb: 3 }}>
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
                                                sx={{ bgcolor: 'white' }}
                                                InputProps={{
                                                    endAdornment: isCheckedBy && currentUser && field.type === 'text' ? (
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
                                                sx={{ bgcolor: 'white' }}
                                            >
                                                {(Array.isArray(field.options) ? field.options : []).map(opt => (
                                                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                                                ))}
                                            </TextField>
                                        );
                                        break;
                                    case 'signature':
                                        inputElement = (
                                            <Box p={2} border="1px dashed" borderColor="grey.400" borderRadius={1} bgcolor="white">
                                                {val && String(val).startsWith('data:image') ? (
                                                    <Box>
                                                        <img src={val} alt="Signature" style={{ maxHeight: '100px', display: 'block', marginBottom: '10px' }} />
                                                        <Button size="small" variant="outlined" color="error" onClick={() => clearSignature(field.name)}>
                                                            Clear Image
                                                        </Button>
                                                    </Box>
                                                ) : (
                                                    <TextField
                                                        fullWidth
                                                        label="Type Signature"
                                                        placeholder="Sign by typing your name"
                                                        value={val || ''}
                                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                                        variant="outlined"
                                                        size="small"
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
                                            <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'white' }}>
                                                <Table size="small">
                                                    <TableHead sx={{ bgcolor: 'grey.100' }}>
                                                        <TableRow>
                                                            {cols.map((c, i) => <TableCell key={i} sx={{ fontWeight: 'bold' }}>{c.label || c.name}</TableCell>)}
                                                            <TableCell align="center" width={50}><b>Action</b></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {rows.map((row, rIdx) => (
                                                            <TableRow key={rIdx}>
                                                                {cols.map((c, i) => {
                                                                    const cellVal = row[c.name] || '';
                                                                    
                                                                    let cellInput = null;
                                                                    if (c.type === 'boolean') {
                                                                        cellInput = <Checkbox checked={!!cellVal} onChange={(e) => handleTableChange(field.name, rIdx, c.name, e.target.checked)} size="small" />;
                                                                    } else if (c.type === 'select') {
                                                                        cellInput = (
                                                                            <TextField
                                                                                select
                                                                                size="small"
                                                                                value={cellVal}
                                                                                onChange={(e) => handleTableChange(field.name, rIdx, c.name, e.target.value)}
                                                                                sx={{ minWidth: 100 }}
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
                                                                            />
                                                                        );
                                                                    }
                                                                    return <TableCell key={i}>{cellInput}</TableCell>;
                                                                })}
                                                                <TableCell align="center">
                                                                    <IconButton color="error" size="small" onClick={() => removeTableRow(field.name, rIdx)}>
                                                                        <DeleteOutlined fontSize="small" />
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow>
                                                            <TableCell colSpan={cols.length + 1} align="center">
                                                                <Button startIcon={<PlusOutlined />} onClick={() => addTableRow(field.name)} size="small">
                                                                    Add Row
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
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
                        </Grid>
                    </Paper>

                    <Box display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<SendOutlined />}
                            onClick={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Form'}
                        </Button>
                    </Box>
                </>
            )}
        </MainCard>
    );
}
