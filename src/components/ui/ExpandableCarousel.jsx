import { Play } from 'lucide-react';
import { cn } from '../layout/Navbar';

export default function ExpandableCarousel({ title, items }) {
    return (
        <div className="px-6 md:px-12 py-12">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-white/90">{title}</h2>

            <div className="flex h-[400px] md:h-[500px] w-full gap-2 md:gap-4 overflow-x-auto hide-scrollbar pb-8">
                {items.map((item, i) => (
                    <div
                        key={item.id}
                        className="group relative flex-shrink-0 w-[80px] sm:w-[120px] md:w-[150px] hover:w-[300px] sm:hover:w-[400px] md:hover:w-[500px] h-full rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer shadow-black/50 hover:shadow-2xl"
                    >
                        {/* Background Image */}
                        <img
                            src={item.banner || item.thumbnail}
                            alt={item.title}
                            className="absolute inset-0 w-[500px] max-w-none h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                            style={{ left: '50%', transform: `translateX(-50%) scale(1)` }}
                        />

                        {/* Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>

                        {/* Vertical Title (when collapsed) */}
                        <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-100 group-hover:opacity-0 transition-opacity duration-300 delay-100">
                            <span className="text-white font-bold whitespace-nowrap -rotate-90 origin-left translate-x-3 tracking-widest text-sm uppercase mix-blend-overlay">
                                {item.title}
                            </span>
                        </div>

                        {/* Expanded Content */}
                        <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-xs font-bold text-accent tracking-wider uppercase">{item.type}</span>
                                    <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                                    <span className="text-xs text-white/70">{item.rating} Rating</span>
                                </div>

                                <h3 className="text-3xl font-black text-white leading-tight mb-4 drop-shadow-lg max-w-[80%]">
                                    {item.title}
                                </h3>

                                <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white hover:border-white group/btn transition-all duration-300">
                                    <Play size={20} className="text-white group-hover/btn:text-black group-hover/btn:fill-black ml-1 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
