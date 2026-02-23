import { RotateCcw, ChevronDown } from 'lucide-react';
import { useContentContext } from '../../contexts/ContentContext';
import { useState } from 'react';

const ALL_GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance',
    'Football', 'Basketball', 'Tennis', 'Formula 1', 'Cricket', 'UFC',
    'Pop', 'Rock', 'Hip Hop', 'Classical', 'Jazz', 'Electronic', 'Documentary'];

const genresByType = {
    movie: ['All', 'Action', 'Sci-Fi', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Adventure', 'Fantasy', 'Animation', 'Documentary'],
    series: ['All', 'Action & Adventure', 'Sci-Fi & Fantasy', 'Drama', 'Comedy', 'Crime', 'Mystery', 'Animation', 'Documentary', 'Reality', 'War & Politics'],
    sports: ['All', 'Football', 'Basketball', 'Tennis', 'Formula 1', 'Cricket', 'UFC'],
    music: ['All', 'Pop', 'Rock', 'Hip Hop', 'Classical', 'Jazz', 'Electronic'],
};

const yearRanges = [
    { label: 'All Years', value: null },
    { label: '2024', value: { start: 2024, end: 2024 } },
    { label: '2023', value: { start: 2023, end: 2023 } },
    { label: '2022', value: { start: 2022, end: 2022 } },
    { label: '2021', value: { start: 2021, end: 2021 } },
    { label: '2020', value: { start: 2020, end: 2020 } },
    { label: '2010s', value: { start: 2010, end: 2019 } },
    { label: '2000s', value: { start: 2000, end: 2009 } },
    { label: '90s', value: { start: 1990, end: 1999 } },
];

export default function FilterBar({ type }) {
    const genres = genresByType[type] || genresByType.movie;
    const { globalFilters, setGlobalFilters, resetFilters } = useContentContext();
    const [yearOpen, setYearOpen] = useState(false);

    const handleGenreSelect = (genre) => {
        setGlobalFilters(prev => ({ ...prev, genre }));
    };

    const handleRatingSelect = (rating) => {
        setGlobalFilters(prev => ({
            ...prev,
            minRating: prev.minRating === rating ? 0 : rating
        }));
    };

    const handleYearSelect = (range) => {
        setGlobalFilters(prev => ({ ...prev, releaseYearRange: range }));
        setYearOpen(false);
    };

    const currentYearLabel = yearRanges.find(yr =>
        JSON.stringify(yr.value) === JSON.stringify(globalFilters.releaseYearRange)
    )?.label || 'All Years';

    const hasActiveFilters = globalFilters.genre !== 'All' || globalFilters.minRating > 0 || globalFilters.releaseYearRange !== null;

    return (
        <div className="flex flex-col gap-4">
            {/* Genre Pills */}
            <div className="flex flex-wrap items-center gap-2">
                {genres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => handleGenreSelect(genre)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${globalFilters.genre === genre
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                            : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {/* Quick Filters Row */}
            <div className="flex flex-wrap items-center gap-3">
                <span className="text-white/40 text-xs mr-1 font-medium uppercase tracking-wider">Filters:</span>

                {/* Rating Quick Filters */}
                {[8, 9].map(rating => (
                    <button
                        key={rating}
                        onClick={() => handleRatingSelect(rating)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 border ${globalFilters.minRating === rating
                            ? 'bg-accent/20 text-accent border-accent/50'
                            : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {rating}+ ★
                    </button>
                ))}

                {/* Year Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setYearOpen(!yearOpen)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 border ${globalFilters.releaseYearRange
                            ? 'bg-accent/20 text-accent border-accent/50'
                            : 'bg-transparent text-white/50 border-white/10 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {currentYearLabel}
                        <ChevronDown size={12} className={`transition-transform ${yearOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {yearOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setYearOpen(false)} />
                            <div className="absolute left-0 top-full mt-2 w-36 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                                {yearRanges.map((yr) => (
                                    <button
                                        key={yr.label}
                                        onClick={() => handleYearSelect(yr.value)}
                                        className={`w-full text-left px-4 py-2 text-xs transition-colors ${currentYearLabel === yr.label
                                            ? 'bg-white/10 text-white font-bold'
                                            : 'text-white/60 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {yr.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Reset All */}
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all ml-auto"
                    >
                        <RotateCcw size={10} /> Reset
                    </button>
                )}
            </div>
        </div>
    );
}
