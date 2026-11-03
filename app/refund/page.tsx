import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-slate-900 text-white p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <Link href="/" className="text-blue-400 text-sm hover:underline mb-6 inline-block">
        ← ආපසු Home පිටුවට
      </Link>
      
      <h1 className="text-3xl font-extrabold mb-2 text-blue-400">Refund Policy</h1>
      <p className="text-slate-400 text-sm mb-8">ලද අවසාන යාවත්කාලීන කිරීම: 2026 ඔක්තෝබර් 26</p>

      <section className="space-y-6 text-slate-300">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">1. Subscription Cancellation & Eligibility</h2>
          <p>
            We strive to provide the best AI educational assistance. If you experience technical issues or are dissatisfied with a digital purchase or subscription plan, you may request a refund within 7 days of purchase.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">2. Conditions for Refund</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Duplicate payments processed due to system or gateway glitches.</li>
            <li>Inability to access premium features due to unresolvable technical issues on our platform.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">3. Refund Processing & Payment Method</h2>
          <p className="font-semibold text-amber-300 bg-amber-950/40 p-4 rounded-xl border border-amber-500/30">
            All refunds will be credited back to the original payment method used to initiate the payment.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Approved refunds will be processed within 5–10 business days depending on the card issuer or banking partner.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-2">4. Requesting a Refund</h2>
          <p>To initiate a refund request, please email our support team with your transaction details:</p>
          <p className="font-semibold text-blue-300 mt-1">Email: support@ganan.com.lk</p>
        </div>
      </section>
    </main>
  );
}