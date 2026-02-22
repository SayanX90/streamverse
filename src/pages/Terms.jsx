import React from 'react';

export default function Terms() {
    return (
        <div className="w-full min-h-screen bg-[#050505] pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">Terms of Service</h1>

            <div className="space-y-8 text-white/60 leading-relaxed">
                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using StreamVerse, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Subscription & Usage</h2>
                    <p>
                        StreamVerse provides a subscription-based streaming service. You must be 18 years of age, or the age of majority in your province, territory or country, to become a member of the StreamVerse service.
                    </p>
                    <p>
                        The StreamVerse service and any content viewed through our service are for your personal and non-commercial use only.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Content Rights</h2>
                    <p>
                        All content provided on the platform is protected by copyright, trade secret, or other intellectual property laws. You agree not to archive, download (other than through caching necessary for personal use), reproduce, distribute, modify, display, perform, publish, license, or create derivative works from the content.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Termination</h2>
                    <p>
                        We may terminate or restrict your use of our service, without compensation or notice, if you are, or if we suspect that you are (i) in violation of any of these Terms of Service or (ii) engaged in illegal or improper use of the service.
                    </p>
                </section>

                <div className="pt-8 text-sm italic">
                    Last updated: February 20, 2026
                </div>
            </div>
        </div>
    );
}
