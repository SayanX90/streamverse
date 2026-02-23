import axios from 'axios';

// Section keywords to fetch varied content
const SECTION_KEYWORDS = {
    'Trending Now': ['2025 hits', 'top charts', 'trending songs', 'viral hits'],
    'New Releases': ['new releases 2025', 'latest songs', 'fresh music'],
    'Top Hindi': ['hindi top hits', 'bollywood latest', 'arijit singh', 'hindi trending'],
    'International Hits': ['billboard hot 100', 'global hits', 'us pop', 'uk charts'],
    'Chill & Focus': ['lofi beats', 'ambient chill', 'study music', 'piano relax'],
    'Workout Mix': ['workout hits', 'gym motivation', 'pumping base', 'high energy cardio'],
    'Party Anthems': ['party mix', 'dance hits', 'club music', 'celebration songs'],
    'Retro Classics': ['90s hits', '80s pop', 'old is gold', 'classic rock']
};

/**
 * Maps iTunes track data to StreamVerse format
 */
const formatTrack = (track) => ({
    id: track.trackId.toString(),
    title: track.trackName,
    subtitle: track.artistName,
    thumbnail: track.artworkUrl100?.replace('100x100bb', '600x600bb') || track.artworkUrl100,
    image: track.artworkUrl100?.replace('100x100bb', '800x800bb') || track.artworkUrl100,
    audioUrl: track.previewUrl,
    genre: track.primaryGenreName,
    year: track.releaseDate ? track.releaseDate.split('-')[0] : '2024',
    type: 'music'
});

/**
 * Fetches music for a specific section with pagination support
 */
export const fetchMusicSection = async (sectionName, page = 1, limit = 20, language = 'All') => {
    try {
        const keywords = SECTION_KEYWORDS[sectionName] || [sectionName];
        let keyword = keywords[(page - 1) % keywords.length];
        const offset = Math.floor((page - 1) / keywords.length) * limit;

        // Determination of Regional Parameter
        let country = 'US'; // Default
        let langLabel = '';

        if (language === 'hi') {
            country = 'IN';
            langLabel = 'Bollywood ';
        } else if (language === 'bn') {
            country = 'IN';
            // We use specialized keywords for Bengali directly, so we DON'T need a langLabel prefix here
            // because the keywords themselves will contain "Bengali"
            langLabel = '';

            if (sectionName === 'Trending Now' || sectionName === 'New Releases') {
                const bengaliSpecific = ['Bengali Movie Songs', 'New Bengali Hits', 'Bengali Pop 2025', 'Tollywood Bengali'];
                keyword = bengaliSpecific[(page - 1) % bengaliSpecific.length];
            } else if (sectionName === 'Top Hindi') {
                // Specialized Bengali artists (avoiding those with major Hindi overlap like Arijit)
                const bengaliPure = ['Anupam Roy', 'Jeet Gannguli Bengali', 'Nachiketa', 'Anjan Dutt', 'Iman Chakraborty'];
                keyword = bengaliPure[(page - 1) % bengaliPure.length];
            } else {
                // General fallback for other sections
                keyword = `Bengali ${keyword}`;
            }
        } else if (language === 'en') {
            country = 'US';
            langLabel = '';
        }

        // SPECIAL CASE: International Hits should always be global
        if (sectionName === 'International Hits') {
            country = 'US';
            langLabel = '';
            // Reset keyword to original if it was modified for BN/HI
            keyword = (SECTION_KEYWORDS[sectionName] || [sectionName])[(page - 1) % keywords.length];
        }

        const finalKeyword = `${langLabel}${keyword}`;

        const response = await axios.get(
            `https://itunes.apple.com/search?term=${encodeURIComponent(finalKeyword)}&entity=song&limit=${limit}&offset=${offset}&country=${country}&media=music&lang=en_us`
        );

        const tracks = (response.data.results || []).map(formatTrack);

        return {
            tracks,
            hasMore: tracks.length === limit,
            sectionName
        };
    } catch (error) {
        console.error(`Error fetching section ${sectionName}:`, error);
        return { tracks: [], hasMore: false, sectionName };
    }
};

/**
 * Searches for music tracks using the iTunes API
 */
export const searchMusic = async (query, limit = 20) => {
    if (!query) return [];
    try {
        // We try to search globally first, but can adjust if needed
        const response = await axios.get(
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}&media=music&lang=en_us`
        );
        return (response.data.results || []).map(formatTrack);
    } catch (error) {
        console.error("Error searching music:", error);
        return [];
    }
};

/**
 * Dynamically gets a list of sections for vertical infinite scroll
 */
export const getAvailableSections = () => Object.keys(SECTION_KEYWORDS);
