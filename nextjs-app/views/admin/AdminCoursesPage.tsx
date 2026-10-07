'use client';

import React, { useEffect, useState } from 'react';
import { CmsService } from '../../services/cmsService';
import { MediaService } from '../../services/mediaService';
import { CmsCourse, CmsCurriculumModule } from '../../types/cms';
import { Modal } from '../../components/Modal';
import { LoadingState } from '../../components/LoadingState';
import { Badge } from '../../components/Badge';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Star,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Users,
  Search,
  Filter,
} from 'lucide-react';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CmsCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterMode, setFilterMode] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'basics' | 'curriculum' | 'instructor' | 'seo'>('basics');
  const [editingCourse, setEditingCourse] = useState<Partial<CmsCourse> | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<CmsCourse | null>(null);

  // Curriculum builder temporary state
  const [newTopic, setNewTopic] = useState('');
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);

  // Benefits builder temporary state
  const [newBenefit, setNewBenefit] = useState('');

  const loadCourses = async () => {
    try {
      setLoading(true);
      const items = await CmsService.getCourses('all');
      setCourses(items || []);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load courses' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleOpenModal = (course?: CmsCourse) => {
    setActiveTab('basics');
    if (course) {
      setEditingCourse({
        ...course,
        image: course.coverImage || course.image,
        benefits: course.benefits && course.benefits.length > 0 ? course.benefits : course.features || [],
        curriculum: course.curriculum && course.curriculum.length > 0 ? course.curriculum : [
          { moduleNumber: 1, title: 'Foundational Asana & Alignment', topics: ['Tadasana & Spinal Axial Extension', 'Surya Namaskar Dynamic Series'] }
        ],
        capacity: course.capacity || { total: 30, enrolled: 0 },
        price: course.price || { amount: 14500, currency: 'INR', displayPrice: '₹14,500' },
        instructor: course.instructor || { name: 'Mrs. Shuchi Mohan', title: 'Physiotherapist & Therapeutic Yoga Consultant' },
      });
    } else {
      setEditingCourse({
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        duration: '120 Hours',
        level: 'all-levels',
        mode: 'in-person',
        status: 'published',
        featured: false,
        order: courses.length + 1,
        capacity: { total: 30, enrolled: 0 },
        price: { amount: 14500, currency: 'INR', isFree: false, displayPrice: '₹14,500' },
        benefits: ['Traditional yogic practices', 'Qualified instructors', 'Mind, body & spirit'],
        curriculum: [
          { moduleNumber: 1, title: 'Foundations & Alignment', description: 'Traditional yogasana principles and alignment', topics: ['Surya Namaskar', 'Standing Postures', 'Breathing Practices'] },
        ],
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Founder & Lead Instructor',
          bio: 'Physiotherapist & Therapeutic Yoga Consultant with institutional experience at MDNIY and NCERT.',
        },
        certification: 'Affiliated by Indian Yoga Association',
        eligibility: 'Open to earnest sadhakas of all backgrounds seeking authentic sadhana.',
        schedule: 'Monday – Saturday, 6:00 AM – 8:30 AM & 4:30 PM – 7:00 PM',
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: ['yoga teacher training', 'classical hatha yoga', '200 hour ttc'],
        },
      });
    }
    setModalOpen(true);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const res = await MediaService.uploadImage(file, 'courses', editingCourse?.title || 'Course Cover');
      setEditingCourse((prev) => ({
        ...prev,
        coverImage: res,
        image: res,
      }));
      showToast('Course cover image uploaded successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload cover image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadGalleryImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingGallery(true);
      const res = await MediaService.uploadImage(file, 'courses', 'Gallery Image');
      setEditingCourse((prev) => ({
        ...prev,
        gallery: [...(prev?.gallery || []), res],
      }));
      showToast('Gallery image added successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to upload gallery image', 'error');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setEditingCourse((prev) => ({
      ...prev,
      gallery: (prev?.gallery || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setEditingCourse((prev) => ({
      ...prev,
      benefits: [...(prev?.benefits || []), newBenefit.trim()],
    }));
    setNewBenefit('');
  };

  const handleRemoveBenefit = (index: number) => {
    setEditingCourse((prev) => ({
      ...prev,
      benefits: (prev?.benefits || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddModule = () => {
    const nextNum = (editingCourse?.curriculum?.length || 0) + 1;
    const newMod: CmsCurriculumModule = {
      moduleNumber: nextNum,
      title: `Module ${nextNum}: New Syllabus Unit`,
      description: 'Overview of module competencies...',
      topics: ['Key topic 1'],
    };
    setEditingCourse((prev) => ({
      ...prev,
      curriculum: [...(prev?.curriculum || []), newMod],
    }));
    setSelectedModuleIdx((editingCourse?.curriculum?.length || 0));
  };

  const handleRemoveModule = (index: number) => {
    setEditingCourse((prev) => ({
      ...prev,
      curriculum: (prev?.curriculum || []).filter((_, idx) => idx !== index),
    }));
    if (selectedModuleIdx >= index && selectedModuleIdx > 0) {
      setSelectedModuleIdx(selectedModuleIdx - 1);
    }
  };

  const handleAddTopicToModule = () => {
    if (!newTopic.trim()) return;
    setEditingCourse((prev) => {
      const cur = [...(prev?.curriculum || [])];
      if (cur[selectedModuleIdx]) {
        cur[selectedModuleIdx] = {
          ...cur[selectedModuleIdx],
          topics: [...cur[selectedModuleIdx].topics, newTopic.trim()],
        };
      }
      return { ...prev, curriculum: cur };
    });
    setNewTopic('');
  };

  const handleRemoveTopic = (topicIdx: number) => {
    setEditingCourse((prev) => {
      const cur = [...(prev?.curriculum || [])];
      if (cur[selectedModuleIdx]) {
        cur[selectedModuleIdx] = {
          ...cur[selectedModuleIdx],
          topics: cur[selectedModuleIdx].topics.filter((_, idx) => idx !== topicIdx),
        };
      }
      return { ...prev, curriculum: cur };
    });
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse?.title || !editingCourse.description || !editingCourse.duration) {
      showToast('Title, description, and duration are required.', 'error');
      return;
    }

    try {
      setSaving(true);
      const courseId = editingCourse._id || editingCourse.id;

      // Ensure coverImage exists
      const cover = editingCourse.coverImage || editingCourse.image || {
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
        path: 'courses/default-course.jpg',
        bucket: 'kalptaru-media',
        alt: editingCourse.title,
      };

      const payload: Partial<CmsCourse> = {
        ...editingCourse,
        coverImage: cover,
        image: cover,
        features: editingCourse.benefits,
        shortDescription: editingCourse.shortDescription || editingCourse.description?.slice(0, 160).trim(),
      };

      if (courseId) {
        await CmsService.updateCourse(courseId, payload);
        showToast('Course updated successfully! Live website synced.');
      } else {
        await CmsService.createCourse(payload);
        showToast('New course created successfully! Live website synced.');
      }

      setModalOpen(false);
      setEditingCourse(null);
      await loadCourses();
    } catch (err: any) {
      console.error(err);
      let errorMsg = err.message || 'Failed to save course';
      if (err.errors && typeof err.errors === 'object') {
        const details = Object.entries(err.errors)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('; ');
        if (details) errorMsg = `Validation failed: ${details}`;
      }
      showToast(errorMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (course: CmsCourse) => {
    const courseId = course._id || course.id;
    if (!courseId) return;

    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await CmsService.toggleCourseStatus(courseId, nextStatus as any);
      setCourses((prev) =>
        prev.map((c) => ((c._id || c.id) === courseId ? { ...c, status: nextStatus } : c))
      );
      showToast(`Course "${course.title}" status changed to ${nextStatus}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleToggleFeatured = async (course: CmsCourse) => {
    const courseId = course._id || course.id;
    if (!courseId) return;

    const nextFeatured = !course.featured;
    try {
      await CmsService.toggleCourseFeatured(courseId, nextFeatured);
      setCourses((prev) =>
        prev.map((c) => ((c._id || c.id) === courseId ? { ...c, featured: nextFeatured } : c))
      );
      showToast(`Course "${course.title}" ${nextFeatured ? 'featured on homepage' : 'unfeatured'}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to toggle featured flag', 'error');
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= courses.length) return;

    const newCourses = [...courses];
    const [moved] = newCourses.splice(index, 1);
    newCourses.splice(targetIndex, 0, moved);

    setCourses(newCourses);

    try {
      const ids = newCourses.map((c) => (c._id || c.id) as string);
      await CmsService.reorderCourses(ids);
      showToast('Course display order saved successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to save course order', 'error');
      await loadCourses();
    }
  };

  const confirmDelete = async () => {
    if (!courseToDelete) return;
    const courseId = courseToDelete._id || courseToDelete.id;
    if (!courseId) return;

    try {
      setSaving(true);
      await CmsService.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => (c._id || c.id) !== courseId));
      showToast(`Course "${courseToDelete.title}" permanently deleted.`);
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete course', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Filtered List
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || c.level === filterLevel;
    const matchesMode = filterMode === 'all' || c.mode === filterMode;
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesLevel && matchesMode && matchesStatus;
  });

  if (loading) {
    return (
      <div className="py-20">
        <LoadingState message="Loading Academic Courses Catalog..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
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

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-border rounded-xl p-5 sm:p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-widest uppercase bg-gold-50 text-gold-800 border border-gold-300 font-semibold">
              Curriculum Management
            </span>
            <span className="text-xs text-ink-muted">• Public Website Live Sync</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-plum-900 tracking-wide">
            Course Management
          </h1>
          <p className="text-xs sm:text-sm text-ink-muted font-sans mt-1">
            Create, edit, publish/unpublish, feature, reorder courses, curriculum modules, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCourses}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas transition-colors shadow-xs font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Sync</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between bg-white border border-border p-3.5 rounded-xl font-sans text-xs shadow-soft">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-canvas border border-border rounded-lg px-3 py-1.5 shadow-xs">
          <Search className="w-4 h-4 text-ink-muted shrink-0" />
          <input
            type="text"
            placeholder="Search by title, syllabus topic, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-ink placeholder-ink-faint outline-none w-full text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-ink-muted font-medium">
            <Filter className="w-3.5 h-3.5 text-gold-600" />
            <span>Filters:</span>
          </div>

          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-white border border-border text-ink rounded px-2.5 py-1 text-xs outline-none shadow-xs"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="all-levels">All Levels</option>
          </select>

          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-white border border-border text-ink rounded px-2.5 py-1 text-xs outline-none shadow-xs"
          >
            <option value="all">All Modes</option>
            <option value="residential">Residential</option>
            <option value="in-person">In-Person</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-border text-ink rounded px-2.5 py-1 text-xs outline-none shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3 py-3 font-semibold w-20 text-center">Order</th>
                <th className="px-4 py-3 font-semibold w-16 text-center">Cover</th>
                <th className="px-4 py-3 font-semibold">Course Details</th>
                <th className="px-4 py-3 font-semibold">Level &amp; Mode</th>
                <th className="px-4 py-3 font-semibold">Tuition</th>
                <th className="px-4 py-3 font-semibold text-center">Capacity</th>
                <th className="px-4 py-3 font-semibold text-center">Featured</th>
                <th className="px-4 py-3 font-semibold text-center">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-ink-muted">
                    No courses match your filter criteria. Click "Create New Course" above.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course, index) => {
                  const courseId = (course._id || course.id) as string;
                  const isPublished = course.status === 'published';
                  const coverUrl = course.coverImage?.url || course.image?.url;

                  return (
                    <tr
                      key={courseId || index}
                      className={`hover:bg-canvas/50 transition-colors ${
                        !isPublished ? 'opacity-70 bg-canvas/30' : ''
                      }`}
                    >
                      {/* Reorder Arrows */}
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-1 text-ink-muted hover:text-plum-900 disabled:opacity-20 hover:bg-canvas rounded transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-plum-900 font-bold text-[11px] w-5">
                            #{course.order !== undefined ? course.order : index + 1}
                          </span>
                          <button
                            type="button"
                            disabled={index === filteredCourses.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 text-ink-muted hover:text-plum-900 disabled:opacity-20 hover:bg-canvas rounded transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Cover Thumbnail */}
                      <td className="px-4 py-3 text-center">
                        <div className="w-12 h-12 rounded-lg bg-canvas border border-border overflow-hidden flex items-center justify-center mx-auto shadow-xs">
                          {coverUrl ? (
                            <img
                              src={coverUrl}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <GraduationCap className="w-5 h-5 text-gold-600" />
                          )}
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="px-4 py-3">
                        <div className="font-editorial text-sm text-plum-900 font-bold line-clamp-1">
                          {course.title}
                        </div>
                        <div className="text-[11px] text-gold-700 font-mono">
                          /{course.slug}
                        </div>
                        <div className="text-[10px] text-ink-muted flex items-center gap-2 mt-0.5">
                          <span>{course.duration}</span>
                          <span>•</span>
                          <span>{course.curriculum?.length || 0} Modules</span>
                        </div>
                      </td>

                      {/* Level & Mode */}
                      <td className="px-4 py-3 whitespace-nowrap space-y-1">
                        <div>
                          <Badge variant="gold" size="sm">
                            {course.level}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-[11px] text-ink-muted capitalize">
                            {course.mode}
                          </span>
                        </div>
                      </td>

                      {/* Tuition */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-editorial text-sm text-plum-900 font-bold">
                          {course.price?.displayPrice || `₹${course.price?.amount?.toLocaleString() || '0'}`}
                        </div>
                        <div className="text-[10px] text-ink-muted">
                          {course.price?.isFree ? 'Free Admission' : course.price?.currency || 'INR'}
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 text-[11px] text-ink font-medium">
                          <Users className="w-3 h-3 text-gold-600" />
                          <span>{course.capacity?.enrolled || 0} / {course.capacity?.total || 30}</span>
                        </div>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(course)}
                          className={`p-1.5 rounded-lg border transition-all shadow-xs ${
                            course.featured
                              ? 'bg-gold-50 border-gold-300 text-gold-800 hover:bg-gold-100'
                              : 'bg-white border-border text-ink-muted hover:text-plum-900 hover:bg-canvas'
                          }`}
                          title={course.featured ? 'Featured on Homepage (Click to unfeature)' : 'Feature on Homepage'}
                        >
                          <Star className={`w-4 h-4 ${course.featured ? 'fill-gold-500 text-gold-500' : ''}`} />
                        </button>
                      </td>

                      {/* Publish / Draft Status */}
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(course)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all shadow-xs ${
                            isPublished
                              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                              : 'bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          {isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(course)}
                            className="p-1.5 text-gold-700 hover:text-gold-900 bg-gold-50 hover:bg-gold-100 border border-gold-200 rounded transition-colors shadow-xs"
                            title="Edit Course"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCourseToDelete(course);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded transition-colors shadow-xs"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Course Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCourse(null);
        }}
        title={editingCourse?._id || editingCourse?.id ? `Edit Course: ${editingCourse?.title}` : 'Create New Course'}
        size="lg"
      >
        <form onSubmit={handleSaveCourse} className="space-y-5 font-sans text-xs sm:text-sm">
          {/* Navigation Tabs */}
          <div className="flex border-b border-border gap-4 text-xs font-sans">
            <button
              type="button"
              onClick={() => setActiveTab('basics')}
              className={`pb-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'basics'
                  ? 'border-plum-900 text-plum-900'
                  : 'border-transparent text-ink-muted hover:text-plum-900'
              }`}
            >
              1. General &amp; Logistics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('curriculum')}
              className={`pb-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'curriculum'
                  ? 'border-plum-900 text-plum-900'
                  : 'border-transparent text-ink-muted hover:text-plum-900'
              }`}
            >
              2. Curriculum &amp; Benefits
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructor')}
              className={`pb-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'instructor'
                  ? 'border-plum-900 text-plum-900'
                  : 'border-transparent text-ink-muted hover:text-plum-900'
              }`}
            >
              3. Instructor &amp; Media
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`pb-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'seo'
                  ? 'border-plum-900 text-plum-900'
                  : 'border-transparent text-ink-muted hover:text-plum-900'
              }`}
            >
              4. SEO &amp; Metadata
            </button>
          </div>

          {/* TAB 1: General & Logistics */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse?.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-');
                      setEditingCourse((prev) => ({
                        ...prev,
                        title,
                        slug: prev?.slug && prev.slug !== '' ? prev.slug : slug,
                      }));
                    }}
                    placeholder="e.g. 200-Hour Yoga Teacher Training (TTC)"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingCourse?.slug || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                    placeholder="e.g. 200-hour-yoga-teacher-training"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs placeholder:text-ink-faint focus:outline-none focus:border-gold-500 font-mono shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Full Course Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingCourse?.description || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                  placeholder="Comprehensive description of the certification program, philosophical lineage, and sadhana goals..."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Short Description (Catalog cards)
                </label>
                <input
                  type="text"
                  value={editingCourse?.shortDescription || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, shortDescription: e.target.value })}
                  placeholder="One sentence summary for public program cards..."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCourse?.duration || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })}
                    placeholder="e.g. 200 Hours / 4 Weeks"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Level
                  </label>
                  <select
                    value={editingCourse?.level || 'all-levels'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value as any })}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold-500 shadow-xs"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all-levels">All Levels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Delivery Mode
                  </label>
                  <select
                    value={editingCourse?.mode || 'residential'}
                    onChange={(e) => setEditingCourse({ ...editingCourse, mode: e.target.value as any })}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-sm focus:outline-none focus:border-gold-500 shadow-xs"
                  >
                    <option value="residential">Residential (Gurukula)</option>
                    <option value="in-person">In-Person (Daily Shala)</option>
                    <option value="online">Online Live Streaming</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Tuition Amount (INR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingCourse?.price?.amount ?? 24999}
                    onChange={(e) => {
                      const amount = Number(e.target.value);
                      setEditingCourse({
                        ...editingCourse,
                        price: {
                          currency: 'INR',
                          amount,
                          isFree: amount === 0,
                          displayPrice: amount === 0 ? 'Free' : `₹${amount.toLocaleString()}`,
                        },
                      });
                    }}
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink font-mono text-sm focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Seat Capacity Total
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingCourse?.capacity?.total ?? 30}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        capacity: {
                          total: Number(e.target.value),
                          enrolled: editingCourse?.capacity?.enrolled || 0,
                        },
                      })
                    }
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink font-mono text-sm focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Enrolled Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingCourse?.capacity?.enrolled ?? 0}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        capacity: {
                          total: editingCourse?.capacity?.total || 30,
                          enrolled: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink font-mono text-sm focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>
              </div>

              {/* Schedule, Certification, Eligibility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Batch Schedule
                  </label>
                  <input
                    type="text"
                    value={editingCourse?.schedule || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                    placeholder="e.g. Mon – Sat: 6:00 AM – 8:30 AM & 4:30 PM – 7:00 PM"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Certification Granted
                  </label>
                  <input
                    type="text"
                    value={editingCourse?.certification || ''}
                    onChange={(e) => setEditingCourse({ ...editingCourse, certification: e.target.value })}
                    placeholder="e.g. Yoga Alliance RYT 200 & AYUSH Certified"
                    className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Eligibility &amp; Prerequisites
                </label>
                <input
                  type="text"
                  value={editingCourse?.eligibility || ''}
                  onChange={(e) => setEditingCourse({ ...editingCourse, eligibility: e.target.value })}
                  placeholder="e.g. Open to sincere sadhakas with minimum 6 months regular practice."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              {/* Status & Featured Flags */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse?.status === 'published'}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        status: e.target.checked ? 'published' : 'draft',
                      })
                    }
                    className="rounded border-border text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs text-ink font-medium">Published &amp; Visible on Public Site</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse?.featured ?? false}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        featured: e.target.checked,
                      })
                    }
                    className="rounded border-border text-gold-600 focus:ring-gold-500"
                  />
                  <span className="text-xs text-ink font-medium">Feature on Homepage Catalog</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Curriculum & Benefits */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              {/* Benefits Builder */}
              <div className="space-y-3">
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider">
                  Key Course Benefits &amp; Highlights
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBenefit();
                      }
                    }}
                    placeholder="e.g. Master authentic classical pranayama & mudras..."
                    className="flex-1 bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs placeholder:text-ink-faint focus:outline-none focus:border-gold-500 shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddBenefit}
                    className="px-4 py-2 bg-plum-900 text-gold-300 font-semibold rounded-lg text-xs hover:bg-plum-800 shadow-soft"
                  >
                    Add Highlight
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {editingCourse?.benefits && editingCourse.benefits.length > 0 ? (
                    editingCourse.benefits.map((b, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-gold-50 border border-gold-300 rounded-md text-xs text-gold-900 font-medium shadow-xs"
                      >
                        <span>{b}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(idx)}
                          className="text-rose-600 hover:text-rose-800 font-bold"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-ink-muted">No benefits added yet.</span>
                  )}
                </div>
              </div>

              {/* Curriculum Module Manager */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider">
                    Curriculum Modules (Syllabus)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-plum-900 text-gold-300 rounded text-xs hover:bg-plum-800 font-semibold shadow-soft"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Module</span>
                  </button>
                </div>

                {/* Module Selector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {editingCourse?.curriculum?.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedModuleIdx(idx)}
                      className={`px-3 py-1.5 rounded text-xs font-sans border transition-all ${
                        selectedModuleIdx === idx
                          ? 'bg-plum-900 border-plum-900 text-gold-300 font-semibold shadow-xs'
                          : 'bg-white border-border text-ink hover:text-plum-900 hover:bg-canvas'
                      }`}
                    >
                      Module {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Selected Module Editor */}
                {editingCourse?.curriculum && editingCourse.curriculum[selectedModuleIdx] && (
                  <div className="p-4 bg-canvas border border-border rounded-xl space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono text-plum-900 font-bold uppercase">
                        Editing Module {selectedModuleIdx + 1}
                      </h4>
                      {editingCourse.curriculum.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(selectedModuleIdx)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                        >
                          Remove Module
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Module Title</label>
                      <input
                        type="text"
                        value={editingCourse.curriculum[selectedModuleIdx].title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingCourse((prev) => {
                            const cur = [...(prev?.curriculum || [])];
                            cur[selectedModuleIdx] = { ...cur[selectedModuleIdx], title: val };
                            return { ...prev, curriculum: cur };
                          });
                        }}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Module Description</label>
                      <input
                        type="text"
                        value={editingCourse.curriculum[selectedModuleIdx].description || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingCourse((prev) => {
                            const cur = [...(prev?.curriculum || [])];
                            cur[selectedModuleIdx] = { ...cur[selectedModuleIdx], description: val };
                            return { ...prev, curriculum: cur };
                          });
                        }}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                      />
                    </div>

                    {/* Topics Sub-list */}
                    <div>
                      <label className="block text-[11px] text-ink-muted mb-1 font-medium">Topics &amp; Practical Units</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={newTopic}
                          onChange={(e) => setNewTopic(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTopicToModule();
                            }
                          }}
                          placeholder="Add topic (e.g. Asana Alignment & Spine Biomechanics)..."
                          className="flex-1 bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddTopicToModule}
                          className="px-3 py-1.5 bg-plum-900 text-gold-300 font-semibold rounded text-xs hover:bg-plum-800 shadow-soft"
                        >
                          Add Topic
                        </button>
                      </div>

                      <div className="space-y-1">
                        {editingCourse.curriculum[selectedModuleIdx].topics.map((top, tIdx) => (
                          <div
                            key={tIdx}
                            className="flex items-center justify-between px-2.5 py-1 bg-white border border-border rounded text-xs text-ink shadow-xs"
                          >
                            <span>• {top}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTopic(tIdx)}
                              className="text-rose-600 hover:text-rose-800 text-sm font-bold"
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Instructor & Media */}
          {activeTab === 'instructor' && (
            <div className="space-y-5">
              {/* Cover Image Upload */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-4 bg-canvas border border-border rounded-xl shadow-xs">
                <div>
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                    Course Cover Image
                  </label>
                  <p className="text-[11px] text-ink-muted mb-3">
                    High-resolution photograph (JPEG, PNG, or WebP. Max 5MB).
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-plum-900 text-gold-300 rounded-lg text-xs font-semibold hover:bg-plum-800 transition-colors shadow-soft">
                    <ImageIcon className="w-4 h-4" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload Cover Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleUploadCover}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="aspect-video rounded-lg overflow-hidden border border-border bg-white flex items-center justify-center shadow-xs">
                  {(editingCourse?.coverImage?.url || editingCourse?.image?.url) ? (
                    <img
                      src={editingCourse.coverImage?.url || editingCourse.image?.url}
                      alt={editingCourse.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-ink-muted">No cover image uploaded</span>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider">
                    Gallery Images ({editingCourse?.gallery?.length || 0})
                  </label>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-plum-900 text-gold-300 rounded text-xs hover:bg-plum-800 font-semibold shadow-soft">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{uploadingGallery ? 'Uploading...' : 'Add Gallery Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingGallery}
                      onChange={handleUploadGalleryImage}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {editingCourse?.gallery?.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-canvas shadow-xs"
                    >
                      <img src={img.url} alt="Gallery" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-rose-900/90 hover:bg-rose-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Instructor Details */}
              <div className="p-4 bg-canvas border border-border rounded-xl space-y-3 shadow-xs">
                <h4 className="text-xs font-mono text-plum-900 font-bold uppercase">Lead Acharya / Instructor</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-ink-muted mb-1 font-medium">Instructor Name *</label>
                    <input
                      type="text"
                      required
                      value={editingCourse?.instructor?.name || ''}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          instructor: {
                            ...editingCourse?.instructor,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Mrs. Shuchi Mohan"
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-ink-muted mb-1 font-medium">Instructor Title</label>
                    <input
                      type="text"
                      value={editingCourse?.instructor?.title || ''}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          instructor: {
                            ...editingCourse?.instructor,
                            name: editingCourse?.instructor?.name || 'Mrs. Shuchi Mohan',
                            title: e.target.value,
                          },
                        })
                      }
                      placeholder="e.g. Founder & Lead Instructor"
                      className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-ink-muted mb-1 font-medium">Instructor Bio</label>
                  <textarea
                    rows={2}
                    value={editingCourse?.instructor?.bio || ''}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        instructor: {
                          ...editingCourse?.instructor,
                          name: editingCourse?.instructor?.name || 'Lead Acharya',
                          bio: e.target.value,
                        },
                      })
                    }
                    placeholder="Brief background and lineage qualifications..."
                    className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-gold-500 shadow-xs resize-y"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO & Metadata */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={editingCourse?.seo?.metaTitle || ''}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      seo: { ...editingCourse?.seo, metaTitle: e.target.value },
                    })
                  }
                  placeholder="e.g. 200-Hour Yoga Teacher Training | Kalptaruu Yoga Vidhyalaya"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-gold-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={editingCourse?.seo?.metaDescription || ''}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      seo: { ...editingCourse?.seo, metaDescription: e.target.value },
                    })
                  }
                  placeholder="Compelling meta description for Google Search engines..."
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-gold-500 shadow-xs resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-sans text-plum-900 font-semibold uppercase tracking-wider mb-1">
                  Keywords (Comma separated)
                </label>
                <input
                  type="text"
                  value={editingCourse?.seo?.keywords?.join(', ') || ''}
                  onChange={(e) =>
                    setEditingCourse({
                      ...editingCourse,
                      seo: {
                        ...editingCourse?.seo,
                        keywords: e.target.value.split(',').map((s) => s.trim()),
                      },
                    })
                  }
                  placeholder="e.g. yoga teacher training, 200 hour ttc, rishikesh yoga, classical hatha"
                  className="w-full bg-white border border-border rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-gold-500 text-xs font-mono shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setModalOpen(false);
                setEditingCourse(null);
              }}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas shadow-xs font-medium"
            >
              Cancel
            </button>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving || uploadingImage}
                className="px-6 py-2 rounded-lg text-xs font-sans font-semibold bg-plum-900 text-gold-300 hover:bg-plum-800 transition-colors shadow-soft disabled:opacity-50"
              >
                {saving ? 'Saving Course...' : 'Save Course'}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Course Deletion"
        size="sm"
      >
        <div className="space-y-4 font-sans text-sm">
          <p className="text-ink">
            Are you sure you want to permanently delete the course{' '}
            <strong className="text-plum-900">"{courseToDelete?.title}"</strong>?
          </p>
          <p className="text-xs text-rose-600">
            This will immediately remove this course syllabus and public card from the live catalog.
          </p>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-sans text-ink hover:text-plum-900 bg-white border border-border hover:bg-canvas shadow-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg text-xs bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-soft disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Yes, Delete Course'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
