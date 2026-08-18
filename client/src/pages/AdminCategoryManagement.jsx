import React, { useEffect, useState } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { GlassCard } from '../components/GlassCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Tag, Plus, Edit3, Trash2, AlertTriangle, MessageSquare } from 'lucide-react';
import { api } from '../services/api';

export const AdminCategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Category State
  const [newCatName, setNewCatName] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState({ message: '', type: '' });

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load categories', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setToast({ message: 'Please enter a category name', type: 'error' });
      return;
    }

    setAddLoading(true);
    try {
      await api.post('/admin/categories', { name: newCatName.trim() });
      setToast({ message: '✓ Category added successfully', type: 'success' });
      setNewCatName('');
      fetchCategories();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setAddLoading(false);
    }
  };

  const handleOpenEdit = (cat) => {
    setSelectedCat(cat);
    setEditCatName(cat.name);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editCatName.trim()) {
      setToast({ message: 'Category name cannot be empty', type: 'error' });
      return;
    }

    setEditLoading(true);
    try {
      await api.put(`/admin/categories/${selectedCat.id}`, { name: editCatName.trim() });
      setToast({ message: '✓ Category updated successfully', type: 'success' });
      setEditModalOpen(false);
      fetchCategories();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setEditLoading(false);
    }
  };

  const handleOpenDelete = (cat) => {
    if (cat._count?.feedbacks > 0) {
      setToast({ message: 'Cannot delete: Category has existing feedback', type: 'error' });
      return;
    }
    setSelectedCat(cat);
    setDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/categories/${selectedCat.id}`);
      setToast({ message: '✓ Category deleted successfully', type: 'success' });
      setDeleteModalOpen(false);
      fetchCategories();
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AppLayout title="Category Management">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="space-y-6 md:space-y-8">
        <div>
          <h2 className="text-2xl font-extrabold text-white">System Categories</h2>
          <p className="text-sm text-slate-400">Manage feedback submission categories available to users</p>
        </div>

        {/* Add New Category Card */}
        <GlassCard className="p-6 border-white/15">
          <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <Input
                label="Add New Category"
                placeholder="e.g. Billing, App Features..."
                icon={Tag}
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" isLoading={addLoading} className="w-full sm:w-auto min-h-[44px]">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </form>
        </GlassCard>

        {/* Category List */}
        {loading ? (
          <LoadingSpinner label="Fetching categories list..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const hasFeedback = cat._count?.feedbacks > 0;
              return (
                <GlassCard key={cat.id} className="flex items-center justify-between p-5 border-white/15">
                  <div className="space-y-1 truncate pr-3">
                    <h3 className="font-bold text-white text-base truncate flex items-center gap-2">
                      <Tag className="w-4 h-4 text-brand-400 shrink-0" />
                      {cat.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{cat._count?.feedbacks || 0} feedback submission(s)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button onClick={() => handleOpenEdit(cat)} variant="secondary" size="sm">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleOpenDelete(cat)}
                      variant="danger"
                      size="sm"
                      disabled={hasFeedback}
                      title={hasFeedback ? 'Cannot delete: Category has existing feedback' : 'Delete category'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Category Modal */}
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Category Name">
        <form onSubmit={handleSaveEdit} className="space-y-5">
          <Input
            label="Category Name"
            icon={Tag}
            value={editCatName}
            onChange={(e) => setEditCatName(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={editLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation Modal */}
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Confirm Category Deletion">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <p className="text-sm">
              Are you sure you want to delete the category <span className="font-bold">"{selectedCat?.name}"</span>?
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" isLoading={deleteLoading} onClick={handleDeleteCategory}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  );
};
