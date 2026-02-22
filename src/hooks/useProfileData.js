import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    fetchWatchStats,
    fetchWatchHistory,
    fetchUserContentList
} from '../lib/firestoreService';

export default function useProfileData() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ totalWatchTimeHours: 0, completedTitles: 0 });
    const [history, setHistory] = useState([]);
    const [myList, setMyList] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const [userStats, userHistory, userMyList, userFavourites] = await Promise.all([
                fetchWatchStats(user.uid),
                fetchWatchHistory(user.uid),
                fetchUserContentList(user.uid, 'myList'),
                fetchUserContentList(user.uid, 'likes'),
            ]);

            setStats(userStats);
            setHistory(userHistory);
            setMyList(userMyList);
            setFavourites(userFavourites);
        } catch (err) {
            console.error('[useProfileData] fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return {
        stats,
        history,
        myList,
        favourites,
        loading,
        refreshData
    };
}
