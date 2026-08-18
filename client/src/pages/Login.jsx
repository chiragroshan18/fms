import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, KeyRound } from 'lucide-react';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  
  // Direct Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setToast({ message: '', type: '' });

    try {
      const res = await api.post('/auth/login', data);
      setToast({ message: 'Login successful! Redirecting...', type: 'success' });
      login(res.data.user, res.data.token);

      setTimeout(() => {
        if (res.data.user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 800);
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectPasswordReset = async (e) => {
    e.preventDefault();

    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setToast({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }

    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters long', type: 'error' });
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }

    setForgotLoading(true);
    try {
      const res = await api.post('/auth/direct-reset-password', {
        email: forgotEmail,
        newPassword: forgotNewPassword,
      });

      setToast({ message: res.message || 'Password reset successfully! You can now log in.', type: 'success' });
      setForgotModalOpen(false);
      setForgotEmail('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <BackgroundBlobs />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <Logo size="lg" className="mb-4" />
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-sm text-slate-400 mt-1">Sign in to your Feedback Management account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address format',
              },
            })}
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
              })}
            />

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-xs font-semibold text-brand-300 hover:text-brand-200 transition-colors"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mt-2 min-h-[44px]"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-white/10 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-300 hover:text-brand-200 underline transition-colors">
            Register here
          </Link>
        </div>
      </motion.div>

      {/* Direct Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
      >
        <form onSubmit={handleDirectPasswordReset} className="space-y-4">
          <p className="text-xs text-slate-300">
            Enter your account email address and your new password below to reset your password directly.
          </p>

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={forgotNewPassword}
            onChange={(e) => setForgotNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={forgotConfirmPassword}
            onChange={(e) => setForgotConfirmPassword(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="secondary" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={forgotLoading}>
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
