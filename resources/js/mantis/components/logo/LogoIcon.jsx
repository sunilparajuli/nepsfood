import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import api from '../../../api/axios';

// ==============================|| LOGO ICON ||============================== //

export default function LogoIcon() {
  const theme = useTheme();
  const [logoBase64, setLogoBase64] = useState(null);

  useEffect(() => {
    const cachedLogo = sessionStorage.getItem('app_logo');
    if (cachedLogo) {
      setLogoBase64(cachedLogo !== 'null' ? cachedLogo : null);
    }
    
    api.get('/forms/settings')
      .then(res => {
        if (res.data.app_logo_base64) {
          setLogoBase64(res.data.app_logo_base64);
          sessionStorage.setItem('app_logo', res.data.app_logo_base64);
        } else {
          setLogoBase64(null);
          sessionStorage.setItem('app_logo', 'null');
        }
      })
      .catch(err => console.error('Logo fetch error', err));
  }, []);

  if (logoBase64) {
    return <img src={logoBase64} alt="App Icon" style={{ maxHeight: '30px', maxWidth: '30px' }} />;
  }

  // Fallback default icon
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26.223 15.656L17.5 7L8.777 15.656L17.5 24.312L26.223 15.656Z"
        fill={theme.vars.palette.primary.main}
      />
    </svg>
  );
}
