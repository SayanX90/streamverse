// import { useState, useEffect, useCallback, useRef } from 'react';
// import { discoverContent } from '../api/tmdb';
// import { discoverSports } from '../api/sports';
// import { fetchMusic } from '../services/musicApi';
// import { useContentContext } from '../contexts/ContentContext';

// export function usePaginatedContent(categoryType, filters, sortBy) {
//     const { globalLanguage } = useContentContext();
//     const [data, setData] = useState([]);
//     const [totalCount, setTotalCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [loadingMore, setLoadingMore] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const [page, setPage] = useState(1);
//     const [error, setError] = useState(null);
//     const [errorIndexLink, setErrorIndexLink] = useState(null);

//     const debounceTimer = useRef(null);

//     const fetchInitial = useCallback(async (isMounted) => {
//         try {
//             if (isMounted) {
//                 setLoading(true);
//                 setError(null);
//                 setErrorIndexLink(null);
//                 setPage(1);
//             }

//             let results, totalCount, totalPages;

//             if (categoryType === 'sports') {
//                 const sportsData = await discoverSports(1);
//                 results = sportsData.results;
//                 totalCount = sportsData.totalCount;
//                 totalPages = sportsData.totalPages;
//             } else if (categoryType === 'music') {
//                 const langLabel = globalLanguage === 'hi' ? 'Hindi' : globalLanguage === 'bn' ? 'Bengali' : globalLanguage === 'en' ? 'English' : '';
//                 const genreSearch = filters.genre !== 'All' ? filters.genre : (langLabel ? '' : 'top');
//                 const finalSearch = [langLabel, genreSearch].filter(Boolean).join(' ') || 'top';

//                 const musicData = await fetchMusic(finalSearch, 0, 30);
//                 // Format iTunes results to match StreamVerse format
//                 results = musicData.results.map(track => ({
//                     id: track.trackId.toString(),
//                     title: track.trackName,
//                     subtitle: track.artistName,
//                     thumbnail: track.artworkUrl100?.replace('100x100bb', '400x400bb') || track.artworkUrl100,
//                     year: track.releaseDate ? track.releaseDate.split('-')[0] : '',
//                     type: 'music',
//                     audioUrl: track.previewUrl,
//                     genre: track.primaryGenreName
//                 }));
//                 totalCount = musicData.resultCount;
//                 totalPages = Math.ceil(totalCount / 30);
//             } else {
//                 const tmdbData = await discoverContent(categoryType, 1, filters, sortBy, globalLanguage);
//                 results = tmdbData.results;
//                 totalCount = tmdbData.totalCount;
//                 totalPages = tmdbData.totalPages;
//             }

//             if (isMounted) {
//                 setData(results);
//                 setTotalCount(totalCount);
//                 setHasMore(1 < totalPages);
//             }
//         } catch (err) {
//             if (isMounted) {
//                 console.error("Error fetching content:", err);
//                 setError(err.message);
//             }
//         } finally {
//             if (isMounted) setLoading(false);
//         }
//     }, [categoryType, filters.genre, filters.minRating, filters.releaseYearRange?.start, filters.releaseYearRange?.end, sortBy, globalLanguage]);

//     useEffect(() => {
//         let isMounted = true;

//         // Reset state immediately on dependency change before debounce
//         setData([]);
//         setHasMore(true);
//         setLoading(true);

//         if (debounceTimer.current) {
//             clearTimeout(debounceTimer.current);
//         }

//         debounceTimer.current = setTimeout(() => {
//             fetchInitial(isMounted);
//         }, 300); // 300ms debounce for rapid filter clicks

//         return () => {
//             isMounted = false;
//             if (debounceTimer.current) {
//                 clearTimeout(debounceTimer.current);
//             }
//         };
//     }, [fetchInitial]);

//     const loadMore = useCallback(async () => {
//         if (!hasMore || loadingMore || loading) return;

//         try {
//             setLoadingMore(true);
//             const nextPage = page + 1;

//             let results, totalPages;

