const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Genre Mapping (TMDB returns IDs, we need names)
const genreMap = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
    27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
    10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics'
};

const getGenreName = (genreIds) => {
    if (!genreIds || genreIds.length === 0) return 'Genre';
    return genreMap[genreIds[0]] || 'Genre';
};

// Formats TMDB raw data into the structure our StreamVerse UI expects
export const formatTMDBData = (item) => {
    const isTV = item.media_type === 'tv' || !item.title;
    const title = isTV ? item.name || item.original_name : item.title || item.original_title;
    const releaseDate = isTV ? item.first_air_date : item.release_date;
    const year = releaseDate ? releaseDate.split('-')[0] : '';

    return {
        id: item.id.toString(),
        title: title,
        description: item.overview,
        thumbnail: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        banner: item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : null,
        genre: getGenreName(item.genre_ids),
        rating: item.vote_average ? item.vote_average.toFixed(1) : 'NR',
        year: year,
        type: isTV ? 'series' : 'movie',
        popularity: item.popularity,
    };
};

// Core fetch helper
const fetchFromTMDB = async (endpoint, params = {}) => {
    try {
        const queryParams = new URLSearchParams({
            api_key: API_KEY,
            ...params
        });
        const res = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
        if (!res.ok) throw new Error(`TMDB API Error: ${res.status}`);
        const data = await res.json();
        return data.results ? data.results.map(formatTMDBData) : data;
    } catch (error) {
        console.error("TMDB Fetch Error:", error);
        return [];
    }
};

// Exported standard endpoints
export const fetchTrendingAll = () => fetchFromTMDB('/trending/all/day');
export const fetchTrendingMovies = () => fetchFromTMDB('/trending/movie/day');
export const fetchTrendingShows = () => fetchFromTMDB('/trending/tv/day');
export const fetchTopRatedMovies = () => fetchFromTMDB('/movie/top_rated');
export const fetchPopularMovies = () => fetchFromTMDB('/movie/popular');
export const fetchActionMovies = () => fetchFromTMDB('/discover/movie', { with_genres: '28' });
export const fetchComedyMovies = () => fetchFromTMDB('/discover/movie', { with_genres: '35' });
export const fetchHorrorMovies = () => fetchFromTMDB('/discover/movie', { with_genres: '27' });

// Get detailed info for a single movie/show (useful for VideoPlayer page)
export const fetchDetails = async (id, type = 'movie') => {
    try {
        const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,credits`);
        if (!res.ok) throw new Error(`TMDB API Error: ${res.status}`);
        const data = await res.json();

        let videoUrl = null;
        if (data.videos && data.videos.results.length > 0) {
            // Try to find a trailer, otherwise take the first video
            const trailer = data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const videoId = trailer ? trailer.key : data.videos.results[0].key;
            videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }

        const formatted = formatTMDBData(data);
        return {
            ...formatted,
            videoUrl: videoUrl,
            runtime: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : null,
        };
    } catch (error) {
        console.error("fetchDetails error:", error);
        return null;
    }
};
