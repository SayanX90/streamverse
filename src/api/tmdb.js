import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Exported standard image base URLs as requested
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Create an axios instance
const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    }
});

/**
 * Normalizes TMDB data to StreamVerse format
 */
export const formatMovieData = (item) => {
    // Determine release year
    const releaseDate = item.release_date || item.first_air_date;
    const year = releaseDate ? releaseDate.split('-')[0] : '';

    // Determine title
    const title = item.title || item.original_title || item.name || item.original_name;

    return {
        id: item.id.toString(),
        title: title,
        description: item.overview,
        thumbnail: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        banner: item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : null,
        rating: item.vote_average ? item.vote_average.toFixed(1) : 'NR',
        year: year,
        type: item.media_type === 'tv' ? 'series' : 'movie',
        genre: 'Genre', // Can map this later if needed
    };
};

/**
 * Fetch Popular Movies
 * endpoint: /movie/popular
 */
export const fetchPopularMovies = async (language = 'All') => {
    try {
        if (language !== 'All') {
            const params = {
                with_original_language: language,
                sort_by: 'popularity.desc'
            };
            if (['hi', 'bn'].includes(language)) params.region = 'IN';

            const response = await tmdbApi.get('/discover/movie', { params });
            return response.data.results.map(formatMovieData);
        }

        const response = await tmdbApi.get('/movie/popular');
        return response.data.results.map(formatMovieData);
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }
};

/**
 * Fetch Trending Movies
 * endpoint: /trending/movie/day
 */
export const fetchTrendingMovies = async (language = 'All') => {
    try {
        if (language !== 'All') {
            const params = {
                with_original_language: language,
                sort_by: 'popularity.desc',
                'primary_release_date.lte': new Date().toISOString().split('T')[0]
            };
            if (['hi', 'bn'].includes(language)) params.region = 'IN';

            const response = await tmdbApi.get('/discover/movie', { params });
            return response.data.results.map(formatMovieData);
        }

        const response = await tmdbApi.get('/trending/movie/day');
        return response.data.results.map(formatMovieData);
    } catch (error) {
        console.error("Error fetching trending movies:", error);
        return [];
    }
};

/**
 * Fetch Top Bollywood Movies
 * endpoint: /discover/movie with regional params
 */
export const fetchTopBollywood = async () => {
    try {
        const params = {
            with_original_language: 'hi',
            region: 'IN',
            sort_by: 'popularity.desc',
            page: 1
        };
        const response = await tmdbApi.get('/discover/movie', { params });
        return response.data.results.map(formatMovieData);
    } catch (error) {
        console.error("Error fetching Top Bollywood movies:", error);
        return [];
    }
};

/**
 * Search Movies
 * endpoint: /search/movie
 */
export const searchMovies = async (query) => {
    if (!query) return [];
    try {
        const response = await tmdbApi.get(`/search/movie`, {
            params: { query }
        });
        return response.data.results.map(formatMovieData);
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};

/**
 * Fetch Trailer for a specific Movie
 * endpoint: /movie/{movie_id}/videos
 */
export const fetchMovieTrailer = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}/videos`);
        const videos = response.data.results;

        // Find YouTube trailer where type === "Trailer" and site === "YouTube"
        const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');

        if (trailer) {
            return `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        }

        // Fallback: Just get the first available youtube video if no exact "Trailer" type exists
        const fallbackVideo = videos.find(v => v.site === 'YouTube');
        if (fallbackVideo) {
            return `https://www.youtube.com/embed/${fallbackVideo.key}?autoplay=1`;
        }

        return null;
    } catch (error) {
        console.error(`Error fetching trailer for movie ${movieId}:`, error);
        return null; // Return null if fetching fails or no videos
    }
};

/**
 * Fetch Details for a specific Movie including trailer
 * endpoint: /movie/{movie_id}
 */
