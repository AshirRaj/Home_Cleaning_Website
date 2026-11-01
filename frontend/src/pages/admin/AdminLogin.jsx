import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminLoginSchema } from '../../utils/validation';
import { useAdminLogin } from '../../hooks/useAdmin';
import { authApi } from '../../api/authApi';
import { useAdminAuth } from '../../store/adminAuthStore';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  Sparkles,
  Mail,
  KeyRound,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Lock,
} from 'lucide-react';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const loginMutation = useAdminLogin();
  const { loginAdmin, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Mode: 'LOGIN' or 'FORGOT_PASSWORD'
  const [mode, setMode] = useState('LOGIN');

  // Login UI state
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Reset State (via Previous Password)
  const [forgotEmail, setForgotEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = (data) => {
    setAuthError('');
    setSuccessMessage('');
    loginMutation.mutate(data, {
      onSuccess: (res) => {
        if (res?.user && res?.token) {
          loginAdmin(res.user, res.token);
        }
        navigate('/admin/dashboard', { replace: true });
      },
      onError: (err) => {
        setAuthError(err.response?.data?.message || err.message || 'Invalid admin credentials');
      },
    });
  };

  // Submit Password Reset via Previous Password
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!oldPassword) {
      setForgotError('Please enter your previous/current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('New password and confirm password do not match.');
      return;
    }

    try {
      setIsResetting(true);
      const res = await authApi.changePassword({
        oldPassword,
        newPassword,
        email: forgotEmail,
      });
      localStorage.setItem('sparkle_admin_password', newPassword);
      setSuccessMessage(res.message || 'Password updated successfully! Please sign in with your new password.');
      setValue('email', forgotEmail);
      setValue('password', newPassword);
      setMode('LOGIN');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || 'Failed to update password. Please check your previous password.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto text-slate-950 font-bold shadow-lg shadow-teal-500/20">
          <Sparkles className="w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">SAGARIKA Admin Portal</h1>
        <p className="text-xs text-slate-400">Internal Cleaning Staff & Booking Operations Dashboard</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white text-slate-900 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/20 space-y-6">
          {/* Mode Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {mode === 'LOGIN' ? 'Sign In to Account' : 'Reset Password via Previous Password'}
            </h2>
            {mode === 'FORGOT_PASSWORD' && (
              <button
                type="button"
                onClick={() => {
                  setMode('LOGIN');
                  setForgotError('');
                }}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            )}
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STANDARD LOGIN FORM */}
          {mode === 'LOGIN' && (
            <>
              {authError && (
                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Admin Email Address"
                  required
                  icon={Mail}
                  placeholder="admin@sagarika.com"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setMode('FORGOT_PASSWORD');
                        setAuthError('');
                        setSuccessMessage('');
                      }}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    required
                    icon={KeyRound}
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      {...register('rememberMe')}
                    />
                    <span className="text-xs text-slate-600">Remember admin session</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full shadow-lg shadow-teal-600/30"
                  isLoading={loginMutation.isPending}
                >
                  Sign In to Admin Dashboard →
                </Button>
              </form>
            </>
          )}

          {/* RESET PASSWORD VIA PREVIOUS PASSWORD FORM */}
          {mode === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block">Verify Previous Password</span>
                <p className="text-[11px] text-slate-500">
                  Enter your registered admin email and your current/previous password to set a new password.
                </p>
              </div>

              {forgotError && (
                <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              <Input
                label="Admin Email"
                type="email"
                required
                icon={Mail}
                placeholder="admin@sagarika.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              <Input
                label="Previous / Current Password"
                type="password"
                required
                icon={Lock}
                placeholder="Enter previous password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <Input
                label="New Password"
                type="password"
                required
                icon={KeyRound}
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                label="Confirm New Password"
                type="password"
                required
                icon={KeyRound}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-teal-600/30"
                isLoading={isResetting}
              >
                Update Password via Previous Password ✓
              </Button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Authorized staff members only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
