import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { userAPI } from '../api/index.js';
import { Button, Input, Card, Alert } from '../components/ui/index.jsx';

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  // ── Profile Edit State ──
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);

  // ── Password Change State ──
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  // ── Profile Update ──
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const { data } = await userAPI.updateProfile(profileForm);
      setUser(data.user); // Update auth context
      setProfileSuccess('✅ Profile updated successfully!');
      setEditingProfile(false);
      setTimeout(() => setProfileSuccess(''), 4000);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // ── Password Change ──
  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNewPassword) { setPwError('Passwords do not match'); return; }
    if (pwForm.newPassword.length < 6) { setPwError('Min 6 characters required'); return; }
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      await userAPI.changePassword(pwForm);
      setPwSuccess('✅ Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => setPwSuccess(''), 4000);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const strength = pwForm.newPassword.length;
  const strengthLabel = strength === 0 ? '' : strength < 6 ? 'Too short' : strength < 9 ? 'Weak' : strength < 12 ? 'Good' : 'Strong';
  const strengthColor = strength < 6 ? 'bg-red-400' : strength < 9 ? 'bg-yellow-400' : strength < 12 ? 'bg-blue-400' : 'bg-green-500';

  const PwInput = ({ label, name, showKey, value }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show[showKey] ? 'text' : 'password'}
          value={value}
          onChange={(e) => setPwForm((p) => ({ ...p, [name]: e.target.value }))}
          required
          placeholder="••••••••"
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm pr-16 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />
        <button type="button" onClick={() => setShow((p) => ({ ...p, [showKey]: !p[showKey] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-600 hover:text-purple-800">
          {show[showKey] ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {/* ── Account Info Card ── */}
      <Card className="p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                {user?.role}
              </span>
            </div>
          </div>
          {!editingProfile && (
            <Button size="sm" variant="outline" onClick={() => setEditingProfile(true)}>
              Edit Profile
            </Button>
          )}
        </div>

        {/* Edit Form */}
        {editingProfile ? (
          <form onSubmit={handleProfileSave} className="space-y-4 border-t border-gray-100 pt-5">
            <h3 className="font-semibold text-gray-800 text-sm">Edit Your Details</h3>
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your full name"
              required
            />
            <div>
              <Input
                label="Email Address"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-amber-600 mt-1">⚠️ Changing email will update your login email</p>
            </div>
            <Input
              label="Phone Number (optional)"
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+91 9876543210"
            />
            {profileError && <Alert message={profileError} />}
            {profileSuccess && <Alert type="success" message={profileSuccess} />}
            <div className="flex gap-3">
              <Button type="submit" loading={profileLoading}>Save Changes</Button>
              <Button type="button" variant="secondary" onClick={() => {
                setEditingProfile(false);
                setProfileError('');
                setProfileForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
              }}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm bg-gray-50 rounded-xl p-4">
            {[
              { label: 'Name', value: user?.name },
              { label: 'Email', value: user?.email },
              { label: 'Phone', value: user?.phone || '—' },
              { label: 'Account Type', value: user?.role },
            ].map(({ label, value }) => (
              <div key={label}>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-0.5">{label}</span>
                <span className="font-medium text-gray-800 capitalize">{value}</span>
              </div>
            ))}
          </div>
        )}
        {profileSuccess && !editingProfile && <Alert type="success" message={profileSuccess} className="mt-3" />}
      </Card>

      {/* ── Change Password Card ── */}
      <Card className="p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold text-gray-900 mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 mb-5">Keep your account secure with a strong password.</p>

        <form onSubmit={handlePwChange} className="space-y-4">
          <PwInput label="Current Password" name="currentPassword" value={pwForm.currentPassword} showKey="current" />
          <PwInput label="New Password" name="newPassword" value={pwForm.newPassword} showKey="new" />

          {/* Strength bar */}
          {pwForm.newPassword && (
            <div className="space-y-1">
              <div className="flex gap-1.5">
                {[1,2,3,4].map((l) => (
                  <div key={l} className={`h-1.5 flex-1 rounded-full transition-all ${strength >= l * 3 ? strengthColor : 'bg-gray-200'}`} />
                ))}
              </div>
              <p className="text-xs text-gray-500">{strengthLabel}</p>
            </div>
          )}

          <PwInput label="Confirm New Password" name="confirmNewPassword" value={pwForm.confirmNewPassword} showKey="confirm" />

          {pwForm.confirmNewPassword && (
            <p className={`text-xs font-medium ${pwForm.newPassword === pwForm.confirmNewPassword ? 'text-green-600' : 'text-red-500'}`}>
              {pwForm.newPassword === pwForm.confirmNewPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}

          {pwError && <Alert message={pwError} />}
          {pwSuccess && <Alert type="success" message={pwSuccess} />}

          <Button
            type="submit"
            loading={pwLoading}
            disabled={!pwForm.currentPassword || !pwForm.newPassword || pwForm.newPassword !== pwForm.confirmNewPassword}
            className="w-full sm:w-auto"
          >
            Update Password
          </Button>
        </form>

        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-700 mb-1.5">💡 Tips</p>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Minimum 6 characters</li>
            <li>• Mix letters, numbers and symbols</li>
            <li>• Don't share your password with anyone</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}