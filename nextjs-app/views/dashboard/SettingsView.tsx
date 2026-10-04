'use client';

import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Bell, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export const SettingsView: React.FC = () => {
  // Notification states
  const [morningReminder, setMorningReminder] = useState(true);
  const [whatsappUpdates, setWhatsappUpdates] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  // Preference save state
  const [prefSaved, setPrefSaved] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setPasswordSuccess('Your account password has been updated securely.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
          Preferences & Security
        </span>
        <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
          Settings
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Customize your sadhana notifications, shala batch alerts, and login credentials.
        </p>
      </div>

      {/* 1. Notification Preferences */}
      <form onSubmit={handleSavePreferences} className="bg-surface border border-border rounded p-6 shadow-soft space-y-5">
        <div className="flex items-center justify-between border-b border-border/80 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gold-600" />
            <h2 className="text-sm font-semibold text-plum-900 uppercase tracking-wider">
              Sadhana Alerts & Notifications
            </h2>
          </div>
          {prefSaved && (
            <span className="text-xs font-mono text-emerald-700 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={morningReminder}
              onChange={(e) => setMorningReminder(e.target.checked)}
              className="mt-1 w-4 h-4 accent-plum-900 rounded border-border"
            />
            <div>
              <p className="text-xs font-semibold text-plum-900">Morning Shala Wake-up & Batch Reminder</p>
              <p className="text-[11px] text-ink-muted">Receive a silent alert 45 minutes before morning sadhana begins.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={whatsappUpdates}
              onChange={(e) => setWhatsappUpdates(e.target.checked)}
              className="mt-1 w-4 h-4 accent-plum-900 rounded border-border"
            />
            <div>
              <p className="text-xs font-semibold text-plum-900">WhatsApp Shala Notices</p>
              <p className="text-[11px] text-ink-muted">Urgent batch schedule shifts, festival pujas, and rain venue announcements.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              className="mt-1 w-4 h-4 accent-plum-900 rounded border-border"
            />
            <div>
              <p className="text-xs font-semibold text-plum-900">Vedic Wisdom Monthly Journal</p>
              <p className="text-[11px] text-ink-muted">Curated monthly essays by Acharyas on Patanjali Yoga Sutras and Ayurveda.</p>
            </div>
          </label>
        </div>

        <div className="pt-3 border-t border-border/70 flex justify-end">
          <Button type="submit" variant="secondary" size="sm" className="text-xs">
            Save Preferences
          </Button>
        </div>
      </form>

      {/* 2. Security & Password Update */}
      <form onSubmit={handleUpdatePassword} className="bg-surface border border-border rounded p-6 shadow-soft space-y-5">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <Lock className="w-4 h-4 text-gold-600" />
          <h2 className="text-sm font-semibold text-plum-900 uppercase tracking-wider">
            Change Password
          </h2>
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-900 text-xs rounded flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <div className="space-y-4">
          <Input
            id="current-password"
            label="Current Password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="new-password"
              label="New Password"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min. 8 characters"
            />

            <Input
              id="confirm-new-password"
              label="Confirm New Password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border/70 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={savingPassword}
            className="text-xs"
          >
            {savingPassword ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
