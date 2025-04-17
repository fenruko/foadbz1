// Service worker for handling push notifications

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Listen for push notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.message,
      icon: '/icon.png',
      badge: '/badge.png',
      data: {
        url: self.registration.scope
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'}).then(function(clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle message from the app (used to trigger notifications from Firebase events)
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'notification') {
    const notificationData = event.data.notification;
    
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: '/icon.png',
      badge: '/badge.png'
    });
  }
});