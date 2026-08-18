import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { GlassCard } from '../components/GlassCard';
import { Select } from '../components/Select';
import { RatingStars } from '../components/RatingStars';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { MessageSquarePlus, Tag, Send, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export const SubmitFeedback = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCats, setFetchingCats] = useState(true);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setCategoryId(res.data[0].id);
        }
      } catch (err) {
        setToast({ message: 'Failed to load categories', type: 'error' });
      } finally {
        setFetchingCats(false);
      }
    };
    fetchCats();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!categoryId) newErrors.categoryId = 'Please select a category';
    if (!rating || rating < 1 || rating > 5) newErrors.rating = 'Please select a star rating (1-5)';
    if (!comment.trim()) newErrors.comment = 'Please provide a detailed comment';
    if (comment.length > 1000) newErrors.comment = 'Comment cannot exceed 1000 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setToast({ message: '', type: '' });

    try {
      await api.post('/feedback', {
        categoryId,
        rating,
        comment,
      });

      setToast({ message: '✓ Feedback Submitted Successfully', type: 'success' });
      
      setTimeout(() => {
        navigate('/my-feedback');
      }, 1000);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Submit Feedback">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Share Your Feedback</h2>
            <p className="text-sm text-slate-400">We value your input to continuously improve our services</p>
          </div>
        </div>

        <GlassCard className="p-8 space-y-6 border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Select */}
            <Select
              label="Feedback Category"
              icon={Tag}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={fetchingCats}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              error={errors.categoryId}
            />

            {/* Interactive Rating */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Overall Rating
              </label>
              <div className="p-4 rounded-xl glass-input flex items-center justify-between">
                <RatingStars
                  rating={rating}
                  onChange={(val) => setRating(val)}
                  size="lg"
                  showLabel={true}
                />
                <span className="text-2xl font-black text-amber-400">{rating} / 5</span>
              </div>
              {errors.rating && <span className="text-xs text-rose-400">{errors.rating}</span>}
            </div>

            {/* Comment Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
                Comments & Details
              </label>
              <textarea
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share specific thoughts, suggestions, or issues you encountered..."
                className={`glass-input w-full rounded-xl p-4 text-sm placeholder:text-slate-500 focus:outline-none ${
                  errors.comment ? 'border-rose-500/60' : ''
                }`}
              />
              <div className="flex justify-between items-center text-xs text-slate-400 mt-1">
                <span>{errors.comment ? <span className="text-rose-400">{errors.comment}</span> : 'Be clear and constructive'}</span>
                <span>{comment.length} / 1000</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full"
            >
              <Send className="w-5 h-5 mr-2" />
              Submit Feedback
            </Button>
          </form>
        </GlassCard>
      </div>
    </AppLayout>
  );
};
