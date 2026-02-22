import { useContentContext } from '../../contexts/ContentContext';
import { ChevronDown } from 'lucide-react';

const sortOptions = [
    { value: 'popularity-desc', label: 'Popularity' },
    { value: 'rating-desc', label: 'Top Rated' },
    { value: 'releaseYear-desc', label: 'Newest' },
    { value: 'title-asc', label: 'A-Z' },
];

export default function SortDropdown() {
    const { globalSort, setGlobalSort } = useContentContext();

    return (
        <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 transition-colors backdrop-blur-md">
                <span>Sort By: </span>
                <span className="text-white font-bold">
                    {sortOptions.find(opt => opt.value === globalSort)?.label}
                </span>
                <ChevronDown size={14} className="text-white/50 group-hover:text-white transition-colors" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
                {sortOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setGlobalSort(option.value)}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${globalSort === option.value
                                ? 'bg-white/10 text-white font-bold border-l-2 border-accent'
                                : 'text-white/70 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
