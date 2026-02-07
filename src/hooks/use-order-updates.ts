'use client';

import { useEffect, useState } from 'react';

export function useOrderUpdates(orderId: number, initialStatus: string) {
    const [status, setStatus] = useState(initialStatus);
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) return;

        // Only start SSE if order is not terminal
        if (initialStatus === 'delivered' || initialStatus === 'cancelled') return;

        const eventSource = new EventSource(`/api/sse?orderId=${orderId}`);

        eventSource.onopen = () => {
            console.log('SSE Connected');
        };

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.status) {
                    setStatus(data.status);
                    setLastUpdate(data.timestamp);
                }
            } catch (e) {
                console.error('SSE Parse Error', e);
            }
        };

        eventSource.onerror = (e) => {
            console.error('SSE Error', e);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [orderId, initialStatus]);

    return { status, lastUpdate };
}
