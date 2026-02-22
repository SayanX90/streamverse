import axios from "axios";

export const fetchMusic = async (term) => {
    try {
        const response = await axios.get(
            `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=20`
        );
        return response.data.results;
    } catch (error) {
        console.error(`Error fetching music for term: ${term}`, error);
        return [];
    }
};
