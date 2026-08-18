import React, { useEffect, useState, useCallback } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { GlassCard } from '../components/GlassCard';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { RatingStars } from '../components/RatingStars';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Search, Filter, Trash2, Calendar, Tag, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { api } from '../services/api';

export const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  const debouncedSearch = useDebounce(search, 300);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchFeedback = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(categoryFilter !== 'ALL' && { category: categoryFilter }),
        ...(ratingFilter !== 'ALL' && { rating: ratingFilter }),
      });

      const res = await api.get(`/admin/feedback?${params.toString()}`);
      setFeedbackList(res.data.feedback);
      setPagination(res.data.pagination);
    } catch (err) {
      setToast({ message: 'Failed to fetch feedback list', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, categoryFilter, ratingFilter]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetchFeedback(1);
  }, [fetchFeedback]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/feedback/${selectedFeedback.id}`);
      setToast({ message: '✓ Feedback record deleted', type: 'success' });
      setDeleteModalOpen(false);
      fetchFeedback(pagination.currentPage);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout title="Feedback Management">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">All User Submissions</h2>
          <p className="text-sm text-slate-400">Search, filter, inspect, and manage system feedback records</p>
        </div>

        {/* Search & Filters Bar */}
        <GlassCard className="p-5 border-white/15">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search user, email, or comment..."
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select
              icon={Filter}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder={null}
              options={[
                { value: 'ALL', label: 'All Categories' },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />

            <Select
              icon={Filter}
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              placeholder={null}
              options={[
                { value: 'ALL', label: 'All Ratings' },
                { value: '5', label: '5 Stars' },
                { value: '4', label: '4 Stars' },
                { value: '3', label: '3 Stars' },
                { value: '2', label: '2 Stars' },
                { value: '1', label: '1 Star' },
              ]}
            />
          </div>
        </GlassCard>

        {/* Data Table / Cards */}
        {loading ? (
          <LoadingSpinner label="Fetching paginated database records..." />
        ) : feedbackList.length === 0 ? (
          <GlassCard className="text-center py-16 border-dashed border-white/10">
            <p className="text-slate-300 font-semibold">No feedback matches your search or filters.</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your query or resetting the filter options.</p>
          </GlassCard>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-200">
                  <thead className="bg-white/5 text-xs text-slate-400 uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Rating</th>
                      <th className="px-6 py-4">Comment</th>
                      <th className="px-6 py-4">Submitted</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {feedbackList.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{item.user?.name}</div>
                          <div className="text-xs text-slate-400">{item.user?.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                            {item.category?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <RatingStars rating={item.rating} readOnly={true} size="sm" />
                        </td>
                        <td className="px-6 py-4 max-w-sm truncate text-slate-300" title={item.comment}>
                          "{item.comment}"
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">{formatDate(item.createdAt)}</td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            onClick={() => {
                              setSelectedFeedback(item);
                              setDeleteModalOpen(true);
                            }}
                            variant="danger"
                            size="sm"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {feedbackList.map((item) => (
                <GlassCard key={item.id} className="space-y-3 border-white/15">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-base">{item.user?.name}</div>
                      <div className="text-xs text-slate-400">{item.user?.email}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      {item.category?.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <RatingStars rating={item.rating} readOnly={true} size="sm" />
                    <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                  </div>

                  <p className="text-sm text-slate-200">"{item.comment}"</p>

                  <div className="pt-3 border-t border-white/10 flex justify-end">
                    <Button
                      onClick={() => {
                        setSelectedFeedback(item);
                        setDeleteModalOpen(true);
                      }}
                      variant="danger"
                      size="sm"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Database Pagination Controls */}
            <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-white/15">
              <span className="text-xs text-slate-400">
                Showing <span className="font-semibold text-white">{(pagination.currentPage - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-semibold text-white">
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)}
                </span>{' '}
                of <span className="font-semibold text-white">{pagination.totalRecords}</span> records
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => fetchFeedback(pagination.currentPage - 1)}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => fetchFeedback(pagination.currentPage + 1)}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </GlassCard>
          </>
        )}
      </div>

      {/* Admin Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Admin Delete Record"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm">Are you sure you want to permanently delete this feedback submission by <span className="font-bold">{selectedFeedback?.user?.name}</span>?</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleteLoading} onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};
