importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Dynamically fetch config for background worker
fetch('/api/forms/firebase-config')
  .then(response => response.json())
  .then(config => {
      if (config && config.apiKey) {
          firebase.initializeApp(config);
          const messaging = firebase.messaging();
          
          messaging.onBackgroundMessage((payload) => {
              console.log('[firebase-messaging-sw.js] Received background message ', payload);
              const notificationTitle = payload.notification.title;
              const notificationOptions = {
                  body: payload.notification.body,
              };

              self.registration.showNotification(notificationTitle, notificationOptions);
          });
      }
  })
  .catch(err => console.error('SW Config Fetch Error', err));
