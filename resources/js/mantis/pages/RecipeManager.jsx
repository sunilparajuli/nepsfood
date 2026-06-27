import React, { useEffect, useState } from 'react';
import { 
    Button, Box, Typography, Grid, Paper, IconButton, TextField, 
    Dialog, DialogTitle, DialogContent, DialogActions, Breadcrumbs, Link
} from '@mui/material';
import { FolderOutlined, FileImageOutlined, FilePdfOutlined, UploadOutlined, PlusOutlined, DeleteOutlined, DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import api from '../api/axios';
import MainCard from 'components/MainCard';

export default function RecipeManager() {
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Root' }]);

    // Dialogs
    const [folderDialogOpen, setFolderDialogOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    useEffect(() => {
        fetchFolders();
        fetchFiles();
    }, [currentFolderId]);

    const fetchFolders = async () => {
        try {
            const res = await api.get('/forms/folders');
            let data = res.data;
            if (currentFolderId) {
                data = data.filter(f => f.parent_id === currentFolderId);
            } else {
                data = data.filter(f => !f.parent_id);
            }
            setFolders(data);
        } catch (err) {
            console.error('Error fetching folders:', err);
        }
    };

    const fetchFiles = async () => {
        try {
            const res = await api.get('/forms/files');
            let data = res.data;
            if (currentFolderId) {
                data = data.filter(f => f.folder_id === currentFolderId);
            } else {
                data = data.filter(f => !f.folder_id);
            }
            setFiles(data);
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    };

    const handleCreateFolder = async () => {
        try {
            await api.post('/forms/folders', { name: newFolderName, parent_id: currentFolderId });
            setFolderDialogOpen(false);
            setNewFolderName('');
            fetchFolders();
        } catch (err) {
            console.error('Error creating folder:', err);
        }
    };

    const handleDeleteFolder = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Delete folder and all its contents?')) {
            try {
                await api.delete(`/forms/folders/${id}`);
                fetchFolders();
            } catch (err) {
                console.error('Error deleting folder:', err);
            }
        }
    };

    // Preview State
    const [previewFile, setPreviewFile] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File must be smaller than 5MB');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                await api.post('/forms/files', {
                    title: file.name,
                    file: reader.result,
                    folder_id: currentFolderId
                });
                await fetchFiles();
            } catch (err) {
                console.error('Error uploading file:', err);
            } finally {
                e.target.value = ''; // Reset input so same file can be uploaded again if needed
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteFile = async (id) => {
        if (window.confirm('Delete this file?')) {
            try {
                await api.delete(`/forms/files/${id}`);
                fetchFiles();
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }
    };

    const handlePreviewFile = async (id) => {
        try {
            const res = await api.get(`/forms/files/${id}`);
            setPreviewFile(res.data);
        } catch (err) {
            console.error('Error fetching file for preview:', err);
        }
    };

    const enterFolder = (folder) => {
        setCurrentFolderId(folder.id);
        setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
    };

    const navigateBreadcrumb = (index) => {
        const target = breadcrumbs[index];
        setCurrentFolderId(target.id);
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    const handleRefresh = () => {
        fetchFolders();
        fetchFiles();
    };

    return (
        <MainCard 
            title="Recipe & Document Manager"
            secondary={
                <Box display="flex" gap={2}>
                    <IconButton color="primary" onClick={handleRefresh} title="Refresh Files">
                        <ReloadOutlined />
                    </IconButton>
                    <Button variant="outlined" startIcon={<PlusOutlined />} onClick={() => setFolderDialogOpen(true)}>
                        New Folder
                    </Button>
                    <Button variant="contained" component="label" startIcon={<UploadOutlined />}>
                        Upload Recipe
                        <input type="file" hidden onChange={handleFileUpload} />
                    </Button>
                </Box>
            }
        >
            <Box mb={3} p={1.5} bgcolor="grey.50" borderRadius={1} border="1px solid" borderColor="grey.200">
                <Breadcrumbs aria-label="breadcrumb">
                    {breadcrumbs.map((crumb, index) => (
                        <Link
                            key={index}
                            color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
                            underline={index === breadcrumbs.length - 1 ? 'none' : 'hover'}
                            onClick={() => navigateBreadcrumb(index)}
                            sx={{ cursor: index === breadcrumbs.length - 1 ? 'default' : 'pointer' }}
                        >
                            {crumb.name}
                        </Link>
                    ))}
                </Breadcrumbs>
            </Box>

            <Grid container spacing={3}>
                {folders.map(folder => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`folder-${folder.id}`}>
                        <Paper 
                            elevation={0} 
                            variant="outlined" 
                            sx={{ p: 2, display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'grey.50' } }}
                            onClick={() => enterFolder(folder)}
                        >
                            <FolderOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '16px' }} />
                            <Typography variant="subtitle1" sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {folder.name}
                            </Typography>
                            <IconButton size="small" color="error" onClick={(e) => handleDeleteFolder(e, folder.id)}>
                                <DeleteOutlined />
                            </IconButton>
                        </Paper>
                    </Grid>
                ))}

                {files.map(file => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`file-${file.id}`}>
                        <Paper elevation={0} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', position: 'relative' }}>
                            {file.title.toLowerCase().includes('pdf') ? (
                                <FilePdfOutlined style={{ fontSize: '24px', color: '#f5222d', marginRight: '16px' }} />
                            ) : (
                                <FileImageOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: '16px' }} />
                            )}
                            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                                <Typography variant="subtitle2" noWrap title={file.title}>{file.title}</Typography>
                            </Box>
                            <Box display="flex" ml={1}>
                                <IconButton size="small" color="primary" onClick={() => handlePreviewFile(file.id)}>
                                    <DownloadOutlined />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => handleDeleteFile(file.id)}>
                                    <DeleteOutlined />
                                </IconButton>
                            </Box>
                        </Paper>
                    </Grid>
                ))}

                {folders.length === 0 && files.length === 0 && (
                    <Grid item xs={12}>
                        <Box py={5} textAlign="center">
                            <Typography color="textSecondary">This folder is empty.</Typography>
                        </Box>
                    </Grid>
                )}
            </Grid>

            <Dialog open={folderDialogOpen} onClose={() => setFolderDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Create Folder</DialogTitle>
                <DialogContent>
                    <Box mt={1}>
                        <TextField
                            fullWidth
                            label="Folder Name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            autoFocus
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateFolder} variant="contained" color="primary">Create</Button>
                </DialogActions>
            </Dialog>

            {/* File Preview Dialog */}
            <Dialog open={!!previewFile} onClose={() => setPreviewFile(null)} maxWidth="lg" fullWidth>
                <DialogTitle>{previewFile?.title}</DialogTitle>
                <DialogContent dividers sx={{ height: '70vh', p: 0, overflow: 'hidden' }}>
                    {previewFile && previewFile.title.toLowerCase().includes('pdf') ? (
                        <object data={previewFile.file} type="application/pdf" width="100%" height="100%">
                            <p>Unable to display PDF file. <a href={previewFile.file} download={previewFile.title}>Download</a> instead.</p>
                        </object>
                    ) : (
                        previewFile && (
                            <Box display="flex" justifyContent="center" alignItems="center" height="100%" bgcolor="#000">
                                <img src={previewFile.file} alt={previewFile.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </Box>
                        )
                    )}
                </DialogContent>
                <DialogActions>
                    {previewFile && (
                        <Button 
                            variant="outlined" 
                            onClick={() => {
                                const a = document.createElement('a');
                                a.href = previewFile.file;
                                a.download = previewFile.title;
                                a.click();
                            }}
                        >
                            Download File
                        </Button>
                    )}
                    <Button onClick={() => setPreviewFile(null)} variant="contained" color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
}
