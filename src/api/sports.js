import axios from 'axios';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

// Create axes instance for SportsDB
const sportsApi = axios.create({
    baseURL: BASE_URL
});

/**
 * Normalizes TheSportsDB data into StreamVerse format
 */
export const formatSportsData = (event, isPast = false) => {
    return {
        id: event.idEvent,
        title: event.strEvent,
        description: `League: ${event.strLeague} | Date: ${event.dateEvent || 'TBA'} | Time: ${event.strTime || 'TBA'}`,
        thumbnail: event.strThumb || event.strSquare || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80',
        banner: event.strThumb || 'https://image.tmdb.org/t/p/original/tT1zVbLz4GZ7rX15B4d0i3sI6xW.jpg',
        rating: 'NR', // Sports typically don't have TMDB ratings
        year: event.dateEvent ? event.dateEvent.split('-')[0] : '',
        type: 'sports',
        genre: event.strSport || 'Sports',
        matchDate: event.dateEvent,

        // Sports specific fields
        homeTeam: event.strHomeTeam,
        awayTeam: event.strAwayTeam,
        homeBadge: event.strHomeTeamBadge,
        awayBadge: event.strAwayTeamBadge,
        homeScore: event.intHomeScore,
        awayScore: event.intAwayScore,
        status: event.strStatus,
        videoUrl: event.strVideo ? extractYouTubeEmbed(event.strVideo) : null,
        isPast
    };
};

/**
 * Converts a standard YouTube URL into an embeddable format
 */
const extractYouTubeEmbed = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` : null;
};

/**
 * Fetch Upcoming Matches for a specific League
 * Default: 4328 (English Premier League)
 */
export const fetchNextMatches = async (leagueId = '4328') => {
    try {
        const response = await sportsApi.get(`/eventsnextleague.php?id=${leagueId}`);
        if (response.data && response.data.events) {
            return response.data.events.map(event => formatSportsData(event, false));
        }
        return [];
    } catch (error) {
        console.error(`Error fetching next matches for league ${leagueId}:`, error);
        return [];
    }
};

/**
 * Fetch Past Matches/Highlights for a specific League
 * Default: 4328 (English Premier League)
 */
export const fetchPastMatches = async (leagueId = '4328') => {
    try {
        const response = await sportsApi.get(`/eventspastleague.php?id=${leagueId}`);
        if (response.data && response.data.events) {
            return response.data.events.map(event => formatSportsData(event, true));
        }
        return [];
    } catch (error) {
        console.error(`Error fetching past matches for league ${leagueId}:`, error);
        return [];
    }
};

/**
 * Generalized Discover function for the Paginated Hook
 */
export const discoverSports = async (page = 1) => {
    try {
        // TheSportsDB free tier doesn't support complex pagination for simple endpoints.
        // For a seamless integration into our existing hook, we'll fetch both past and next
        // and combine them as our "discoverable" universe of sports items.

        // Usually, 'discover' would take parameters, but we'll adapt for this specific API integration.
        // We are defaulting to English Premier League (4328) for consistent, rich data with highlights.

        const [pastEvents, nextEvents] = await Promise.all([
            fetchPastMatches('4328'),
            fetchNextMatches('4328')
        ]);

        // Combine them. If we need pagination, we're returning everything in page 1 for now on free tier.
        const allEvents = [...pastEvents, ...nextEvents];

        return {
            results: page === 1 ? allEvents : [], // Only return results on page 1 for this mocked pagination
            totalCount: allEvents.length,
            totalPages: 1
        };

    } catch (error) {
        console.error("Error discovering sports content:", error);
        return { results: [], totalCount: 0, totalPages: 0 };
    }
};

/**
 * Fetch specific event details for the VideoPlayer Highlights
 */
export const fetchSportsDetails = async (eventId) => {
    try {
        const response = await sportsApi.get(`/lookupevent.php?id=${eventId}`);
        if (response.data && response.data.events) {
            const event = response.data.events[0];
            return formatSportsData(event, true);
        }
        return null;
    } catch (error) {
        console.error(`Error fetching sports details for event ${eventId}:`, error);
        return null;
    }
};
