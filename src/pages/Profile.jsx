import { Settings, Clock, Heart, Download, Loader2, User as UserIcon, LogOut } from 'lucide-react';
import HorizontalCard from '../components/ui/HorizontalCard';
import { useAuth } from '../contexts/AuthContext';
import useProfileData from '../hooks/useProfileData';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const {
        stats,
        history,
        myList,
        favourites,
        loading
    } = useProfileData();

    const [activeTab, setActiveTab] = useState('Watch History');
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState(null); // State to hold logout error

    const handleLogout = async () => {
        setLoggingOut(true);
        setLogoutError(null); // Clear previous errors
        try {
            await logout(); // Use the logout function from AuthContext
            navigate('/'); // Redirect to home page
        } catch (error) {
            console.error("Logout failed:", error);
            setLogoutError("Failed to log out. Please try again."); // Set an error message
            setLoggingOut(false); // Reset logging out state
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-accent" size={48} />
                    <span className="text-white/40 text-sm font-medium tracking-wider uppercase">Syncing your Verse…</span>
                </div>
            </div>
        );
    }

    // Determine content to show based on active tab
    const getTabContent = () => {
        switch (activeTab) {
            case 'Watch History': return history.map(h => ({ ...h.content, progress: h.progress }));
            case 'My List': return myList;
            case 'Downloads': return favourites; // Mocking downloads with favourites for now as requested
            default: return [];
        }
    };

    const displayContent = getTabContent();

    return (
        <div className="w-full min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">

            {/* Left Sidebar / User Info */}
            <div className="w-full lg:w-1/3 flex flex-col">
                <div className="flex flex-col items-center lg:items-start mb-10">
                    <div className="w-32 h-32 rounded-full overflow-hidden border border-white/20 mb-6 relative group bg-white/5 flex items-center justify-center">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                        ) : (
                            <UserIcon size={48} className="text-white/20" />
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-1 truncate w-full text-center lg:text-left">
                        {user?.displayName || user?.email?.split('@')[0] || 'Member'}
                    </h1>
                    <p className="text-white/50 text-sm font-medium tracking-wide uppercase tracking-[0.2em]">
                        {user?.isAnonymous ? 'Guest Member' : 'Premium Member'}
                    </p>
                    <button className="mt-6 px-6 py-2 border border-white/20 rounded-full text-sm font-semibold hover:bg-white hover:text-black transition-colors flex items-center gap-2">
                        <Settings size={16} /> Manage Account
                    </button>
                </div>

                {/* Vertical Nav */}
                <nav className="flex flex-col gap-2 w-full max-w-xs mx-auto lg:mx-0">
                    {[
                        { label: 'Watch History', icon: Clock },
                        { label: 'My List', icon: Heart },
                        { label: 'Favourites', icon: Download },
                    ].map((item, i) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.label;
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveTab(item.label)}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-white/10 text-white border border-white/10 backdrop-blur-md shadow-xl shadow-black/20'
                                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon size={20} className={isActive ? 'text-white' : 'text-white/50'} />
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        )
                    })}
                </nav>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="mt-8 w-full max-w-xs mx-auto lg:mx-0 flex items-center gap-4 px-6 py-4 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 group"
                >
                    {loggingOut
                        ? <Loader2 size={20} className="animate-spin" />
                        : <LogOut size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
                    }
                    <span className="font-semibold">{loggingOut ? 'Signing out...' : 'Log Out'}</span>
                </button>
            </div>

            {/* Right Content Area */}
            <div className="w-full lg:w-2/3 flex flex-col gap-12 animate-fade-in">

                {/* Stats Minimal */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center transform hover:scale-[1.02] transition-transform">
                        <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Watch Time</h3>
                        <p className="text-3xl font-black text-white leading-none">
                            {stats.totalWatchTimeHours} <span className="text-lg font-medium text-white/50">hrs</span>
                        </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-center transform hover:scale-[1.02] transition-transform">
                        <h3 className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Completed</h3>
                        <p className="text-3xl font-black text-white leading-none">
                            {stats.completedTitles} <span className="text-lg font-medium text-white/50">titles</span>
                        </p>
                    </div>
                </div>

                {/* Dynamic List Section */}
                <div>
                    <div className="flex items-end justify-between mb-8 pb-4 border-b border-white/5">
                        <h2 className="text-2xl font-bold text-white tracking-tight">{activeTab}</h2>
                        <span className="text-sm font-bold text-white/30 tracking-widest uppercase">{displayContent.length} Items</span>
                    </div>

                    {displayContent.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {displayContent.map((item) => (
                                <HorizontalCard
                                    key={item.id}
                                    item={item}
                                    isContinueWatching={activeTab === 'Watch History'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] rounded-3xl border border-white/5 border-dashed">
                            <p className="text-white/20 font-bold uppercase tracking-widest mb-2">Nothing here yet</p>
                            <p className="text-white/40 text-sm">Start exploring to fill your profile!</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

