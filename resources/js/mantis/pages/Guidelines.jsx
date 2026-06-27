import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import MainCard from 'components/MainCard';
import api from '../api/axios';

export default function Guidelines() {
    const [loading, setLoading] = useState(true);
    const [guidelinesBase64, setGuidelinesBase64] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGuidelines = async () => {
            try {
                const res = await api.get('/forms/settings');
                if (res.data.guidelines_base64) {
                    setGuidelinesBase64(res.data.guidelines_base64);
                } else {
                    setError('No guidelines document has been uploaded yet. Please contact the administrator.');
                }
            } catch (err) {
                console.error('Error fetching guidelines:', err);
                setError('Failed to load guidelines document.');
            } finally {
                setLoading(false);
            }
        };
        fetchGuidelines();
    }, []);

    if (loading) {
        return (
            <MainCard title="Data Entry Guidelines">
                <Box display="flex" justifyContent="center" p={5}>
                    <CircularProgress />
                </Box>
            </MainCard>
        );
    }

    if (error) {
        return (
            <MainCard title="Data Entry Guidelines">
                <Alert severity="warning">{error}</Alert>
            </MainCard>
        );
    }

    // Determine the mime type from the base64 string
    const isPdf = guidelinesBase64.startsWith('data:application/pdf');

    return (
        <MainCard title="Data Entry Guidelines" sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }} contentSX={{ flexGrow: 1, p: 0 }}>
            {isPdf ? (
                <iframe
                    src={guidelinesBase64}
                    title="Guidelines Document"
                    width="100%"
                    height="100%"
                    style={{ border: 'none', display: 'block' }}
                />
            ) : (
                <Box p={3} display="flex" justifyContent="center" alignItems="center" height="100%" bgcolor="#f5f5f5">
                    <img 
                        src={guidelinesBase64} 
                        alt="Guidelines" 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                </Box>
            )}
        </MainCard>
    );
}
