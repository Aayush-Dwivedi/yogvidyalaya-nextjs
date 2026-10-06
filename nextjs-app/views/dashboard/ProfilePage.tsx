'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MediaService } from '../../services/mediaService';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { Badge } from '../../components/Badge';
import { ProfileImage } from '../../types/auth';
import {
  User as UserIcon,
  Phone,
  Mail,
  Camera,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || '');
  const [address, setAddress] = useState(user?.address || '');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    user?.experienceLevel || 'intermediate'
  );
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');

  // Profile image upload state
  const [profileImage, setProfileImage] = useState<ProfileImage | undefined>(user?.profileImage);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.profileImage?.url || null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Status feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep in sync with user state
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setCity(user.city || '');
      setAddress(user.address || '');
      setExperienceLevel(user.experienceLevel || 'intermediate');
      setEmergencyContact(user.emergencyContact || '');
      if (user.profileImage) {
        setProfileImage(user.profileImage);
        setImagePreview(user.profileImage.url);
      }
    }
  }, [user]);

  // Handle Profile Image Selection and Supabase Storage Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size (max 5MB)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image file size must be less than 5MB.');
      return;
    }

    // Set local instant preview
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setErrorMessage(null);
    setUploadingImage(true);

    try {
      // Upload using MediaService -> Supabase Storage backend endpoint
      const uploadedMedia = await MediaService.uploadImage(file, 'student', `Avatar for ${name}`);
      setProfileImage(uploadedMedia);
      
      // Persist directly to profile
      await updateProfile({
        profileImage: uploadedMedia,
      });

      setSuccessMessage('Profile photo uploaded and saved successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj?.message || 'Failed to upload profile photo.');
      // Revert preview if failed
      setImagePreview(user?.profileImage?.url || null);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        city: city.trim(),
        address: address.trim(),
        experienceLevel,
        emergencyContact: emergencyContact.trim(),
        profileImage,
      });

      setSuccessMessage('Your profile information has been updated successfully!');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      setErrorMessage(errObj?.message || 'Failed to update profile.');
    }
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'KY';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Title & Context */}
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
          Student Identity
        </span>
        <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
          Manage Profile
        </h1>
        <p className="text-xs text-ink-muted mt-1 font-sans">
          Update your student identification details, shala contact info, and profile image.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded text-xs flex items-center gap-2.5 animate-fade-in"
        >
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          role="alert"
          className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded text-xs flex items-center gap-2.5 animate-fade-in"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Profile Photo Section */}
      <div className="bg-surface border border-border rounded p-6 shadow-soft">
        <h2 className="text-sm font-semibold text-plum-900 font-sans uppercase tracking-wider mb-4">
          Profile Photo
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-gold-500 shadow-card"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-plum-900 text-gold-400 font-editorial text-3xl font-bold flex items-center justify-center border-2 border-gold-500 shadow-card">
                {initials}
              </div>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 bg-plum-950/60 rounded-full flex items-center justify-center text-white text-xs font-mono">
                Uploading...
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="profile-image-upload"
            />
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage || isLoading}
                className="text-xs"
              >
                <Camera className="w-3.5 h-3.5 mr-1.5" />
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
              </Button>

              {profileImage?.url && (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Photo Uploaded
                </span>
              )}
            </div>

            <p className="text-[11px] text-ink-faint">
              Accepts JPEG, PNG, or WebP. Maximum file size: 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Main Profile Details Form */}
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded p-6 shadow-soft space-y-6">
        <h2 className="text-sm font-semibold text-plum-900 font-sans uppercase tracking-wider border-b border-border/80 pb-3">
          Basic Profile Information
        </h2>

        {/* Row 1: Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="profile-name"
            label="Full Name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Aarav Sharma"
            required
            leftIcon={<UserIcon className="w-4 h-4" />}
          />

          <Input
            id="profile-phone"
            label="Phone Number"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        {/* Row 2: Email (Read Only) & Experience Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs uppercase tracking-wide-editorial text-ink-muted font-semibold">
              Email Address (Account ID)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-ink-faint pointer-events-none flex items-center">
                <Mail className="w-4 h-4" />
              </span>
              <input
                disabled
                value={user?.email || 'student@kalptaruyog.org'}
                className="w-full bg-surface-subtle text-ink-muted font-sans text-sm rounded-[2px] border border-border py-2.5 px-3.5 pl-9 cursor-not-allowed"
              />
              <span className="absolute right-3">
                <Badge variant="success" size="sm" className="text-[10px] py-0">
                  Verified
                </Badge>
              </span>
            </div>
            <p className="text-[11px] text-ink-faint">
              Account email cannot be modified directly. Contact administrative shala.
            </p>
          </div>

          <Select
            label="Yoga Experience Level"
            value={experienceLevel}
            onChange={(e) =>
              setExperienceLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')
            }
            options={[
              { value: 'beginner', label: 'Beginner (Introductory Sadhana)' },
              { value: 'intermediate', label: 'Intermediate (Regular Practice)' },
              { value: 'advanced', label: 'Advanced (TTC / Dedicated Sadhaka)' },
            ]}
          />
        </div>

        {/* Row 3: City & Emergency Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="profile-city"
            label="City / Town"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Pune, Mumbai, Rishikesh"
          />

          <Input
            id="profile-emergency-contact"
            label="Emergency Contact (Name & Phone)"
            type="text"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            placeholder="e.g. Meera Sharma (+91 98765 00003)"
            helperText="Required for residential courses and intensives"
          />
        </div>

        {/* Row 4: Residential Address */}
        <Textarea
          id="profile-address"
          label="Residential Street Address"
          rows={2}
          autoComplete="street-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Flat / House No., Street, Landmark, Pin code"
        />

        {/* Row 5: Bio / Sadhana Aspirations */}
        <Textarea
          id="profile-bio"
          label="Personal Sadhana Journey & Background"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Share your yogic intentions, previous teachers, practice lineage, or personal wellness goals..."
          helperText="Visible to your Acharyas and mentors for personalized guidance."
        />

        {/* Form Actions */}
        <div className="pt-4 border-t border-border/80 flex items-center justify-between">
          <div className="text-[11px] font-mono text-ink-faint">
            Student ID: <span className="font-semibold text-plum-900">{user?._id?.slice(-6) || 'KYV'}</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading || uploadingImage}
          >
            {isLoading ? 'Saving Changes...' : 'Save Profile Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
