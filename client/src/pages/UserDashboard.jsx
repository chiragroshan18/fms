import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MessageSquare, Star, Clock, Tag, PlusCircle, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const res = await api.get('/dashboard/user');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load user dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserStats();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const chartColors = ['#36a9f7', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa'];

  return (
    <AppLayout title="User Dashboard">
      <div className="space-y-6 md:space-y-8">
        {/* Welcome Banner */}
        <GlassCard className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-brand-500/30 bg-gradient-to-r from-brand-900/40 via-slate-900/60 to-slate-900/80 p-6 md:p-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-400">Welcome Back</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Hello, {user?.name}!</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Track your ratings, manage your submitted feedback, and contribute to system improvements.
            </p>
          </div>
          <Button
            onClick={() => navigate('/submit')}
            variant="primary"
            size="lg"
            className="w-full md:w-auto min-h-[44px]"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Submit Feedback
          </Button>
        </GlassCard>

        {loading ? (
          <LoadingSpinner label="Loading dashboard metrics..." />
        ) : (
          <>
            {/* Stat Cards Grid - Fully Responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              <StatCard
                title="Total Feedback"
                value={stats?.totalFeedback || 0}
                icon={MessageSquare}
                color="brand"
                delay={0.1}
              />
              <StatCard
                title="Average Rating"
                value={stats?.averageRating ? `${stats.averageRating} ★` : '0 ★'}
                icon={Star}
                color="amber"
                delay={0.2}
              />
              <StatCard
                title="Latest Feedback"
                value={formatDate(stats?.latestFeedbackDate)}
                icon={Clock}
                color="cyan"
                delay={0.3}
              />
              <StatCard
                title="Top Category"
                value={stats?.topCategory || 'N/A'}
                icon={Tag}
                color="green"
                delay={0.4}
              />
            </div>

            {/* Rating Visualization Chart with Fixed Padding & Visible Labels */}
            <GlassCard delay={0.5} className="p-4 md:p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white">Rating Distribution</h3>
                  <p className="text-xs text-slate-400">Breakdown of stars given across your feedback submissions</p>
                </div>
              </div>

              {stats?.totalFeedback === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-slate-400 text-sm">No feedback submitted yet.</p>
                  <Button
                    onClick={() => navigate('/submit')}
                    variant="secondary"
                    size="sm"
                    className="mt-4"
                  >
                    Submit Your First Feedback
                  </Button>
                </div>
              ) : (
                <div className="h-72 sm:h-80 w-full pt-2 pb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.ratingDistribution || []} margin={{ top: 20, right: 30, left: 10, bottom: 35 }}>
                      <XAxis dataKey="stars" stroke="#cbd5e1" fontSize={12} tickLine={true} dy={10} />
                      <YAxis stroke="#cbd5e1" fontSize={12} allowDecimals={false} tickLine={true} dx={-5} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {(stats?.ratingDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </AppLayout>
  );
};
