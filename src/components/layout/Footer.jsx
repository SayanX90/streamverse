import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-[#050505] py-12 px-6 border-t border-white/5">
            <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
                {/* Logo */}
                <h3 className="text-2xl font-black tracking-tighter text-accent opacity-80 hover:opacity-100 transition-opacity">
                    STREAMVERSE
                </h3>

                {/* Horizontal Links */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs md:text-sm font-medium text-white/40">
                    <Link to="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link to="/cookie" className="hover:text-white transition-colors">Cookie Notice</Link>
                    <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                    <a href="#" className="hover:text-white transition-colors">Help</a>
                </nav>

                {/* Copyright */}
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] md:text-xs text-white/20 tracking-wide uppercase">
                        &copy; {new Date().getFullYear()} StreamVerse.com, Inc. or its affiliates
                    </p>
                </div>
            </div>
        </footer>
    );
}
