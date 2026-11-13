import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 pb-28 md:p-12 md:pb-28 max-w-4xl mx-auto font-sans leading-relaxed">
      <Link href="/login" className="text-emerald-400 text-sm hover:underline mb-6 inline-block font-semibold">
        ← Back to Account Page
      </Link>
      
      <h1 className="text-3xl font-extrabold mb-2 text-emerald-400">Terms & Conditions</h1>
      <p className="text-slate-400 text-sm mb-8">Last Updated: November 13, 2026</p>

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
            Certain advanced features or subscription plans require online payment (such as the Pro Monthly Package at LKR 300.00/month). Payments are processed securely via PayHere. All charges are displayed clearly before transaction confirmation.
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
          <p className="text-sm">For any inquiries regarding these Terms & Conditions, please contact us at:</p>
          <p className="font-semibold text-emerald-400 mt-1 text-sm">Email: ganithamithura52@gmail.com</p>
        </div>
      </section>
    </main>
  );
}