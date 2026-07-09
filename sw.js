// sw.js - Service Worker robusto para notificações em background
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Escuta requisições de agendamento vindas do index.html
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'scheduleNotification') {
        const { title, options, timestamp } = event.data;

        // Tenta usar a API nativa de triggers se disponível no dispositivo
        if (typeof TimestampTrigger !== 'undefined') {
            event.waitUntil(
                self.registration.showNotification(title, {
                    ...options,
                    showTrigger: new TimestampTrigger(timestamp)
                })
            );
        } else {
            // Fallback: Se o app estiver em background, calcula o delay e delega ao escopo estável do SW
            const delay = timestamp - Date.now();
            if (delay > 0) {
                setTimeout(() => {
                    self.registration.showNotification(title, options);
                }, delay);
            }
        }
    }
});
