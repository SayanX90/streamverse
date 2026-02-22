import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import AuthPage from './AuthPage';

export default function LandingPage() {
    const [showAuth, setShowAuth] = useState(false);

    // If user clicked "Get Started" or "Sign In", show the AuthPage
    if (showAuth) {
        return <AuthPage />;
    }

    return (
        <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col font-sans">
            {/* Background Image with Netflix-style Gradient Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80")', // Cinematic collage styled background
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80"></div>

            {/* Header Navbar Custom for Landing Page */}
            <header className="relative z-50 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between w-full max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                    STREAM<span className="text-accent underline decoration-accent/30 underline-offset-4">VERSE</span>
                </h1>

                <button
                    onClick={() => setShowAuth(true)}
                    className="bg-accent text-white px-4 py-1.5 md:px-6 md:py-2 rounded font-bold text-sm md:text-base tracking-wide hover:bg-accent/90 transition-colors"
                >
                    Sign In
                </button>
            </header>

            {/* Main Content Centered */}
            <main className="relative z-20 flex-grow flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto w-full -mt-10 md:-mt-20">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4 drop-shadow-2xl">
                    Unlimited movies, TV <br className="hidden sm:block" />shows, and more
                </h2>
                {/* <p className="text-lg md:text-2xl text-white font-medium mb-8 drop-shadow-md">
                    Starts at ₹149. Cancel anytime.
                </p> */}

                <p className="text-base md:text-lg text-white/90 mb-4 tracking-wide">
                    Ready to watch? Enter your email to create or restart your membership.
                </p>

                {/* Get Started Input Group */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 w-full max-w-2xl mx-auto">
                    {/* <input
                        type="email"
                        placeholder="Email address"
                        className="w-full sm:w-2/3 h-14 bg-black/50 border border-white/40 rounded px-4 text-white placeholder:text-white/60 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-lg"
                    /> */}
                    <button
                        onClick={() => setShowAuth(true)}
                        className="w-full sm:w-auto h-14 px-8 bg-accent text-white rounded font-bold text-xl md:text-2xl flex items-center justify-center gap-2 hover:bg-accent/90 transition-all flex-shrink-0"
                    >
                        Get Started
                        <ChevronRight size={28} />
                    </button>
                </div>
            </main>
        </div>
    );
}
