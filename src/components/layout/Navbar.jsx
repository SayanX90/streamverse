import { Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, User, Bell, Home, Film, Tv, Trophy, Music, Globe, Menu, X } from 'lucide-react';
import { useContentContext } from '../../contexts/ContentContext';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { globalLanguage, setGlobalLanguage } = useContentContext();

    const languages = [
        { code: 'All', label: 'All' },
        { code: 'hi', label: 'Hindi' },
        { code: 'bn', label: 'Bengali' },
        { code: 'en', label: 'English' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/category/movie', label: 'Movies', icon: Film },
        { path: '/category/series', label: 'Series', icon: Tv },
        { path: '/category/sports', label: 'Sports', icon: Trophy },
        { path: '/category/music', label: 'Music', icon: Music },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none transition-all duration-300">

            {/* Pill Navbar */}
            <div className={cn(
                "pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 border relative w-full max-w-5xl",
                isScrolled
                    ? "bg-card/70 backdrop-blur-xl border-white/10 shadow-2xl shadow-black/50"
                    : "bg-black/40 backdrop-blur-md border-transparent"
            )}>
                <Link to="/" className="text-xl md:text-2xl font-black tracking-tighter text-white flex-shrink-0 mr-8 z-10">
                    STREAM<span className="text-accent">VERSE</span>
                </Link>

                {/* Center Links */}
                <div className="hidden md:flex items-center gap-2 z-10">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                    isActive ? "bg-white text-black" : "text-gray-300 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <Icon size={16} className={isActive ? "text-black" : "text-gray-400"} />
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4 z-10">
                    {/* Language Dropdown */}
                    <div className="relative hidden md:block">
                        <button
                            onClick={() => setShowLangMenu(!showLangMenu)}
                            className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full"
                        >
                            <Globe size={14} />
                            {languages.find(l => l.code === globalLanguage)?.label || 'All'}
                        </button>

                        {showLangMenu && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)}></div>
                                <div className="absolute right-0 mt-2 w-32 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 py-1">
                                    {languages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setGlobalLanguage(lang.code);
                                                setShowLangMenu(false);
                                            }}
                                            className={cn(
                                                "w-full text-left px-4 py-2 text-sm transition-colors",
                                                globalLanguage === lang.code ? "bg-accent/20 text-accent font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"
                                            )}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <Link to="/search" className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-300 hover:text-white transition-colors">
                        <Search size={20} />
                    </Link>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-300 hover:text-white transition-colors relative hidden sm:flex">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full"></span>
                    </button>

                    <Link to="/profile" className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-white transition-all hidden sm:block">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
                    </Link>

                    {/* Mobile Hamburger Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 mt-4 w-full bg-[#111]/95 backdrop-blur-3xl border border-white/10 rounded-2xl md:hidden shadow-2xl flex flex-col p-4 animate-[slide-down_0.3s_ease-out] z-50">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all mb-1",
                                        isActive ? "bg-accent/20 text-accent font-bold" : "text-gray-300 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <Icon size={20} className={isActive ? "text-accent" : "text-gray-400"} />
                                    {link.label}
                                </Link>
                            )
                        })}

                        <div className="h-px bg-white/10 my-3" />

                        <div className="px-4 py-2">
                            <p className="text-xs text-white/50 mb-3 uppercase tracking-wider font-bold">Language Setup</p>
                            <div className="flex gap-2 flex-wrap">
                                {languages.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setGlobalLanguage(lang.code);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                                            globalLanguage === lang.code
                                                ? "bg-accent border-accent text-white"
                                                : "border-white/20 text-white/70 hover:bg-white/20 hover:text-white"
                                        )}
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-3" />

                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                            <User size={20} className="text-gray-400" />
                            My Profile
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
