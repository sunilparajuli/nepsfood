import React, { useEffect, useState } from 'react';
import { 
    Button, TextField, Typography, Box, Grid, Paper, Snackbar, Alert 
} from '@mui/material';
import api from '../api/axios';
import MainCard from 'components/MainCard';
import { SaveOutlined } from '@ant-design/icons';

export default function NotificationSettings() {
    const [formData, setFormData] = useState({
        firebase_api_key: '',
        firebase_auth_domain: '',
        firebase_project_id: '',
        firebase_storage_bucket: '',
        firebase_messaging_sender_id: '',
        firebase_app_id: '',
        firebase_server_key: ''
    });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ open: false, message: '', type: 'success' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/forms/settings');
            const data = res.data;
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    firebase_api_key: data.firebase_api_key || '',
                    firebase_auth_domain: data.firebase_auth_domain || '',
                    firebase_project_id: data.firebase_project_id || '',
                    firebase_storage_bucket: data.firebase_storage_bucket || '',
                    firebase_messaging_sender_id: data.firebase_messaging_sender_id || '',
                    firebase_app_id: data.firebase_app_id || '',
                    firebase_server_key: data.firebase_server_key || ''
                }));
            }
        } catch (err) {
            console.error('Failed to load settings', err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // First fetch the latest settings to keep app_name etc intact
            const res = await api.get('/forms/settings');
            const currentData = res.data || {};
            
            await api.put('/forms/settings', {
                ...currentData,
                app_name: currentData.app_name || 'Food Safety App', // required by validation
                firebase_api_key: formData.firebase_api_key,
                firebase_auth_domain: formData.firebase_auth_domain,
                firebase_project_id: formData.firebase_project_id,
                firebase_storage_bucket: formData.firebase_storage_bucket,
                firebase_messaging_sender_id: formData.firebase_messaging_sender_id,
                firebase_app_id: formData.firebase_app_id,
                firebase_server_key: formData.firebase_server_key
            });
            setToast({ open: true, message: 'Push notification settings saved successfully!', type: 'success' });
            setTimeout(() => {
                window.location.reload(); // Reload to re-initialize firebase with new config
            }, 1000);
        } catch (err) {
            console.error(err);
            setToast({ open: true, message: 'Failed to save settings', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainCard title="Push Notification Settings">
            <Typography variant="body2" color="textSecondary" mb={3}>
                Configure Firebase Cloud Messaging (FCM) to enable real-time push notifications for administrators when new forms are submitted.
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" mb={2}>Firebase Web App Config</Typography>
                        
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField 
                                label="apiKey" 
                                name="firebase_api_key" 
                                value={formData.firebase_api_key} 
                                onChange={handleChange} 
                                fullWidth 
                            />
                            <TextField 
                                label="authDomain" 
                                name="firebase_auth_domain" 
                                value={formData.firebase_auth_domain} 
                                onChange={handleChange} 
                                fullWidth 
                            />
                            <TextField 
                                label="projectId" 
                                name="firebase_project_id" 
                                value={formData.firebase_project_id} 
                                onChange={handleChange} 
                                fullWidth 
                            />
                            <TextField 
                                label="storageBucket" 
                                name="firebase_storage_bucket" 
                                value={formData.firebase_storage_bucket} 
                                onChange={handleChange} 
                                fullWidth 
                            />
                            <TextField 
                                label="messagingSenderId" 
                                name="firebase_messaging_sender_id" 
                                value={formData.firebase_messaging_sender_id} 
                                onChange={handleChange} 
                                fullWidth 
                            />
                            <TextField 
                                label="appId" 
                                name="firebase_app_id" 
                                value={formData.firebase_app_id} 
                                onChange={handleChange} 
                                fullWidth 
                            />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" mb={2}>Firebase Server Key (FCM Legacy)</Typography>
                        <Typography variant="body2" color="textSecondary" mb={2}>
                            The server key is required by the Laravel backend to securely send push notifications to devices. You can find this in your Firebase Console under Project Settings {'>'} Cloud Messaging.
                        </Typography>
                        
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField 
                                label="Server Key" 
                                name="firebase_server_key" 
                                value={formData.firebase_server_key} 
                                onChange={handleChange} 
                                fullWidth 
                                multiline
                                rows={4}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="large" 
                    startIcon={<SaveOutlined />}
                    onClick={handleSave}
                    disabled={loading}
                >
                    Save Configuration
                </Button>
            </Box>

            <Snackbar open={toast.open} autoHideDuration={6000} onClose={() => setToast({ ...toast, open: false })}>
                <Alert severity={toast.type} onClose={() => setToast({ ...toast, open: false })}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
}
