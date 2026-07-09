// sw.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Escuta os agendamentos vindos do index.html
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'scheduleNotification') {
        const { title, options, timestamp } = event.data;

        if (typeof TimestampTrigger !== 'undefined') {
            event.waitUntil(
                self.registration.showNotification(title, {
                    ...options,
                    showTrigger: new TimestampTrigger(timestamp)
                })
            );
        } else {
            const delay = timestamp - Date.now();
            if (delay > 0) {
                setTimeout(() => {
                    self.registration.showNotification(title, options);
                }, delay);
            }
        }
    }
});
