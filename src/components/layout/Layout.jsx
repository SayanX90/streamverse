import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalMusicPlayer from '../music/GlobalMusicPlayer';

export default function Layout() {
    return (
        <div className="min-h-[100dvh] flex flex-col w-full overflow-x-hidden relative">
            <Navbar />
            <main className="flex-grow w-full">
                <Outlet />
            </main>
            <Footer />
            <GlobalMusicPlayer />
        </div>
    );
}
