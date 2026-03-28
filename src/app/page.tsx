'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SurveyPage() {
  const [rating, setRating] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating || !response.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, response }),
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-5xl">✅</div>
          <h2 className="text-2xl font-bold">Thanks for your feedback!</h2>
          <p className="text-gray-400">Your response has been recorded.</p>
          <Link
            href="/results"
            className="inline-block mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition-colors"
          >
            View Results →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Overclock Accelerator</p>
            <h1 className="text-3xl font-bold mt-1">Session 1 Feedback</h1>
          </div>
          <Link
            href="/results"
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
          >
            View Results
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-lg font-semibold">
              How would you rate Session 1 overall?
              <span className="block text-sm text-gray-400 font-normal mt-1">1 = Poor, 10 = Excellent</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`w-12 h-12 rounded-lg font-bold text-lg transition-all ${
                    rating === n
                      ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-semibold">
              What&apos;s one thing you&apos;ll take away from Session 1?
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={5}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!rating || !response.trim() || loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-bold text-lg transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </main>
  );
}
