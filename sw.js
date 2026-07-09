// sw.js - Código do Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Escuta comandos vindos do index.html
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'scheduleNotification') {
        const { title, options, timestamp } = event.data;

        // Se o navegador suportar o gatilho por tempo (TimestampTrigger)
        if ('TimestampTrigger' in self) {
            self.registration.showNotification(title, {
                ...options,
                showTrigger: new TimestampTrigger(timestamp)
            });
        } else {
            // Alternativa para navegadores sem suporte nativo ao Trigger:
            // Ele tenta agendar, mas pode falhar se o sistema congelar o sw muito rápido.
            const delay = timestamp - Date.now();
            if (delay > 0) {
                setTimeout(() => {
                    self.registration.showNotification(title, options);
                }, delay);
            }
        }
    }
});
