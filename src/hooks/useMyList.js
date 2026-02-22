import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toggleMyList, checkInMyList } from '../lib/firestoreService';

export default function useMyList(contentId) {
    const { user } = useAuth();
    const [inList, setInList] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !contentId) {
            setLoading(false);
            return;
        }

        const fetchStatus = async () => {
            try {
                const status = await checkInMyList(contentId, user.uid);
                setInList(status);
            } catch (err) {
                console.error('[useMyList] check error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [contentId, user]);

    const handleToggleList = async (e) => {
        if (e) e.stopPropagation();
        if (!user) return;

        // Optimistic update
        const prevStatus = inList;
        setInList(!prevStatus);

        try {
            const newStatus = await toggleMyList(contentId, user.uid);
            setInList(newStatus);
        } catch (err) {
            console.error('[useMyList] toggle error:', err);
            setInList(prevStatus); // rollback
        }
    };

    return { inList, loading, handleToggleList };
}
