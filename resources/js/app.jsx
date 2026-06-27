import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TemplatesList from './pages/TemplatesList';
import TemplateBuilder from './pages/TemplateBuilder';
import SubmissionsList from './pages/SubmissionsList';
import SubmissionDetail from './pages/SubmissionDetail';

const theme = createTheme({
    palette: {
        primary: {
            main: '#f4511e',
            light: '#ff844c',
            dark: '#b91400',
        },
        secondary: {
            main: '#1e293b', // Slate 800
        },
        background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
        }
    },
    typography: {
        fontFamily: '"Outfit", "Helvetica", "Arial", sans-serif',
        h6: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        }
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(244, 81, 30, 0.2)',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                }
            }
        }
    }
});

// Auth Guard
const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    {/* Protected Admin Routes */}
                    <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>}>
                        <Route index element={<Navigate to="/templates" replace />} />
                        <Route path="templates" element={<TemplatesList />} />
                        <Route path="templates/create" element={<TemplateBuilder />} />
                        <Route path="templates/:id/edit" element={<TemplateBuilder />} />
                        <Route path="submissions" element={<SubmissionsList />} />
                        <Route path="submissions/:id" element={<SubmissionDetail />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
