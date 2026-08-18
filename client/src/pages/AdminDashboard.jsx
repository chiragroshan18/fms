import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { StatCard } from '../components/StatCard';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { RatingStars } from '../components/RatingStars';
import { MessageSquare, Star, ThumbsUp, ThumbsDown, BarChart3, PieChart as PieChartIcon, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { api } from '../services/api';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const ratingColors = ['#36a9f7', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa'];
  const categoryColors = ['#36a9f7', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout title="Admin Analytics Dashboard">
      <div className="space-y-6 md:space-y-8">
        <GlassCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-brand-500/30 bg-gradient-to-r from-brand-950/60 via-slate-900/60 to-slate-900/80 p-6 md:p-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-brand-400">System Analytics</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">Feedback Monitoring & Insights</h2>
            <p className="text-sm text-slate-300 mt-1">Real-time stats, distribution charts, and customer satisfaction metrics</p>
          </div>
          <Button onClick={() => navigate('/admin/feedback')} variant="primary" className="w-full sm:w-auto min-h-[44px]">
            Manage Feedback
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </GlassCard>

        {loading ? (
          <LoadingSpinner label="Compiling system aggregate data..." />
        ) : (
          <>
            {/* 4 Stat Cards */}
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
                title="Positive Feedback"
                value={stats?.positiveFeedback || 0}
                trend="Rating ≥ 4"
                icon={ThumbsUp}
                color="green"
                delay={0.3}
              />
              <StatCard
                title="Negative Feedback"
                value={stats?.negativeFeedback || 0}
                trend="Rating ≤ 2"
                icon={ThumbsDown}
                color="rose"
                delay={0.4}
              />
            </div>

            {/* Charts Section with Fixed Padding & Visible Labels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rating Distribution BarChart */}
              <GlassCard delay={0.5} className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400 shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">Rating Breakdown</h3>
                    <p className="text-xs text-slate-400">Overall rating distribution from 1 to 5 stars</p>
                  </div>
                </div>

                <div className="h-72 sm:h-80 w-full pt-2 pb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.ratingDistribution || []} margin={{ top: 20, right: 30, left: 10, bottom: 35 }}>
                      <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={true} dy={10} />
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
                          <Cell key={`cell-${index}`} fill={ratingColors[index % ratingColors.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Category Distribution PieChart */}
              <GlassCard delay={0.6} className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <PieChartIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white">Category Distribution</h3>
                    <p className="text-xs text-slate-400">Feedback proportion by product & service category</p>
                  </div>
                </div>

                <div className="h-72 sm:h-80 w-full pt-2 pb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <Pie
                        data={stats?.categoryDistribution || []}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {(stats?.categoryDistribution || []).map((entry, index) => (
                          <Cell key={`cat-${index}`} fill={categoryColors[index % categoryColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '12px',
                          color: '#fff',
                        }}
                      />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>
            </div>

            {/* Recent Feedback Preview Table */}
            <GlassCard delay={0.7} className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white">Recent Feedback Submissions</h3>
                  <p className="text-xs text-slate-400">Latest feedback received across the system</p>
                </div>
                <Button onClick={() => navigate('/admin/feedback')} variant="secondary" size="sm">
                  View All
                </Button>
              </div>

              {stats?.recentFeedback?.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">No feedback records found in database.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300 min-w-[600px]">
                    <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 rounded-l-xl">User</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Rating</th>
                        <th className="px-4 py-3">Comment</th>
                        <th className="px-4 py-3 rounded-r-xl">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {stats?.recentFeedback?.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-white">{item.user?.name}</div>
                            <div className="text-xs text-slate-400">{item.user?.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                              {item.category?.name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <RatingStars rating={item.rating} readOnly={true} size="sm" />
                          </td>
                          <td className="px-4 py-3 max-w-xs truncate">{item.comment}</td>
                          <td className="px-4 py-3 text-xs text-slate-400">{formatDate(item.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </>
        )}
      </div>
    </AppLayout>
  );
};