export const fetchDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: { append_to_response: 'videos' }
        });
        const data = response.data;

        let videoUrl = null;
        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            if (trailer) {
                videoUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
            } else {
                const fallback = data.videos.results.find(v => v.site === 'YouTube');
                if (fallback) videoUrl = `https://www.youtube.com/embed/${fallback.key}?autoplay=1`;
            }
        }

        const formatted = formatMovieData(data);
        return {
            ...formatted,
            videoUrl,
            runtime: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : '120m',
        };
    } catch (error) {
        console.error(`Error fetching details for movie ${movieId}:`, error);
        return null;
    }
};

/**
 * Discover Content (Movies or TV) with advanced filtering and pagination
 * Endpoint: /discover/movie or /discover/tv
 */
export const discoverContent = async (categoryType = 'movie', page = 1, filters = {}, sortBy = 'popularity-desc', language = 'All') => {
    try {
        const isSeries = categoryType === 'series';
        const endpoint = isSeries ? '/discover/tv' : '/discover/movie';

        let sortParam = 'popularity.desc';
        if (sortBy) {
            const [field, dir] = sortBy.split('-');
            if (field === 'rating') sortParam = `vote_average.${dir}`;
            else if (field === 'releaseYear') sortParam = isSeries ? `first_air_date.${dir}` : `primary_release_date.${dir}`;
            else sortParam = `popularity.${dir}`;
        }

        const params = {
            page,
            sort_by: sortParam,
            include_adult: false,
            include_video: false
        };

        if (language && language !== 'All') {
            params.with_original_language = language;
            if (['hi', 'bn'].includes(language)) {
                params.region = 'IN'; // Ensure accurate regional results for Indian languages
            }
        }

        // Handle specific top-level category overrides
        if (categoryType === 'music') {
            params.with_genres = '10402'; // TMDB Movie Genre ID for Music
        } else if (categoryType === 'sports') {
            params.with_keywords = '6075'; // TMDB Keyword ID for Sport
        }

        // Map local genre names to TMDB genre IDs
        const genreMap = {
            'Action': 28, 'Adventure': 12, 'Animation': 16, 'Comedy': 35, 'Crime': 80,
            'Documentary': 99, 'Drama': 18, 'Family': 10751, 'Fantasy': 14, 'History': 36,
            'Horror': 27, 'Music': 10402, 'Mystery': 9648, 'Romance': 10749, 'Science Fiction': 878, 'Sci-Fi': 878,
            'TV Movie': 10770, 'Thriller': 53, 'War': 10752, 'Western': 37
        };

        if (filters.genre && filters.genre !== 'All' && genreMap[filters.genre]) {
            if (params.with_genres) {
                // If we already have a genre (like Music), append the new one using comma (OR) or pipe (AND)
                params.with_genres = `${params.with_genres},${genreMap[filters.genre]}`;
            } else {
                params.with_genres = genreMap[filters.genre];
            }
        }

        if (filters.minRating > 0) {
            params['vote_average.gte'] = filters.minRating;
            params['vote_count.gte'] = 100; // Require some votes for accurate sorting
        }

        if (filters.releaseYearRange) {
            if (isSeries) {
                params['first_air_date.gte'] = `${filters.releaseYearRange.start}-01-01`;
                params['first_air_date.lte'] = `${filters.releaseYearRange.end}-12-31`;
            } else {
                params['primary_release_date.gte'] = `${filters.releaseYearRange.start}-01-01`;
                params['primary_release_date.lte'] = `${filters.releaseYearRange.end}-12-31`;
            }
        }

        const response = await tmdbApi.get(endpoint, { params });
        const results = response.data.results.map(item => ({ ...item, media_type: isSeries ? 'tv' : 'movie' })).map(formatMovieData);

        return {
            results,
            totalCount: response.data.total_results,
            totalPages: response.data.total_pages
        };
    } catch (error) {
        console.error("Error discovering content:", error);
        return { results: [], totalCount: 0, totalPages: 0 };
    }
};
