import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 max-w-4xl mx-auto font-sans leading-relaxed">
      <Link href="/login" className="text-emerald-400 text-sm hover:underline mb-6 inline-block font-semibold">
        ← Back to Account Page
      </Link>
      
      <h1 className="text-3xl font-extrabold mb-2 text-emerald-400">Refund Policy</h1>
      <p className="text-slate-400 text-sm mb-8">Last Updated: October 26, 2026</p>

      <section className="space-y-6 text-slate-300">
        
        {/* 1. Overview */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">1. Refund Eligibility</h2>
          <p>
            At GanithaMithura (ganan.com.lk), we strive to deliver high-quality AI educational assistance. If you experience technical issues or are dissatisfied with a digital subscription plan, you may request a refund within <strong>7 days</strong> from the date of purchase, subject to our Fair Usage Policy outlined below.
          </p>
        </div>

        {/* 2. Non-Refundable Conditions */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">2. Non-Refundable Conditions</h2>
          <p className="mb-2">Refund requests will not be eligible under the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
            <li>
              If you have asked <strong>more than 20 AI questions</strong> or utilized more than 10% of the premium subscription features.
            </li>
            <li>
              If the refund request is due to a change of mind without any verified technical issues on our platform.
            </li>
            <li>
              If your account has been suspended or terminated due to a breach of our Terms and Conditions.
            </li>
          </ul>
        </div>

        {/* 3. Valid Refund Reasons */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">3. Valid Refund Reasons</h2>
          <ul className="list-disc pl-5 space-y-1 text-slate-300 text-sm">
            <li>Duplicate charges resulting from system or payment gateway glitches.</li>
            <li>Inability to access premium features due to unresolvable technical errors on our server end.</li>
          </ul>
        </div>

        {/* 4. PayHere Mandatory Statement */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">4. Refund Processing & Payment Method</h2>
          <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 my-3">
            <p className="font-semibold text-emerald-300 text-sm">
              "All refunds will be credited back to the original payment method used to initiate the payment."
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Approved refunds will be processed within 5 to 10 business days, depending on your card issuer or banking partner.
          </p>
        </div>

        {/* 5. Contact Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-2">5. How to Request a Refund</h2>
          <p className="text-sm">
            To submit a refund request, please email our support team with your registered email address and transaction ID:
          </p>
          <p className="font-bold text-emerald-400 mt-1 text-sm">Email:ganithamithura52@gmail.com</p>
        </div>

      </section>
    </main>
  );
}