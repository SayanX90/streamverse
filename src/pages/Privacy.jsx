import React from 'react';

export default function Privacy() {
    return (
        <div className="w-full min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Privacy Policy</h1>

            <div className="space-y-8 text-white/60 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Information We Collect</h2>
                    <p>
                        We receive and store information about you such as:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Identifiers (e.g., name, email address, IP address)</li>
                        <li>Payment information and history</li>
                        <li>Streaming activity (e.g., titles watched, search queries)</li>
                        <li>Device information (e.g., hardware models, operating system versions)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Use of Information</h2>
                    <p>
                        We use information to provide, analyze, administer, enhance and personalize our services and marketing efforts, to process your registration, your orders and your payments, and to communicate with you on these and other topics.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Disclosure of Information</h2>
                    <p>
                        We do not sell your personal information. We may share information with third-party service providers who perform services on our behalf (e.g., cloud hosting, payment processing).
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Data Security</h2>
                    <p>
                        We use reasonable administrative, logical, physical and managerial measures to safeguard your personal information against loss, theft and unauthorized access, use and modification.
                    </p>
                </section>

                <div className="pt-8 text-sm italic">
                    Last updated: February 20, 2026
                </div>
            </div>
        </div>
    );
}
