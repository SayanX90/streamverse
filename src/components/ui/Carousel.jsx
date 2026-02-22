import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import Card from './Card';
import { cn } from '../layout/Navbar';

export default function Carousel({ title, items, isContinueWatching = false, isVertical = false }) {
    const scrollRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);

    const handleScroll = () => {
        if (scrollRef.current) {
            setShowLeftArrow(scrollRef.current.scrollLeft > 0);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -window.innerWidth * 0.7 : window.innerWidth * 0.7;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="relative mb-8 md:mb-16 group/carousel">
            <div className="flex items-end justify-between px-6 md:px-12 mb-6">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
                <button className="text-sm font-semibold text-accent hover:text-white transition-colors">View All</button>
            </div>

            <div className="relative">
                {/* Left Fade/Button */}
                <div className={cn(
                    "absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-30 pointer-events-none transition-opacity duration-300",
                    showLeftArrow ? "opacity-100" : "opacity-0"
                )}></div>
                <button
                    onClick={() => scroll('left')}
                    className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full z-40 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110",
                        !showLeftArrow && "hidden"
                    )}
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar scroll-smooth px-6 md:px-12 pb-8 pt-4 -mt-4"
                >
                    {items.map((item) => (
                        <Card key={item.id} item={item} isContinueWatching={isContinueWatching} isVertical={isVertical} />
                    ))}
                </div>

                {/* Right Fade/Button */}
                <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-30 pointer-events-none"></div>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full z-40 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
