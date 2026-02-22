import { useState, useEffect, useCallback, useRef } from 'react';
import { discoverContent } from '../api/tmdb';
import { discoverSports } from '../api/sports';
import { useContentContext } from '../contexts/ContentContext';

export function usePaginatedContent(categoryType, filters, sortBy) {
    const { globalLanguage } = useContentContext();
    const [data, setData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [error, setError] = useState(null);
    const [errorIndexLink, setErrorIndexLink] = useState(null);

    const debounceTimer = useRef(null);

    const fetchInitial = useCallback(async (isMounted) => {
        try {
            if (isMounted) {
                setLoading(true);
                setError(null);
                setErrorIndexLink(null);
                setPage(1);
            }

            let results, totalCount, totalPages;

            if (categoryType === 'sports') {
                const sportsData = await discoverSports(1);
                results = sportsData.results;
                totalCount = sportsData.totalCount;
                totalPages = sportsData.totalPages;
            } else {
                const tmdbData = await discoverContent(categoryType, 1, filters, sortBy, globalLanguage);
                results = tmdbData.results;
                totalCount = tmdbData.totalCount;
                totalPages = tmdbData.totalPages;
            }

            if (isMounted) {
                setData(results);
                setTotalCount(totalCount);
                setHasMore(1 < totalPages);
            }
        } catch (err) {
            if (isMounted) {
                console.error("Error fetching content:", err);
                setError(err.message);
            }
        } finally {
            if (isMounted) setLoading(false);
        }
    }, [categoryType, filters.genre, filters.minRating, filters.releaseYearRange?.start, filters.releaseYearRange?.end, sortBy, globalLanguage]);

    useEffect(() => {
        let isMounted = true;

        // Reset state immediately on dependency change before debounce
        setData([]);
        setHasMore(true);
        setLoading(true);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchInitial(isMounted);
        }, 300); // 300ms debounce for rapid filter clicks

        return () => {
            isMounted = false;
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [fetchInitial]);

    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore || loading) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;

            let results, totalPages;

            if (categoryType === 'sports') {
                const sportsData = await discoverSports(nextPage);
                results = sportsData.results;
                totalPages = sportsData.totalPages;
            } else {
                const tmdbData = await discoverContent(categoryType, nextPage, filters, sortBy, globalLanguage);
                results = tmdbData.results;
                totalPages = tmdbData.totalPages;
            }

            setData(prev => [...prev, ...results]);
            setPage(nextPage);
            setHasMore(nextPage < totalPages);

        } catch (err) {
            console.error("Error loading more docs", err);
        } finally {
            setLoadingMore(false);
        }
    }, [hasMore, loadingMore, loading, page, categoryType, filters, sortBy]);

    return { data, totalCount, loading, loadingMore, hasMore, loadMore, error, errorIndexLink };
}
