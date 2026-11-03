import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <Link href="/" className="text-blue-400 text-sm hover:underline mb-6 inline-block">
        ← ආපසු Home පිටුවට
      </Link>
      
      <h1 className="text-3xl font-extrabold mb-2 text-blue-400">Privacy Policy</h1>
      <p className="text-slate-400 text-sm mb-8">ලද අවසාන යාවත්කාලීන කිරීම: 2026 ඔක්තෝබර් 26</p>

      <section className="space-y-6 text-slate-300">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">1. Introduction</h2>
          <p>
            Welcome to GanithaMithura (Ganan AI). We respect your privacy and are committed to protecting the personal data of our users. This policy outlines how we collect, use, and safeguard your information when using our application and website (ganan.com.lk).
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Account Data:</strong> Name, Email address provided during registration.</li>
            <li><strong>Usage & Input Data:</strong> Questions, text, or images scanned for mathematical problem solving.</li>
            <li><strong>Payment Data:</strong> Payment processing is handled securely by PayHere. We do not store your credit card or banking details directly on our servers.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and improve AI-assisted educational features.</li>
            <li>Manage user accounts and subscriptions.</li>
            <li>Send important updates regarding your account or service.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">4. Data Security & Third Parties</h2>
          <p>
            We implement industry-standard security measures to protect your data. We do not sell or rent your personal information to third parties. Data processed via AI models is strictly used to return accurate solutions for users.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p className="font-semibold text-blue-300 mt-1">Email: support@ganan.com.lk</p>
        </div>
      </section>
    </main>
  );
}