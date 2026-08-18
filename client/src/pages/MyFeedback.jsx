import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { GlassCard } from '../components/GlassCard';
import { RatingStars } from '../components/RatingStars';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Edit3, Trash2, Calendar, Tag, PlusCircle, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

export const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Modal States
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  // Edit Form State
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [fbRes, catRes] = await Promise.all([
        api.get('/feedback/my'),
        api.get('/categories'),
      ]);
      setFeedbacks(fbRes.data);
      setCategories(catRes.data);
    } catch (err) {
      setToast({ message: 'Failed to load feedback records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (fb) => {
    setSelectedFeedback(fb);
    setEditCategoryId(fb.categoryId);
    setEditRating(fb.rating);
    setEditComment(fb.comment);
    setEditModalOpen(true);
  };

  const handleOpenDelete = (fb) => {
    setSelectedFeedback(fb);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editComment.trim()) {
      setToast({ message: 'Comment cannot be empty', type: 'error' });
      return;
    }

    setActionLoading(true);
    try {
      await api.put(`/feedback/${selectedFeedback.id}`, {
        categoryId: editCategoryId,
        rating: editRating,
        comment: editComment,
      });

      setToast({ message: '✓ Feedback updated successfully', type: 'success' });
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/feedback/${selectedFeedback.id}`);
      setToast({ message: '✓ Feedback deleted successfully', type: 'success' });
      setDeleteModalOpen(false);
      loadData();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setActionLoading(false);
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
    <AppLayout title="My Feedback">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Your Submitted Feedback</h2>
            <p className="text-sm text-slate-400">View, update, or delete your ratings and comments</p>
          </div>
          <Button onClick={() => navigate('/submit')} variant="primary" size="md">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Feedback
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner label="Retrieving your feedback history..." />
        ) : feedbacks.length === 0 ? (
          <GlassCard className="text-center py-16 border-dashed border-white/10">
            <p className="text-lg font-semibold text-slate-300">No feedback submitted yet.</p>
            <p className="text-sm text-slate-400 mt-1">Your submitted feedback will appear here.</p>
            <Button onClick={() => navigate('/submit')} variant="primary" className="mt-6">
              Submit Feedback Now
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {feedbacks.map((fb) => (
              <GlassCard key={fb.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/15">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />
                      {fb.category?.name || 'Category'}
                    </span>
                    <RatingStars rating={fb.rating} readOnly={true} size="sm" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(fb.createdAt)}
                    </span>
                  </div>

                  <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                    "{fb.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
                  <Button
                    onClick={() => handleOpenEdit(fb)}
                    variant="secondary"
                    size="sm"
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleOpenDelete(fb)}
                    variant="danger"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Feedback"
      >
        <form onSubmit={handleSaveEdit} className="space-y-5">
          <Select
            label="Category"
            value={editCategoryId}
            onChange={(e) => setEditCategoryId(e.target.value)}
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
          />

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300 uppercase">Rating</label>
            <div className="p-3 glass-input rounded-xl flex items-center justify-between">
              <RatingStars rating={editRating} onChange={(val) => setEditRating(val)} size="md" />
              <span className="font-bold text-amber-400">{editRating} / 5</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase">Comment</label>
            <textarea
              rows={4}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="glass-input w-full rounded-xl p-3 text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={actionLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm">Are you sure you want to delete this feedback? This action cannot be undone.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={actionLoading} onClick={handleDelete}>
              Delete Feedback
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};
