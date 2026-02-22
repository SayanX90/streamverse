import { useState, useEffect } from 'react';
import { fetchWatchHistory } from '../lib/firestoreService';
import { useAuth } from '../contexts/AuthContext';

// useWatchHistory: returns the signed-in user's watch history
// Returns: { history, historyLoading }
export function useWatchHistory(limitCount = 20) {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            setHistory([]);
            return;
        }
        let active = true;
        setHistoryLoading(true);
        fetchWatchHistory(user.uid, limitCount)
            .then((data) => { if (active) setHistory(data); })
            .catch((err) => console.error('[useWatchHistory]', err))
            .finally(() => { if (active) setHistoryLoading(false); });
        return () => { active = false; };
    }, [user, limitCount]);

    return { history, historyLoading };
}
