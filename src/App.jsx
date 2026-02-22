import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Category from './pages/Category';
import About from './pages/About';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookie from './pages/Cookie';
import VideoPlayer from './pages/VideoPlayer';
import { ContentProvider } from './contexts/ContentContext';
import { PlayerProvider } from './contexts/PlayerContext';

function App() {
    return (
        <PlayerProvider>
            <ContentProvider>
                <Routes>
                    {/* Video player — fullscreen, no Layout (no Navbar/Footer/MiniPlayer) */}
                    <Route path="/watch/:id" element={<VideoPlayer />} />

                    {/* Main Layout wrapper */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="category/:type" element={<Category />} />
                        <Route path="search" element={<Search />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="about" element={<About />} />
                        <Route path="terms" element={<Terms />} />
                        <Route path="privacy" element={<Privacy />} />
                        <Route path="cookie" element={<Cookie />} />
                    </Route>
                </Routes>
            </ContentProvider>
        </PlayerProvider>
    );
}

export default App;
