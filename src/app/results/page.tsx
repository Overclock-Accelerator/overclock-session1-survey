'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResultsData {
  average: number;
  total: number;
  distribution: { score: number; count: number }[];
}

export default function ResultsPage() {
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/results')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError('Failed to load results.'); setLoading(false); });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-orange-400 text-sm font-semibold uppercase tracking-widest">Overclock Accelerator</p>
            <h1 className="text-3xl font-bold mt-1">Session 1 Results</h1>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-2 rounded-lg transition-colors"
          >
            ← Take Survey
          </Link>
        </div>

        {loading && (
          <div className="text-gray-400 text-center py-20">Loading results...</div>
        )}

        {error && (
          <div className="text-red-400 text-center py-20">{error}</div>
        )}

        {data && !loading && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-2xl p-6 text-center border border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Average Score</p>
                <p className="text-5xl font-bold text-orange-400">
                  {data.total > 0 ? data.average.toFixed(1) : '—'}
                </p>
                <p className="text-gray-500 text-sm mt-1">out of 10</p>
              </div>
              <div className="bg-gray-900 rounded-2xl p-6 text-center border border-gray-800">
                <p className="text-gray-400 text-sm mb-2">Total Responses</p>
                <p className="text-5xl font-bold text-white">{data.total}</p>
                <p className="text-gray-500 text-sm mt-1">submissions</p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold mb-6 text-gray-200">Score Distribution</h2>
              {data.total === 0 ? (
                <p className="text-gray-500 text-center py-10">No responses yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.distribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="score" tick={{ fill: '#9ca3af', fontSize: 13 }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#9ca3af', fontSize: 13 }} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                      labelStyle={{ color: '#f97316' }}
                      itemStyle={{ color: '#e5e7eb' }}
                      formatter={(value) => [value, 'responses']}
                      labelFormatter={(label) => `Score: ${label}`}
                    />
                    <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
