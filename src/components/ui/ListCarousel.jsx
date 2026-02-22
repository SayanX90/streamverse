import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import ContentCard from './ContentCard';
import { cn } from '../layout/Navbar';

export default function ListCarousel({ title, items, isContinueWatching = false }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    // Triple the items for seamless infinite loop
    const loopedItems = [...items, ...items, ...items];

    // Each card is about 180px wide + 16px gap = 196px
    const CARD_WIDTH = 196;

    // Start at the middle copy on mount
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const singleSetWidth = items.length * CARD_WIDTH;
        el.scrollLeft = singleSetWidth;
    }, [items.length]);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || isResetting) return;

        const singleSetWidth = items.length * CARD_WIDTH;

        setShowLeftArrow(el.scrollLeft > 50);

        // If we scrolled to the last copy, jump back to the middle copy
        if (el.scrollLeft >= singleSetWidth * 2) {
            setIsResetting(true);
            el.style.scrollBehavior = 'auto';
            el.scrollLeft = singleSetWidth;
            el.style.scrollBehavior = '';
            setTimeout(() => setIsResetting(false), 50);
        }

        // If we scrolled back to the first copy, jump forward to the middle copy
        if (el.scrollLeft <= 0) {
            setIsResetting(true);
            el.style.scrollBehavior = 'auto';
            el.scrollLeft = singleSetWidth;
            el.style.scrollBehavior = '';
            setTimeout(() => setIsResetting(false), 50);
        }
    }, [items.length, isResetting]);

    const scroll = (direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = direction === 'left' ? -el.clientWidth * 0.7 : el.clientWidth * 0.7;
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <div className="relative mb-12 md:mb-20 group/carousel">
            <div className="flex items-end justify-between px-6 md:px-12 mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white/90">{title}</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="relative">
                {/* Left Fade */}
                <div className="absolute left-0 top-0 h-full w-16 md:w-24 bg-gradient-to-r from-[#050505] to-transparent z-30 pointer-events-none"></div>

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar scroll-smooth px-6 md:px-12 pb-6 pt-2 -mt-2"
                >
                    {loopedItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="flex-shrink-0 w-40 sm:w-44 md:w-48"
                        >
                            <ContentCard item={item} />
                        </div>
                    ))}
                </div>

                {/* Right Fade */}
                <div className="absolute right-0 top-0 h-full w-16 md:w-24 bg-gradient-to-l from-[#050505] to-transparent z-30 pointer-events-none"></div>
            </div>
        </div>
    );
}
