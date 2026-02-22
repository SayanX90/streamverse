import { useState, useEffect, useCallback } from 'react';
import { checkLiked, toggleLike } from '../lib/firestoreService';
import { useAuth } from '../contexts/AuthContext';

// useLike: manages liked state for a single content item
// Returns: { liked, likeLoading, handleToggleLike }
export function useLike(contentId) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // Check initial liked state when user or contentId changes
    useEffect(() => {
        if (!user || !contentId) {
            setLiked(false);
            return;
        }
        let active = true;
        checkLiked(contentId, user.uid).then((result) => {
            if (active) setLiked(result);
        });
        return () => { active = false; };
    }, [contentId, user]);

    const handleToggleLike = useCallback(async (e) => {
        e?.stopPropagation();
        if (!user) return; // silently guard — UI should prompt login instead
        if (likeLoading) return;

        setLikeLoading(true);
        // Optimistic update
        setLiked(prev => !prev);
        try {
            const isNowLiked = await toggleLike(contentId, user.uid);
            setLiked(isNowLiked);
        } catch (err) {
            console.error('[useLike] toggleLike failed:', err);
            setLiked(prev => !prev); // rollback
        } finally {
            setLikeLoading(false);
        }
    }, [contentId, user, likeLoading]);

    return { liked, likeLoading, handleToggleLike };
}
