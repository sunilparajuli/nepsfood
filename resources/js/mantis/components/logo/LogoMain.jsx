import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import api from '../../../api/axios';

// ==============================|| LOGO MAIN ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  const [logoBase64, setLogoBase64] = useState(null);
  const [appName, setAppName] = useState('');

  useEffect(() => {
    // Attempt to get from session storage first for performance
    const cachedLogo = sessionStorage.getItem('app_logo');
    const cachedName = sessionStorage.getItem('app_name');
    if (cachedLogo || cachedName) {
      setLogoBase64(cachedLogo !== 'null' ? cachedLogo : null);
      setAppName(cachedName || 'Food Safety App');
    }
    
    // Always fetch latest in background
    api.get('/forms/settings')
      .then(res => {
        if (res.data.app_logo_base64) {
          setLogoBase64(res.data.app_logo_base64);
          sessionStorage.setItem('app_logo', res.data.app_logo_base64);
        } else {
          setLogoBase64(null);
          sessionStorage.setItem('app_logo', 'null');
        }
        if (res.data.app_name) {
          setAppName(res.data.app_name);
          sessionStorage.setItem('app_name', res.data.app_name);
        }
      })
      .catch(err => console.error('Logo fetch error', err));
  }, []);

  if (logoBase64) {
    return <img src={logoBase64} alt={appName} style={{ maxHeight: '40px', maxWidth: '200px' }} />;
  }

  // Fallback to text if no logo is provided
  return (
    <h2 style={{ margin: 0, color: theme.vars.palette.primary.main, fontFamily: 'Arial, sans-serif' }}>
      {appName || 'Food Safety App'}
    </h2>
  );
}
