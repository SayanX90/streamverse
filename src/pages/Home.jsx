import HeroBanner from '../components/home/HeroBanner';
import ExpandableCarousel from '../components/ui/ExpandableCarousel';
import ListCarousel from '../components/ui/ListCarousel';
import MusicSection from '../components/music/MusicSection';
import useProfileData from '../hooks/useProfileData';
import { useAuth } from '../contexts/AuthContext';
import { useContentContext } from '../contexts/ContentContext';
import { fetchTrendingMovies, fetchPopularMovies, fetchTopBollywood } from '../api/tmdb';
import { useState, useEffect } from 'react';

export default function Home() {
    const { user } = useAuth();
    const { myList, loading: listLoading } = useProfileData();
    const { globalLanguage } = useContentContext();
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topBollywood, setTopBollywood] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTMDB = async () => {
            try {
                const [trendRes, popRes, bwoodRes] = await Promise.all([
                    fetchTrendingMovies(globalLanguage),
                    fetchPopularMovies(globalLanguage),
                    fetchTopBollywood()
                ]);
                setTrending(trendRes);
                setPopular(popRes);
                setTopBollywood(bwoodRes);
            } catch (error) {
                console.error("Failed to load TMDB Home data", error);
            } finally {
                setLoading(false);
            }
        };
        loadTMDB();
    }, [globalLanguage]);

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white/50">Loading StreamVerse...</div>;
    }

    return (
        <div className="w-full pb-24 bg-[#050505] min-h-screen">
            {/* Pass the first trending movie as the Hero */}
            <HeroBanner featuredMovie={trending[0]} />

            {/* Pull content up to overlap hero fade slightly */}
            <div className="relative z-30 -mt-24 space-y-4">

                {/* The new Accordion style hero row */}
                <ExpandableCarousel
                    title="Trending Masterpieces"
                    items={trending.slice(1, 6)}
                />

                {/* Top Bollywood Row */}
                {topBollywood.length > 0 && (
                    <ListCarousel
                        title="Top Bollywood 🇮🇳"
                        items={topBollywood}
                    />
                )}

                {/* Show My List (Uses actual saved items, falls back to popular data if empty) */}
                {user && !listLoading && (
                    <div className="py-4">
                        <ListCarousel
                            title="My List"
                            items={myList.length > 0 ? myList : popular.slice(0, 5)}
                        />
                    </div>
                )}

                <ListCarousel
                    title="Popular Movies"
                    items={popular}
                />

                <ListCarousel
                    title="More Trending"
                    items={trending.slice(6, 20)}
                />

                {/* Music Rows */}
                <MusicSection title="Top Bollywood Music" searchTerm="bollywood" />
                <MusicSection title="Top Bengali Music" searchTerm="bengali" />
                <MusicSection title="Top English Music" searchTerm="english" />

            </div>
        </div>
    );
}
