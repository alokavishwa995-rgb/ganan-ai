import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <Link href="/" className="text-blue-400 text-sm hover:underline mb-6 inline-block">
        ← ආපසු Home පිටුවට
      </Link>
      
      <h1 className="text-3xl font-extrabold mb-2 text-blue-400">Terms & Conditions</h1>
      <p className="text-slate-400 text-sm mb-8">ලද අවසාන යාවත්කාලීන කිරීම: 2026 ඔක්තෝබර් 26</p>

      <section className="space-y-6 text-slate-300">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">1. Agreement to Terms</h2>
          <p>
            By accessing or using GanithaMithura (ganan.com.lk), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">2. Educational Use Only</h2>
          <p>
            GanithaMithura is designed to assist students with educational learning, mathematical explanations, and step-by-step problem solving. While AI provides high accuracy, users should verify solutions independently for formal academic submissions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree not to misuse the service for automated abuse, spam, or unlawful activities.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">4. Payments & Subscriptions</h2>
          <p>
            Certain advanced features or subscription plans require online payment. Payments are processed via PayHere. All charges are displayed clearly before transaction confirmation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">5. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of Sri Lanka.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">6. Contact Information</h2>
          <p className="font-semibold text-blue-300">Email: support@ganan.com.lk</p>
        </div>
      </section>
    </main>
  );
}