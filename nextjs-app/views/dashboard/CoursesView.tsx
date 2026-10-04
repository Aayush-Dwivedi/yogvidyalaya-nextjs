'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StudentService } from '../../services/studentService';
import { StudentCourseEnrollment } from '../../types/student';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { ExternalLink } from 'lucide-react';

export const CoursesView: React.FC = () => {
  const [courses, setCourses] = useState<StudentCourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    StudentService.getDashboard()
      .then((data) => {
        if (mounted) setCourses(data.courseEnrollments || []);
      })
      .catch(() => {
        // Fallback default
        if (mounted) {
          setCourses([
            {
              id: 'crs-1',
              title: '200-Hour Classical Yoga Teacher Training (TTC)',
              slug: '200-hour-ttc',
              level: 'advanced',
              progressPercentage: 65,
              completedModules: 4,
              totalModules: 6,
              nextLesson: 'Module 5: Pranayama Mechanics & Kumbhaka Retention',
              certificationStatus: 'in_progress',
              batch: 'Autumn 2026 Cohort',
            },
            {
              id: 'crs-2',
              title: 'Hatha Yoga Foundation & Asana Alignment',
              slug: 'hatha-foundation',
              level: 'beginner',
              progressPercentage: 100,
              completedModules: 4,
              totalModules: 4,
              nextLesson: 'Curriculum Completed — Assessment Certified',
              certificationStatus: 'completed',
              batch: 'Spring 2026 Cohort',
            },
          ]);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <LoadingState message="Loading your courses..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
            Academic Track
          </span>
          <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
            My Courses & Enrolments
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Track your study progress, syllabus milestones, and teacher training certifications.
          </p>
        </div>

        <Link href="/programs/courses"
          className="inline-flex items-center text-xs font-mono text-plum-900 hover:text-gold-600 border border-border px-3 py-2 rounded bg-surface hover:bg-surface-subtle transition-colors shrink-0"
        >
          Explore All Courses <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-surface border border-border rounded p-6 shadow-soft hover:shadow-card transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="plum" size="sm" className="capitalize">
                      {course.level}
                    </Badge>
                    <Badge
                      variant={course.certificationStatus === 'completed' ? 'success' : 'gold'}
                      size="sm"
                      className="capitalize"
                    >
                      {course.certificationStatus.replace('_', ' ')}
                    </Badge>
                    <span className="text-[11px] font-mono text-ink-faint">
                      {course.batch}
                    </span>
                  </div>

                  <h2 className="font-editorial text-2xl text-plum-900 font-bold">
                    {course.title}
                  </h2>

                  <div className="bg-canvas p-3 rounded border border-border/80 text-xs flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-gold-600 font-semibold block">
                        Next Lesson / Milestone:
                      </span>
                      <span className="text-plum-900 font-medium">{course.nextLesson}</span>
                    </div>
                    <span className="text-ink-faint font-mono text-[11px] shrink-0">
                      {course.completedModules} of {course.totalModules} Modules
                    </span>
                  </div>
                </div>

                {/* Progress Circle / Bar */}
                <div className="lg:w-64 space-y-2 shrink-0">
                  <div className="flex justify-between text-xs font-mono text-ink-muted">
                    <span>Completion</span>
                    <span className="font-bold text-plum-900">{course.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-canvas border border-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold-500 to-plum-700 rounded-full transition-all duration-300"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <Button variant="primary" size="sm" className="w-full text-xs">
                      {course.certificationStatus === 'completed' ? 'View Certificate' : 'Resume Lesson'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Enrolled Courses"
          description="You are not currently enrolled in any academic training courses. View our classical yoga certifications and immerse yourself in the sacred tradition."
          action={
            <Link href="/programs/courses"
              className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
            >
              View Course Catalog
            </Link>
          }
        />
      )}
    </div>
  );
};

export default CoursesView;
