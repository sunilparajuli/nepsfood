import React, { useEffect, useState } from 'react';
import { 
    Box, Typography, Button, Grid, TextField, Alert, Divider
} from '@mui/material';
import { SaveOutlined, UploadOutlined, FilePdfOutlined } from '@ant-design/icons';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function Settings() {
    const [settings, setSettings] = useState({
        app_name: '', app_logo_base64: '', guidelines_base64: '',
        smtp_host: '', smtp_port: '', smtp_user: '', smtp_pass: '', theme_color: '#1890ff'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/forms/settings');
            setSettings({
                app_name: res.data.app_name || '',
                app_logo_base64: res.data.app_logo_base64 || '',
                guidelines_base64: res.data.guidelines_base64 || '',
                smtp_host: res.data.smtp_host || '',
                smtp_port: res.data.smtp_port || '',
                smtp_user: res.data.smtp_user || '',
                smtp_pass: res.data.smtp_pass || '',
                theme_color: res.data.theme_color || '#1890ff'
            });
        } catch (err) {
            console.error('Error fetching settings:', err);
            setMessage({ type: 'error', text: 'Failed to load settings.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put('/forms/settings', settings);
            setMessage({ type: 'success', text: 'Settings updated successfully. Refresh the page to see branding changes.' });
        } catch (err) {
            console.error('Error saving settings:', err);
            setMessage({ type: 'error', text: 'Failed to save settings.' });
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'File size must be under 5MB' });
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    if (loading) return <Box p={3}><Typography>Loading...</Typography></Box>;

    return (
        <MainCard title="System Settings">
            {message.text && (
                <Alert severity={message.type} sx={{ mb: 3 }}>{message.text}</Alert>
            )}

            <Grid container spacing={4}>
                {/* Branding Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" mb={3} color="primary">Application Branding</Typography>
                    
                    <Box mb={3}>
                        <TextField fullWidth label="Application Name" name="app_name" value={settings.app_name} onChange={handleChange} variant="outlined" />
                    </Box>

                    <Box mb={3}>
                        <TextField fullWidth type="color" label="Theme Color" name="theme_color" value={settings.theme_color} onChange={handleChange} variant="outlined" />
                    </Box>

                    <Box mb={3}>
                        <Typography variant="subtitle2" mb={1} color="textSecondary">Application Logo</Typography>
                        {settings.app_logo_base64 && (
                            <Box mb={2} p={2} border="1px dashed" borderColor="grey.300" borderRadius={1} bgcolor="#f9f9f9">
                                <img src={settings.app_logo_base64} alt="App Logo" style={{ maxHeight: '100px', maxWidth: '100%' }} />
                            </Box>
                        )}
                        <Button variant="outlined" component="label" startIcon={<UploadOutlined />}>
                            Upload New Logo
                            <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'app_logo_base64')} />
                        </Button>
                        <Typography variant="caption" display="block" mt={1} color="textSecondary">
                            Recommended: PNG or SVG, max 2MB.
                        </Typography>
                    </Box>
                </Grid>

                {/* Email Section */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" mb={3} color="primary">SMTP Email Configuration</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <TextField fullWidth label="SMTP Host" name="smtp_host" value={settings.smtp_host} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField fullWidth label="Port" name="smtp_port" value={settings.smtp_port} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="SMTP Username" name="smtp_user" value={settings.smtp_user} onChange={handleChange} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth type="password" label="SMTP Password" name="smtp_pass" value={settings.smtp_pass} onChange={handleChange} />
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                </Grid>

                {/* Data Entry Guidelines Section */}
                <Grid item xs={12}>
                    <Typography variant="h5" mb={3} color="primary">Data Entry Guidelines</Typography>
                    <Typography variant="body2" mb={2} color="textSecondary">
                        Upload a global guideline document (PDF or DOCX) that users can reference when filling out forms.
                    </Typography>
                    
                    {settings.guidelines_base64 && (
                        <Box mb={2} display="flex" alignItems="center" gap={1} p={2} border="1px solid" borderColor="grey.300" borderRadius={1} bgcolor="#f0f9ff" width="fit-content">
                            <FilePdfOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <Typography>Guidelines Document Uploaded</Typography>
                        </Box>
                    )}
                    
                    <Button variant="outlined" component="label" startIcon={<UploadOutlined />}>
                        {settings.guidelines_base64 ? 'Replace Guidelines File' : 'Upload Guidelines File'}
                        <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'guidelines_base64')} />
                    </Button>
                </Grid>

                <Grid item xs={12} mt={2}>
                    <Button variant="contained" color="primary" size="large" startIcon={<SaveOutlined />} onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save All Settings'}
                    </Button>
                </Grid>
            </Grid>
        </MainCard>
    );
}
