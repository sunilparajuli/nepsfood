import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Typography,
    TextField,
    MenuItem,
    Grid,
    IconButton,
    Divider,
    Paper,
    FormControlLabel,
    Checkbox,
    Stack,
    Chip
} from '@mui/material';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import MainCard from 'components/MainCard';

const FIELD_TYPES = ['text', 'number', 'boolean', 'select', 'date', 'time', 'signature', 'table'];
const COLUMN_TYPES = ['text', 'number', 'boolean', 'date', 'time', 'signature', 'select'];

export default function TemplateBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [version, setVersion] = useState('1.0');
    const [issueDate, setIssueDate] = useState('');
    const [layoutType, setLayoutType] = useState('standard');
    const [instructions, setInstructions] = useState('');
    const [fields, setFields] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditing) {
            fetchTemplate();
        }
    }, [id]);

    const fetchTemplate = async () => {
        try {
            const res = await api.get(`/forms/templates/${id}`);
            const data = res.data;
            setName(data.name);
            setDepartment(data.department);
            setVersion(data.version);
            setIssueDate(data.issue_date ? data.issue_date.split('T')[0] : '');
            setLayoutType(data.layout_type || 'standard');
            setInstructions(data.instructions || '');
            
            let parsed = [];
            if (data.schema) {
                if (Array.isArray(data.schema)) {
                    parsed = data.schema;
                } else if (typeof data.schema === 'string') {
                    try { parsed = JSON.parse(data.schema); } catch(e){}
                }
            }
            setFields(parsed);
        } catch (err) {
            console.error('Error fetching template:', err);
            setError('Failed to load template');
        }
    };

    const addField = () => {
        setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
    };

    const removeField = (index) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const updateField = (index, key, value) => {
        const newFields = [...fields];
        newFields[index][key] = value;
        setFields(newFields);
    };

    const addColumn = (fieldIndex) => {
        const newFields = [...fields];
        const cols = newFields[fieldIndex].columns || [];
        cols.push({ name: '', label: '', type: 'text' });
        newFields[fieldIndex].columns = cols;
        setFields(newFields);
    };

    const updateColumn = (fieldIndex, colIndex, key, value) => {
        const newFields = [...fields];
        newFields[fieldIndex].columns[colIndex][key] = value;
        setFields(newFields);
    };

    const removeColumn = (fieldIndex, colIndex) => {
        const newFields = [...fields];
        newFields[fieldIndex].columns = newFields[fieldIndex].columns.filter((_, i) => i !== colIndex);
        setFields(newFields);
    };

    const handleSave = async () => {
        setError(null);
        try {
            const payload = {
                name,
                department,
                version,
                issue_date: issueDate,
                layout_type: layoutType,
                instructions,
                schema: fields
            };

            if (isEditing) {
                await api.put(`/forms/templates/${id}`, payload);
            } else {
                await api.post('/forms/templates', payload);
            }
            navigate('/templates');
        } catch (err) {
            console.error('Error saving template:', err);
            setError('Failed to save template. Check console for details.');
        }
    };

    return (
        <MainCard title={isEditing ? 'Edit Template' : 'Create Template'} secondary={
            <Button 
                variant="contained" 
                color="primary" 
                startIcon={<SaveOutlined />}
                onClick={handleSave}
            >
                Save Template
            </Button>
        }>
            {error && <Typography color="error" mb={2}>{error}</Typography>}
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Template Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Version"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Issue Date"
                        InputLabelProps={{ shrink: true }}
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <TextField
                        select
                        fullWidth
                        label="Layout Type"
                        value={layoutType}
                        onChange={(e) => setLayoutType(e.target.value)}
                        variant="outlined"
                    >
                        <MenuItem value="standard">Standard</MenuItem>
                        <MenuItem value="log">Log Layout (A4 Tabular)</MenuItem>
                    </TextField>
                </Grid>
                {layoutType === 'log' && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Check / Instructions (Bottom Text)"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            variant="outlined"
                            helperText="This text will be displayed below the table."
                        />
                    </Grid>
                )}
            </Grid>

            <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Fields</Typography>
                <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<PlusOutlined />}
                    onClick={addField}
                >
                    Add Field
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {fields.map((field, index) => (
                <Paper key={index} elevation={1} sx={{ p: 3, mb: 3, position: 'relative' }}>
                    <IconButton 
                        color="error" 
                        onClick={() => removeField(index)}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                        <DeleteOutlined />
                    </IconButton>
                    <Grid container spacing={3} mt={1}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Field Name (Key)"
                                value={field.name}
                                onChange={(e) => updateField(index, 'name', e.target.value.replace(/\s+/g, '_').toLowerCase())}
                                helperText="Used as JSON key (no spaces)"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Field Label"
                                value={field.label}
                                onChange={(e) => updateField(index, 'label', e.target.value)}
                                helperText="e.g. 'Current Temperature'"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Field Type"
                                value={field.type}
                                onChange={(e) => updateField(index, 'type', e.target.value)}
                            >
                                {FIELD_TYPES.map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option.toUpperCase()}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        
                        <Grid item xs={12} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={field.required}
                                        onChange={(e) => updateField(index, 'required', e.target.checked)}
                                    />
                                }
                                label="Required Field"
                            />
                        </Grid>

                        {layoutType === 'log' && (
                            <Grid item xs={12} md={4}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={field.is_footer_field || false}
                                            onChange={(e) => updateField(index, 'is_footer_field', e.target.checked)}
                                        />
                                    }
                                    label="Render as Footer Field (at bottom)"
                                />
                            </Grid>
                        )}

                        {field.type === 'select' && (
                            <Grid item xs={12} md={8}>
                                <TextField
                                    fullWidth
                                    label="Options (Comma separated)"
                                    value={Array.isArray(field.options) ? field.options.join(', ') : field.options || ''}
                                    onChange={(e) => updateField(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                                    helperText="e.g. 'Yes, No, N/A'"
                                />
                            </Grid>
                        )}
                        
                        {field.type === 'table' && (
                            <Grid item xs={12}>
                                <Box p={2} bgcolor="grey.50" borderRadius={1} border="1px solid" borderColor="grey.200">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="subtitle2">Table Columns</Typography>
                                        <Button size="small" variant="outlined" startIcon={<PlusOutlined />} onClick={() => addColumn(index)}>
                                            Add Column
                                        </Button>
                                    </Box>
                                    <Stack spacing={2}>
                                        {(field.columns || []).map((col, colIdx) => (
                                            <Box key={colIdx} display="flex" gap={2} alignItems="center">
                                                <TextField 
                                                    size="small" 
                                                    label="Column Key" 
                                                    value={col.name} 
                                                    onChange={(e) => updateColumn(index, colIdx, 'name', e.target.value.replace(/\s+/g, '_').toLowerCase())} 
                                                />
                                                <TextField 
                                                    size="small" 
                                                    label="Column Label" 
                                                    value={col.label} 
                                                    onChange={(e) => updateColumn(index, colIdx, 'label', e.target.value)} 
                                                />
                                                <TextField 
                                                    select 
                                                    size="small" 
                                                    label="Type" 
                                                    value={col.type || 'text'} 
                                                    onChange={(e) => updateColumn(index, colIdx, 'type', e.target.value)}
                                                    sx={{ minWidth: 120 }}
                                                >
                                                    {COLUMN_TYPES.map(opt => <MenuItem key={opt} value={opt}>{opt.toUpperCase()}</MenuItem>)}
                                                </TextField>
                                                
                                                {col.type === 'select' && (
                                                    <TextField
                                                        size="small"
                                                        label="Options (Comma separated)"
                                                        value={Array.isArray(col.options) ? col.options.join(', ') : col.options || ''}
                                                        onChange={(e) => updateColumn(index, colIdx, 'options', e.target.value.split(',').map(s => s.trim()))}
                                                    />
                                                )}
                                                <IconButton color="error" size="small" onClick={() => removeColumn(index, colIdx)}>
                                                    <DeleteOutlined fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        {!(field.columns?.length) && <Typography variant="body2" color="textSecondary">No columns defined.</Typography>}
                                    </Stack>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            ))}
            {fields.length === 0 && (
                <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
                    No fields added yet. Click "Add Field" to start building your template.
                </Typography>
            )}
        </MainCard>
    );
}
