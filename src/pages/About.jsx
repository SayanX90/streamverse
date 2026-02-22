import React from 'react';

export default function About() {
    return (
        <div className="w-full min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">ABOUT <span className="text-accent">STREAMVERSE</span></h1>

            <div className="space-y-8 text-white/70 leading-relaxed text-lg">
                <p className="text-xl text-white font-medium">
                    StreamVerse is a premium streaming destination designed for the next generation of entertainment enthusiasts.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Our Mission</h2>
                    <p>
                        Our mission is to provide seamless, high-quality access to the stories that move us. From cinematic masterpieces to adrenaline-pumping sports and global music hits, we curate experiences that transcend boundaries.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">The Experience</h2>
                    <p>
                        We believe technology should disappear, leaving only the connection between you and the content. Our platform is built on cutting-edge infrastructure to ensure 4K HDR streams, zero-latency playback, and a personalized discovery engine that understands your taste.
                    </p>
                </section>

                <div className="pt-12 border-t border-white/10">
                    <p className="text-sm uppercase tracking-[0.3em] font-black text-white/30">Founded 2024 • Global Architecture</p>
                </div>
            </div>
        </div>
    );
}
