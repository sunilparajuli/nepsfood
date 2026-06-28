import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import api from '../../../../../api/axios';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/forms/users/me').then(res => {
        setCurrentUser(res.data);
        setLoading(false);
    }).catch(() => {
        setLoading(false);
    });
  }, []);

  if (loading) {
    return <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>;
  }

  const role = currentUser?.role || {};
  const isAdmin = !!role.is_admin_override || !!currentUser?.is_superuser;

  const filteredItems = menuItem.items.map(group => {
    if (group.id === 'group-dashboard' && group.children) {
        const filteredChildren = group.children.filter(item => {
            if (isAdmin) return true;
            
            switch (item.id) {
                case 'templates':
                    return !!role.can_manage_templates;
                case 'users':
                    return !!role.can_manage_users;
                case 'roles':
                    return !!role.can_manage_roles;
                case 'settings':
                case 'notification-settings':
                    return false;
                default:
                    return true;
            }
        });
        return { ...group, children: filteredChildren };
    }
    return group;
  });

  const navGroups = filteredItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" sx={{ color: 'error.main', textAlign: 'center' }}>
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
