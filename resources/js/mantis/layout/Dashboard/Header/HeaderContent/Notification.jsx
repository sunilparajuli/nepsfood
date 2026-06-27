import { useRef, useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';
import api from 'api/axios';
import { onMessageListener } from 'utils/firebase';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function Notification() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
      try {
          const res = await api.get('/forms/notifications');
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.is_read).length);
      } catch (err) {
          console.error('Failed to fetch notifications', err);
      }
  };

  useEffect(() => {
      fetchNotifications();
      
      // Listen for background/foreground firebase messages
      const listenForPush = async () => {
          try {
              const payload = await onMessageListener();
              if (payload && payload.notification) {
                  // Prepend the new notification
                  setNotifications(prev => [{
                      id: Date.now(),
                      title: payload.notification.title,
                      body: payload.notification.body,
                      is_read: false,
                      created_at: new Date().toISOString()
                  }, ...prev]);
                  setUnreadCount(prev => prev + 1);
                  
                  // Keep listening
                  listenForPush();
              }
          } catch (err) {
              // Ignore timeout or abort errors
          }
      };
      
      listenForPush();
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleMarkAllRead = () => {
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({...n, is_read: true})));
      // You could also make an API call here to update the backend
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent'
        })}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme) => ({ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {unreadCount > 0 && (
                        <Tooltip title="Mark as all read">
                          <IconButton color="success" size="small" onClick={handleMarkAllRead}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      maxHeight: 400,
                      overflowY: 'auto',
                      '& .MuiListItemButton-root': {
                        py: 1,
                        px: 2,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' },
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    {notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText primary={<Typography color="textSecondary" align="center">No notifications yet.</Typography>} />
                        </ListItem>
                    ) : notifications.map((n) => (
                        <ListItem
                          key={n.id}
                          component={ListItemButton}
                          divider
                          selected={!n.is_read}
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                              <MessageOutlined />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6">
                                {n.title}
                              </Typography>
                            }
                            secondary={
                                <Box display="flex" flexDirection="column">
                                    <Typography variant="body2">{n.body}</Typography>
                                    <Typography variant="caption" color="textSecondary" mt={0.5}>
                                        {n.created_at ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true }) : 'Just now'}
                                    </Typography>
                                </Box>
                            }
                          />
                        </ListItem>
                    ))}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
