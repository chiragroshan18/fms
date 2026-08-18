import React, { useState } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { GlassCard } from '../components/GlassCard';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { User, Mail, ShieldCheck, Calendar, Lock, AlertTriangle, KeyRound } from 'lucide-react';
import { api } from '../services/api';

export const Profile = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (isAdmin) {
      setToast({
        message: 'Admin password cannot be changed here. Update ADMIN_PASSWORD in server/.env and re-seed.',
        type: 'error',
      });
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setToast({ message: 'Please fill in all password fields', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    setLoading(true);
    setToast({ message: '', type: '' });

    try {
      const res = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });

      setToast({ message: '✓ Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Profile">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* User Account Info Card */}
        <GlassCard className="p-6 md:p-8 space-y-6 border-white/20">
          <div className="flex items-center gap-5 pb-6 border-b border-white/10">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 p-1 shadow-glow-blue flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-brand-300 text-2xl md:text-3xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">{user?.name}</h2>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wider">
                {user?.role} ACCOUNT
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl glass-input">
              <User className="w-5 h-5 text-brand-400 shrink-0" />
              <div className="truncate">
                <span className="text-xs text-slate-400 font-medium block">Full Name</span>
                <span className="text-sm font-semibold text-white truncate block">{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl glass-input">
              <Mail className="w-5 h-5 text-brand-400 shrink-0" />
              <div className="truncate">
                <span className="text-xs text-slate-400 font-medium block">Email Address</span>
                <span className="text-sm font-semibold text-white truncate block">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl glass-input">
              <ShieldCheck className="w-5 h-5 text-brand-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 font-medium block">System Role</span>
                <span className="text-sm font-semibold text-white">{user?.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl glass-input">
              <Calendar className="w-5 h-5 text-brand-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 font-medium block">Account Created</span>
                <span className="text-sm font-semibold text-white">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Change Password Section */}
        <GlassCard className="p-6 md:p-8 space-y-6 border-white/20">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Change Password</h3>
              <p className="text-xs text-slate-400">Update your account login password</p>
            </div>
          </div>

          {isAdmin ? (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm leading-relaxed">
                ⚠️ Admin password cannot be changed here. Please update <code className="bg-amber-950 px-1.5 py-0.5 rounded text-amber-200">ADMIN_PASSWORD</code> in <code className="bg-amber-950 px-1.5 py-0.5 rounded text-amber-200">server/.env</code> file and re-seed the database.
              </p>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" isLoading={loading} className="w-full sm:w-auto min-h-[44px]">
                  Update Password
                </Button>
              </div>
            </form>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
};
