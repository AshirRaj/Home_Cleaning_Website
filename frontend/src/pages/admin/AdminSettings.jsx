import { useState } from 'react';
import { useAdminAuth } from '../../store/adminAuthStore';
import { authApi } from '../../api/authApi';
import { resolvedBaseURL } from '../../api/axiosInstance';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import {
  ShieldCheck,
  Bell,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminSettings = () => {
  const { adminUser, loginAdmin } = useAdminAuth();

  // Form State: Change via Previous Password
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Feedback & Password Visibility
  const [showPasswords, setShowPasswords] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit: Change via Old Password
  const handleResetViaOldPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword) {
      setErrorMsg('Please enter your previous/current password.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('New password and confirm password do not match.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await authApi.changePassword({
        oldPassword,
        newPassword,
        email: adminUser?.email,
      });
      if (res?.token && res?.user) {
        loginAdmin(res.user, res.token);
      }
      localStorage.setItem('sparkle_admin_password', newPassword);
      setSuccessMsg(res.message || 'Password updated successfully! Subsequent admin logins will require your new password.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update password. Please verify your current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h2 className="text-xl font-bold text-slate-900">Admin Control & Security Settings</h2>
        <p className="text-xs text-slate-500">SAGARIKA ODICARE SERVICES operating parameters & profile security</p>
      </div>

      {/* Active Admin Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Active Admin Profile
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block font-medium">Administrator Name</span>
            <span className="font-bold text-slate-900 text-sm">{adminUser?.name || 'Sagarika Admin'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Email Address</span>
            <span className="font-bold text-slate-900 text-sm">{adminUser?.email || 'admin@sagrika.com'}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Access Role</span>
            <span className="font-bold text-teal-700">SUPER_ADMIN</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">API Base URL</span>
            <span className="font-mono text-slate-900">{resolvedBaseURL}</span>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-600" /> Change Admin Password
            </h3>
            <p className="text-xs text-slate-500">
              Update your password using your current/previous password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPasswords ? 'Hide Inputs' : 'Show Passwords'}</span>
          </button>
        </div>

        {/* Global Feedback Notifications */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-xl text-xs font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Change Password Form */}
        <form onSubmit={handleResetViaOldPassword} className="space-y-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-xs font-bold text-slate-900">Verify Previous Password:</span>
            <p className="text-[11px] text-slate-500">
              Enter your current admin password to authorize the change.
            </p>
          </div>

          <Input
            label="Previous / Current Password"
            type={showPasswords ? 'text' : 'password'}
            required
            icon={Lock}
            placeholder="Enter current password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type={showPasswords ? 'text' : 'password'}
              required
              icon={KeyRound}
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type={showPasswords ? 'text' : 'password'}
              required
              icon={KeyRound}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              isLoading={isSubmitting}
              className="w-full sm:w-auto shadow-md shadow-teal-600/20"
            >
              Update Password ✓
            </Button>
          </div>
        </form>
      </div>

      {/* Operations Info Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" /> Offline Operations Status
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Customer home cleaning bookings received on this frontend are stored in the bookings ledger. Admin staff receives instant alerts and handles cleaner dispatch offline across Bhubaneswar, Cuttack, Puri, and Khorda.
        </p>
      </div>
    </div>
  );
};
