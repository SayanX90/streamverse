import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LandingPage from '../../pages/LandingPage';

export default function AuthGate({ children }) {
    const { user, authLoading } = useAuth();

    // Loading spinner while checking auth
    if (authLoading) {
        return (
            <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-accent" size={48} />
                    <span className="text-white/40 text-sm font-medium tracking-wider uppercase">Loading StreamVerse…</span>
                </div>
            </div>
        );
    }

    // Not authenticated → LandingPage (which then goes to AuthPage)
    if (!user) {
        return (
            <div className="animate-fade-in">
                <LandingPage />
            </div>
        );
    }

    // Authenticated → App
    return (
        <div className="animate-fade-in">
            {children}
        </div>
    );
}
