import { Play, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroBanner({ featuredMovie }) {
    const [scrollY, setScrollY] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full h-[100vh] flex items-end justify-center overflow-hidden bg-black pb-32">
            {/* Immersive Background Image with Parallax effect */}
            <div
                className="absolute inset-0 bg-cover bg-top transition-transform duration-100 ease-out"
                style={{
                    backgroundImage: `url("${featuredMovie?.banner || featuredMovie?.thumbnail || 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=1920&q=80'}")`,
                    transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0005})`,
                }}
            ></div>

            {/* Deep Vignette and Gradient Fades for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505] z-10"></div>
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10"></div>

            {/* Floating Content */}
            <div
                className="relative z-20 w-full max-w-7xl px-8 flex flex-col items-center text-center transition-all duration-500 ease-out"
                style={{ transform: `translateY(${-scrollY * 0.2}px)`, opacity: 1 - scrollY / 600 }}
            >
                <span className="text-accent tracking-[0.3em] text-sm font-semibold mb-6 animate-[slide-up_0.8s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.1s' }}>
                    STREAMVERSE EXCLUSIVE
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none mb-4 sm:mb-6 animate-[slide-up_0.8s_ease-out_forwards] opacity-0 text-white drop-shadow-2xl" style={{ animationDelay: '0.3s' }}>
                    {featuredMovie ? featuredMovie.title : 'Loading...'}
                </h1>

                <p className="text-base sm:text-lg text-gray-200 max-w-2xl font-medium leading-relaxed mb-8 sm:mb-10 animate-[slide-up_0.8s_ease-out_forwards] opacity-0 drop-shadow-md line-clamp-3 sm:line-clamp-none px-4" style={{ animationDelay: '0.5s' }}>
                    {featuredMovie ? featuredMovie.description : 'Please wait while we load the latest content...'}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full sm:w-auto px-6 sm:px-0 animate-[slide-up_0.8s_ease-out_forwards] opacity-0" style={{ animationDelay: '0.7s' }}>
                    <button
                        onClick={() => featuredMovie && navigate(`/watch/${featuredMovie.id}`)}
                        className="group relative px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto bg-accent text-white rounded-full font-bold overflow-hidden flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(229,9,20,0.4)] hover:shadow-[0_0_60px_rgba(229,9,20,0.6)]"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                        <Play size={20} className="relative z-10 fill-white sm:w-6 sm:h-6" />
                        <span className="relative z-10 text-lg sm:text-xl tracking-tight">Play Now</span>
                    </button>

                    <button className="group px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto justify-center rounded-full font-semibold text-white border border-white/20 backdrop-blur-md hover:bg-white/10 transition-all flex items-center gap-3 hover:scale-105 active:scale-95 bg-black/30">
                        <Info size={18} className="text-gray-100 group-hover:text-white transition-colors sm:w-5 sm:h-5" />
                        <span className="text-lg sm:text-base">More Info</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
