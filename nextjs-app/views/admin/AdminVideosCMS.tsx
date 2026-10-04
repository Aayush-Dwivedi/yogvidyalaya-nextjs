'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsVideo } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  Video as VideoIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Upload,
  Star,
  Clock,
  User,
} from 'lucide-react';

export const AdminVideosCMS: React.FC = () => {
  const [videos, setVideos] = useState<CmsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Partial<CmsVideo> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<CmsVideo | null>(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const items = await CmsService.getVideos('all');
      setVideos(items || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load videos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  // Helper to extract YouTube ID from standard URLs
  const extractYoutubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : '';
  };

  const handleOpenModal = (video?: CmsVideo) => {
    if (video) {
      setEditingVideo({ ...video });
    } else {
      setEditingVideo({
        youtubeUrl: '',
        youtubeVideoId: '',
        title: '',
        description: '',
        category: 'Discourse',
        speaker: 'Mrs. Shuchi Mohan',
        duration: '24:00',
        featured: false,
        order: videos.length + 1,
        status: 'published',
        thumbnail: undefined,
      });
    }
    setModalOpen(true);
  };

  const handleUrlChange = (url: string) => {
    const videoId = extractYoutubeId(url);
    setEditingVideo((prev) => ({
      ...prev,
      youtubeUrl: url,
      youtubeVideoId: videoId,
      thumbnail:
        !prev?.thumbnail?.url && videoId
          ? {
              url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
              path: `youtube/${videoId}.jpg`,
              bucket: 'external',
              alt: prev?.title || 'YouTube Thumbnail',
            }
          : prev?.thumbnail,
    }));
  };

  const handleUploadThumbnail = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingThumb(true);
      // Supabase Storage upload
      const res = await MediaService.uploadImage(file, 'videos', editingVideo?.title || file.name);
      setEditingVideo((prev) => ({
        ...prev,
        thumbnail: {
          url: res.url,
          path: res.path,
          bucket: res.bucket,
          size: res.size,
          mimeType: res.mimeType,
          alt: res.alt || file.name,
        },
      }));
      showToast('Custom thumbnail uploaded to Supabase Storage!');
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to upload thumbnail to Supabase Storage', 'error');
    } finally {
      setUploadingThumb(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo?.youtubeUrl || !editingVideo.title) {
      showToast('YouTube URL and video title are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const videoId = editingVideo._id || editingVideo.id;
      const payload: Partial<CmsVideo> = {
        ...editingVideo,
        youtubeVideoId: editingVideo.youtubeVideoId || extractYoutubeId(editingVideo.youtubeUrl),
      };

      if (videoId) {
        await CmsService.updateVideo(videoId, payload);
        showToast('Video details updated successfully!');
      } else {
        await CmsService.createVideo(payload);
        showToast('New video added to library successfully!');
      }

      setModalOpen(false);
      setEditingVideo(null);
      await loadVideos();
    } catch (err: any) {
      console.error(err);
      showToast(err.message || 'Failed to save video', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (video: CmsVideo) => {
    const vidId = video._id || video.id;
    if (!vidId) return;

    try {
      const nextFeatured = !video.featured;
      await CmsService.updateVideo(vidId, { featured: nextFeatured });
      setVideos((prev) =>
        prev.map((v) => ((v._id || v.id) === vidId ? { ...v, featured: nextFeatured } : v))
      );
      showToast(`Video ${nextFeatured ? 'featured on homepage' : 'unfeatured'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update video', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!videoToDelete) return;
    const vidId = videoToDelete._id || videoToDelete.id;
    if (!vidId) return;

    try {
      setSaving(true);
      await CmsService.deleteVideo(vidId);
      setVideos((prev) => prev.filter((v) => (v._id || v.id) !== vidId));
      showToast('Video deleted successfully.');
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete video', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Video Discourses & Practices..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {statusMessage && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm transition-all duration-300 shadow-modal ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/80 border-rose-500/40 text-rose-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="flex-1 font-sans">{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase tracking-wider"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-plum-950/40 border border-gold-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm shadow-card">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-sans tracking-widest uppercase bg-gold-500/10 text-gold-400 border border-gold-500/30">
              Video & Audio Archives
            </span>
            <span className="text-xs text-ivory/50">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-normal text-ivory tracking-wide">
            Videos Management
          </h1>
          <p className="text-xs sm:text-sm text-ivory/70 font-sans mt-1">
            Manage YouTube discourses, guided sadhanas, custom Supabase Storage thumbnails, categories, and homepage feature status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadVideos}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-gold-300 bg-plum-900/60 border border-gold-500/30 hover:bg-plum-900 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Video</span>
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-plum-950/20 border border-gold-500/10 rounded-xl">
            <VideoIcon className="w-10 h-10 text-gold-500/30 mx-auto mb-2" />
            <p className="text-sm text-ivory/60 font-sans">No videos in archive.</p>
          </div>
        ) : (
          videos.map((vid, index) => {
            const vidId = (vid._id || vid.id) as string;
            const thumbUrl =
              vid.thumbnail?.url ||
              (vid.youtubeVideoId
                ? `https://img.youtube.com/vi/${vid.youtubeVideoId}/hqdefault.jpg`
                : '');

            return (
              <div
                key={vidId || index}
                className="group bg-plum-950/40 border border-gold-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-card flex flex-col justify-between hover:border-gold-500/40 transition-all"
              >
                <div>
                  <div className="relative aspect-video bg-plum-900 overflow-hidden">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gold-400/30">
                        <VideoIcon className="w-8 h-8" />
                      </div>
                    )}

                    {/* Order badge */}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-plum-950/80 text-[10px] text-gold-300 font-mono border border-gold-500/20">
                      Order #{vid.order}
                    </span>

                    {/* Duration badge */}
                    {vid.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-plum-950/90 text-[11px] text-ivory font-mono flex items-center gap-1 border border-white/10">
                        <Clock className="w-3 h-3 text-gold-400" />
                        <span>{vid.duration}</span>
                      </span>
                    )}

                    {/* Featured Star */}
                    <button
                      onClick={() => handleToggleFeatured(vid)}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-all ${
                        vid.featured
                          ? 'bg-gold-500 text-plum-950 shadow-sm'
                          : 'bg-plum-950/70 text-ivory/50 hover:text-gold-300'
                      }`}
                      title={vid.featured ? 'Featured on Homepage' : 'Click to feature on Homepage'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="p-4 space-y-2 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="dark" size="sm">
                        {vid.category || 'Discourse'}
                      </Badge>
                      {vid.featured && <Badge variant="gold" size="sm">★ Home Featured</Badge>}
                    </div>

                    <h3 className="font-editorial text-base text-ivory font-medium line-clamp-2 leading-snug">
                      {vid.title}
                    </h3>

                    {vid.speaker && (
                      <div className="flex items-center gap-1.5 text-xs text-gold-300/80">
                        <User className="w-3.5 h-3.5 text-gold-400" />
                        <span>{vid.speaker}</span>
                      </div>
                    )}

                    {vid.description && (
                      <p className="text-xs text-ivory/60 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    )}

                    <div className="pt-1 flex items-center justify-between text-[11px] text-ivory/40 font-mono">
                      <span>ID: {vid.youtubeVideoId || 'N/A'}</span>
                      <a
                        href={vid.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-400 hover:text-gold-300 flex items-center gap-1"
                      >
                        <span>YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card footer controls */}
                <div className="p-3 border-t border-gold-500/10 bg-plum-900/30 flex items-center justify-between">
                  <span className="text-[11px] text-ivory/50 font-sans capitalize">
                    Status: {vid.status}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenModal(vid)}
                      className="p-1.5 text-gold-300 hover:text-gold-200 bg-plum-900/60 hover:bg-plum-900 border border-gold-500/20 rounded transition-colors"
                      title="Edit video"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setVideoToDelete(vid);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950 border border-rose-500/20 rounded transition-colors"
                      title="Delete video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Video Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVideo(null);
        }}
        title={editingVideo?._id || editingVideo?.id ? 'Edit Video Details' : 'Add New YouTube Video'}
        size="md"
      >
        <form onSubmit={handleSaveVideo} className="space-y-4 font-sans text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              YouTube URL *
            </label>
            <input
              type="url"
              required
              value={editingVideo?.youtubeUrl || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
            />
            {editingVideo?.youtubeVideoId && (
              <p className="text-[11px] text-emerald-400 mt-1 font-mono">
                Detected YouTube Video ID: {editingVideo.youtubeVideoId}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              Video Title *
            </label>
            <input
              type="text"
              required
              value={editingVideo?.title || ''}
              onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
              placeholder="e.g. The Essence of Classical Yoga: Beyond Asana Physicality"
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={editingVideo?.category || 'Discourse'}
                onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value })}
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
              >
                <option value="Discourse">Philosophy Discourse</option>
                <option value="Guided Practice">Guided Practice</option>
                <option value="Campus Overview">Campus Overview</option>
                <option value="Masterclass">Masterclass</option>
                <option value="Chanting & Dhyana">Chanting & Dhyana</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Speaker / Teacher
              </label>
              <input
                type="text"
                value={editingVideo?.speaker || ''}
                onChange={(e) => setEditingVideo({ ...editingVideo, speaker: e.target.value })}
                placeholder="Mrs. Shuchi Mohan"
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Duration (MM:SS)
              </label>
              <input
                type="text"
                value={editingVideo?.duration || ''}
                onChange={(e) => setEditingVideo({ ...editingVideo, duration: e.target.value })}
                placeholder="28:45"
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={editingVideo?.order || 0}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, order: Number(e.target.value) })
                }
                className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans text-gold-300 uppercase tracking-wider mb-1.5">
              Description / Summary
            </label>
            <textarea
              rows={3}
              value={editingVideo?.description || ''}
              onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
              placeholder="Summary of the discourse, scriptural citations, or practice guidelines..."
              className="w-full bg-plum-900/50 border border-gold-500/30 rounded-lg px-3.5 py-2 text-ivory focus:outline-none focus:border-gold-400"
            />
          </div>

          {/* Thumbnail Section (Supabase Storage Option) */}
          <div className="p-3 bg-plum-900/30 border border-gold-500/20 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gold-300 uppercase tracking-wider">
                Video Thumbnail (Supabase Storage)
              </label>
              <span className="text-[10px] text-ivory/50">Optional Custom Cover</span>
            </div>

            {editingVideo?.thumbnail?.url ? (
              <div className="flex items-center gap-3">
                <img
                  src={editingVideo.thumbnail.url}
                  alt="Thumbnail"
                  className="w-24 h-16 object-cover rounded border border-gold-500/30"
                />
                <div className="space-y-1">
                  <label className="cursor-pointer px-3 py-1 bg-gold-500 text-plum-950 rounded text-xs font-medium hover:bg-gold-400">
                    Replace Thumbnail
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingThumb}
                      onChange={handleUploadThumbnail}
                      className="hidden"
                    />
                  </label>
                  {editingVideo.thumbnail.path && (
                    <p className="text-[10px] font-mono text-gold-400/60 truncate max-w-xs">
                      {editingVideo.thumbnail.path}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-2 p-3 border border-dashed border-gold-500/30 rounded cursor-pointer bg-plum-950/40 hover:bg-plum-900/40">
                <Upload className="w-4 h-4 text-gold-400" />
                <span className="text-xs text-ivory">
                  {uploadingThumb ? 'Uploading...' : 'Upload custom thumbnail to Supabase Storage'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingThumb}
                  onChange={handleUploadThumbnail}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingVideo?.featured ?? false}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, featured: e.target.checked })
                }
                className="rounded border-gold-500/30 bg-plum-900 text-gold-500 focus:ring-gold-400"
              />
              <span className="text-xs text-ivory">Feature in Homepage Video Spotlight</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gold-500/20">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingVideo(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ivory/70 hover:text-ivory border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploadingThumb}
              className="px-5 py-2 rounded-lg text-xs font-sans font-medium bg-gold-500 text-plum-950 hover:bg-gold-400 transition-colors shadow-sm disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Video'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Video Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-sm">
          <p className="text-ivory/80">
            Are you sure you want to permanently delete{' '}
            <strong className="text-gold-300">"{videoToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-300/80">
            The video will be removed from archives and public homepage featured videos.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs text-ivory/70 hover:text-ivory border border-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg text-xs bg-rose-600 hover:bg-rose-500 text-white font-medium shadow-sm disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Yes, Delete Video'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
