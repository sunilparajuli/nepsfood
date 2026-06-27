import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Button, 
    Paper, 
    TextField, 
    Typography, 
    Grid,
    IconButton,
    MenuItem,
    Divider,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const FIELD_TYPES = ['text', 'number', 'boolean', 'select'];

export default function TemplateBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [version, setVersion] = useState('1.0');
    
    // Schema structure: { static_fields: [...], dynamic_fields: [...] }
    // Based on the app's requirements, maybe just an array of fields under dynamic_fields is enough
    const [dynamicFields, setDynamicFields] = useState([]);
    const [staticFields, setStaticFields] = useState([
        { name: 'date', label: 'Date', type: 'text' },
        { name: 'time', label: 'Time', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' }
    ]);

    useEffect(() => {
        if (isEdit) {
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
            
            const schema = typeof data.schema === 'string' ? JSON.parse(data.schema) : data.schema;
            if (schema) {
                if (schema.dynamic_fields) setDynamicFields(schema.dynamic_fields);
                if (schema.static_fields) setStaticFields(schema.static_fields);
            }
        } catch (err) {
            console.error('Error fetching template:', err);
        }
    };

    const handleAddField = () => {
        setDynamicFields([
            ...dynamicFields,
            { name: '', label: '', type: 'text', required: false, options: '' }
        ]);
    };

    const handleRemoveField = (index) => {
        const newFields = [...dynamicFields];
        newFields.splice(index, 1);
        setDynamicFields(newFields);
    };

    const handleFieldChange = (index, key, value) => {
        const newFields = [...dynamicFields];
        newFields[index][key] = value;
        setDynamicFields(newFields);
    };

    const handleSave = async () => {
        const schema = {
            static_fields: staticFields,
            dynamic_fields: dynamicFields.map(f => ({
                ...f,
                // Convert comma-separated options to an array if it's a select field
                options: f.type === 'select' && typeof f.options === 'string' ? f.options.split(',').map(o => o.trim()) : f.options
            }))
        };

        const payload = {
            name,
            department,
            version,
            schema
        };

        try {
            if (isEdit) {
                await api.put(`/forms/templates/${id}`, payload);
            } else {
                await api.post('/forms/templates', payload);
            }
            navigate('/templates');
        } catch (err) {
            console.error('Error saving template:', err);
            alert('Failed to save template. Check console for details.');
        }
    };

    return (
        <Box maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    {isEdit ? 'Edit Template' : 'Create Template'}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                >
                    Save Template
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" mb={2}>General Info</Typography>
                        <TextField
                            fullWidth
                            label="Template Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Version"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            margin="normal"
                        />
                    </Paper>

                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>Static Fields</Typography>
                        <Typography variant="body2" color="textSecondary" mb={2}>
                            These fields appear at the top of the form (e.g. metadata).
                        </Typography>
                        {staticFields.map((field, idx) => (
                            <Box key={idx} mb={1} p={1} bgcolor="grey.100" borderRadius={1}>
                                <Typography variant="body2"><strong>{field.label}</strong> ({field.name})</Typography>
                            </Box>
                        ))}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Dynamic Fields (Table Columns / Schema)</Typography>
                            <Button 
                                variant="outlined" 
                                startIcon={<AddIcon />}
                                onClick={handleAddField}
                            >
                                Add Field
                            </Button>
                        </Box>
                        
                        {dynamicFields.length === 0 ? (
                            <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
                                No fields added yet. Click "Add Field" to start building your form schema.
                            </Typography>
                        ) : (
                            dynamicFields.map((field, idx) => (
                                <Box key={idx} mb={3} p={2} border={1} borderColor="grey.300" borderRadius={1} position="relative">
                                    <IconButton 
                                        color="error" 
                                        onClick={() => handleRemoveField(idx)}
                                        sx={{ position: 'absolute', top: 8, right: 8 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    
                                    <Grid container spacing={2} pr={5}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Field Name (Key)"
                                                size="small"
                                                value={field.name}
                                                onChange={(e) => handleFieldChange(idx, 'name', e.target.value.replace(/\s+/g, '_').toLowerCase())}
                                                helperText="Used as JSON key (no spaces)"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Label (Display Name)"
                                                size="small"
                                                value={field.label}
                                                onChange={(e) => handleFieldChange(idx, 'label', e.target.value)}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextField
                                                fullWidth
                                                select
                                                label="Field Type"
                                                size="small"
                                                value={field.type}
                                                onChange={(e) => handleFieldChange(idx, 'type', e.target.value)}
                                            >
                                                {FIELD_TYPES.map((t) => (
                                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        
                                        {field.type === 'select' && (
                                            <Grid item xs={12} sm={8}>
                                                <TextField
                                                    fullWidth
                                                    label="Options (Comma separated)"
                                                    size="small"
                                                    value={Array.isArray(field.options) ? field.options.join(', ') : field.options}
                                                    onChange={(e) => handleFieldChange(idx, 'options', e.target.value)}
                                                />
                                            </Grid>
                                        )}
                                        
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        checked={field.required}
                                                        onChange={(e) => handleFieldChange(idx, 'required', e.target.checked)}
                                                    />
                                                }
                                                label="Required Field"
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