//             if (categoryType === 'sports') {
//                 const sportsData = await discoverSports(nextPage);
//                 results = sportsData.results;
//                 totalPages = sportsData.totalPages;
//             } else if (categoryType === 'music') {
//                 const langLabel = globalLanguage === 'hi' ? 'Hindi' : globalLanguage === 'bn' ? 'Bengali' : globalLanguage === 'en' ? 'English' : '';
//                 const genreSearch = filters.genre !== 'All' ? filters.genre : (langLabel ? '' : 'top');
//                 const finalSearch = [langLabel, genreSearch].filter(Boolean).join(' ') || 'top';

//                 const musicData = await fetchMusic(finalSearch, nextPage, 30);
//                 results = musicData.results.map(track => ({
//                     id: track.trackId.toString(),
//                     title: track.trackName,
//                     subtitle: track.artistName,
//                     thumbnail: track.artworkUrl100?.replace('100x100bb', '400x400bb') || track.artworkUrl100,
//                     year: track.releaseDate ? track.releaseDate.split('-')[0] : '',
//                     type: 'music',
//                     audioUrl: track.previewUrl,
//                     genre: track.primaryGenreName
//                 }));
//                 totalPages = Math.ceil(musicData.resultCount / 30);
//             } else {
//                 const tmdbData = await discoverContent(categoryType, nextPage, filters, sortBy, globalLanguage);
//                 results = tmdbData.results;
//                 totalPages = tmdbData.totalPages;
//             }

//             setData(prev => [...prev, ...results]);
//             setPage(nextPage);
//             setHasMore(nextPage < totalPages);

//         } catch (err) {
//             console.error("Error loading more docs", err);
//         } finally {
//             setLoadingMore(false);
//         }
//     }, [hasMore, loadingMore, loading, page, categoryType, filters, sortBy]);

//     return { data, totalCount, loading, loadingMore, hasMore, loadMore, error, errorIndexLink };
// }


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

    const debounceTimer = useRef(null);

    // 🔥 INITIAL LOAD
    const fetchInitial = useCallback(async (isMounted) => {
        try {
            if (isMounted) {
                setLoading(true);
                setError(null);
                setTotalCount(0); // Reset count immediately
                setPage(1);
            }

            let results = [];
            let totalPages = 1;

            if (categoryType === 'sports') {
                const sportsData = await discoverSports(1);
                results = sportsData.results;
                totalPages = sportsData.totalPages;
                setTotalCount(sportsData.totalCount);
            }

            else {
                const tmdbData = await discoverContent(
                    categoryType,
                    1,
                    filters,
                    sortBy,
                    globalLanguage
                );

                results = tmdbData.results;
                totalPages = tmdbData.totalPages;
                setTotalCount(tmdbData.totalCount);
            }

            if (isMounted) {
                setData(results);
                setHasMore(1 < totalPages);
            }

        } catch (err) {
            if (isMounted) {
                console.error("Initial fetch error:", err);
                setError(err.message);
            }
        } finally {
            if (isMounted) setLoading(false);
        }

    }, [categoryType, filters, sortBy, globalLanguage]);

    useEffect(() => {
        let isMounted = true;

        setData([]);
        setHasMore(true);
        setLoading(true);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            fetchInitial(isMounted);
        }, 300);

        return () => {
            isMounted = false;
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [fetchInitial]);

    // 🔥 LOAD MORE
    const loadMore = useCallback(async () => {
        if (!hasMore || loadingMore || loading) return;

        try {
            setLoadingMore(true);
            const nextPage = page + 1;

            let results = [];
            let totalPages = 1;

            if (categoryType === 'sports') {
                const sportsData = await discoverSports(nextPage);
                results = sportsData.results;
                totalPages = sportsData.totalPages;
            }

            else {
                const tmdbData = await discoverContent(
                    categoryType,
                    nextPage,
                    filters,
                    sortBy,
                    globalLanguage
                );

                results = tmdbData.results;
                totalPages = tmdbData.totalPages;
            }

            setData(prev => [...prev, ...results]);
            setPage(nextPage);
            setHasMore(nextPage < totalPages);

        } catch (err) {
            console.error("Load more error:", err);
        } finally {
            setLoadingMore(false);
        }

    }, [hasMore, loadingMore, loading, page, categoryType, filters, sortBy, globalLanguage]);

    return {
        data,
        totalCount,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        error
    };
}

