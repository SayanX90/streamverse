import { Play, Plus } from 'lucide-react';
import { cn } from '../layout/Navbar';

export default function BentoGrid({ title, items }) {
    // We expect at least 5 items to make a good bento layout
    if (!items || items.length < 5) return null;

    const renderBentoCard = (item, extraClasses) => (
        <div key={item.id} className={cn("group relative rounded-3xl overflow-hidden cursor-pointer", extraClasses)}>
            <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

            {/* Content */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded text-white border border-white/20">{item.match || '4K'}</span>
                        <span className="text-sm text-gray-300 font-medium">{item.rating} Rating</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2 drop-shadow-lg">{item.title}</h3>

                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-4">
                        <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                            <Play size={20} className="fill-black ml-1" />
                        </button>
                        <button className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="px-6 md:px-12 py-12">
            <div className="flex items-end justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
                <button className="text-sm font-semibold text-accent hover:text-white transition-colors">Explore All</button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 h-[800px] md:h-[600px]">
                {/* Large Feature Card (Spans 2 cols, 2 rows) */}
                {renderBentoCard(items[0], "md:col-span-2 md:row-span-2")}

                {/* Medium Cards */}
                {renderBentoCard(items[1], "md:col-span-1 md:row-span-1")}
                {renderBentoCard(items[2], "md:col-span-1 md:row-span-1")}
                {renderBentoCard(items[3], "md:col-span-1 md:row-span-1")}
                {renderBentoCard(items[4], "md:col-span-1 md:row-span-1")}
            </div>
        </div>
    );
}
