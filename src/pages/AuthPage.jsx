import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AuthPage() {
    const { loginWithGoogle, signupWithEmail, loginWithEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // UI States
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                await signupWithEmail(email, password);
            }
        } catch (err) {
            setError(err.message.replace('Firebase: ', '').replace('Error (', '').replace(').', ''));
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            console.error('[GoogleLogin]', err);
            setError(err.message.replace('Firebase: ', '').replace('Error (', '').replace(').', ''));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center py-12 px-4 overflow-y-auto font-sans">
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent/10 blur-[150px] animate-pulse" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 w-full max-w-[440px] px-6 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white mb-2">
                        STREAM<span className="text-accent underline decoration-accent/30 underline-offset-8">VERSE</span>
                    </h1>
                    <p className="text-white/50 text-base font-medium">
                        Unlimited movies, series, sports & music.
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/50">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        {isLogin ? 'Welcome Back' : 'Join the Verse'}
                    </h2>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black py-3.5 rounded-xl font-bold text-sm hover:bg-white/90 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-white/5"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-white/30 text-xs font-bold uppercase tracking-wider">OR</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 bg-accent/10 border border-accent/20 text-accent p-3 rounded-xl text-xs font-bold animate-shake">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5 focus-within:z-10 group">
                            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-accent/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-1.5 group">
                            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-accent/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1.5 animate-slide-up">
                                <label className="text-white/40 text-[10px] font-black uppercase tracking-widest ml-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-accent/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-white/20"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-accent text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-accent/90 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                isLogin ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-white/40 text-sm">
                            {isLogin ? "New to StreamVerse?" : "Already have an account?"}
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError('');
                                }}
                                className="ml-2 text-white font-black hover:text-accent transition-colors"
                            >
                                {isLogin ? 'Sign up now' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
