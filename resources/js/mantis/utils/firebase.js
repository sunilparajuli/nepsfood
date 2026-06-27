import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import api from '../api/axios';

let app = null;
let messaging = null;

export const initFirebase = async () => {
    try {
        const res = await api.get('/forms/firebase-config');
        const config = res.data;

        if (config && config.apiKey) {
            app = initializeApp(config);
            messaging = getMessaging(app);
            console.log('Firebase initialized successfully.');
            return messaging;
        } else {
            console.warn('Firebase configuration not found in settings.');
            return null;
        }
    } catch (err) {
        console.error('Failed to initialize Firebase', err);
        return null;
    }
};

export const requestFirebaseNotificationPermission = async () => {
    if (!messaging) {
        messaging = await initFirebase();
    }
    
    if (!messaging) return;

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            const token = await getToken(messaging, { 
                // Using the default VAPID key handling or user provided vapidKey
                // vapidKey: '...' // Optional if testing locally without VAPID
            });
            if (token) {
                // Send token to backend
                await api.post('/forms/users/fcm-token', { fcm_token: token });
                console.log('FCM Token registered.');
            }
        }
    } catch (error) {
        console.error('An error occurred while retrieving token. ', error);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        if (messaging) {
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        }
    });
