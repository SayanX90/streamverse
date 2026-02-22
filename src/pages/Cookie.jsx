import React from 'react';

export default function Cookie() {
    return (
        <div className="w-full min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Cookie Policy</h1>

            <div className="space-y-8 text-white/60 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">What are cookies?</h2>
                    <p>
                        Cookies are small data files that are commonly stored on your device when you browse and use websites and online services. They are widely used to make websites work, or to work more efficiently, as well as to provide reporting information and assist with service or advertising personalization.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Why does StreamVerse use cookies?</h2>
                    <p>
                        We and our Service Providers use cookies and other technologies (such as web beacons) for various reasons. For example, we use cookies and other technologies to make it easy to access our services by remembering you when you return; and to provide, analyze, understand and enhance the use of our services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Essential Cookies</h2>
                    <p>
                        These cookies are strictly necessary to provide our website or online service. For example, we and our Service Providers may use these cookies to authenticate and identify our members when they use our websites and applications so we can provide our service to them.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">Your Choices</h2>
                    <p>
                        Most browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove or reject browser cookies. Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our services.
                    </p>
                </section>

                <div className="pt-8 text-sm italic">
                    Last updated: February 20, 2026
                </div>
            </div>
        </div>
    );
}
