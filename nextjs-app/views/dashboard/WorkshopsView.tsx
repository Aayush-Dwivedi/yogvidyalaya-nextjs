'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StudentService } from '../../services/studentService';
import { StudentWorkshop } from '../../types/student';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { Calendar, Clock, Award, MapPin, ExternalLink } from 'lucide-react';

export const WorkshopsView: React.FC = () => {
  const [workshops, setWorkshops] = useState<StudentWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    StudentService.getDashboard()
      .then((data) => {
        if (mounted) setWorkshops(data.upcomingWorkshops || []);
      })
      .catch(() => {
        if (mounted) {
          setWorkshops([
            {
              id: 'ws-101',
              title: 'Pranayama & Kundalini Awakening Intensive',
              slug: 'pranayama-kundalini',
              date: 'Oct 18, 2026',
              time: '09:00 AM – 05:00 PM',
              mode: 'in-person',
              instructor: 'Mrs. Shuchi Mohan',
              attendanceStatus: 'registered',
            },
            {
              id: 'ws-102',
              title: 'Yoga Nidra & Vedic Sound Healing Masterclass',
              slug: 'yoga-nidra-sound',
              date: 'Nov 07, 2026',
              time: '02:00 PM – 06:00 PM',
              mode: 'hybrid',
              instructor: 'Yogini Devika Amma',
              attendanceStatus: 'waitlist',
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
    return <LoadingState message="Loading workshop schedule..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
            Special Immersions
          </span>
          <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
            Workshop Schedule
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Registered masterclasses, weekend sadhana intensives, and guest acharya lectures.
          </p>
        </div>

        <Link href="/programs/workshops"
          className="inline-flex items-center text-xs font-mono text-plum-900 hover:text-gold-600 border border-border px-3 py-2 rounded bg-surface hover:bg-surface-subtle transition-colors shrink-0"
        >
          View Public Catalog <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      {workshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workshops.map((ws) => (
            <div
              key={ws.id}
              className="bg-surface border border-border rounded p-6 shadow-soft flex flex-col justify-between hover:shadow-card transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={ws.attendanceStatus === 'registered' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {ws.attendanceStatus === 'registered' ? 'Confirmed Seat' : 'Waitlisted'}
                  </Badge>
                  <span className="text-[11px] font-mono text-ink-faint capitalize border border-border px-2 py-0.5 rounded">
                    {ws.mode}
                  </span>
                </div>

                <h2 className="font-editorial text-xl text-plum-900 font-bold leading-snug">
                  {ws.title}
                </h2>

                <div className="bg-canvas p-3 rounded border border-border/70 space-y-1.5 text-xs text-ink">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Date:</strong> {ws.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Timing:</strong> {ws.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Lead Acharya:</strong> {ws.instructor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <span><strong>Venue:</strong> Shala Meditation Pavilion</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between text-xs">
                <span className="text-ink-faint font-mono text-[11px]">
                  ID: KPT-WS-{ws.id.slice(-4).toUpperCase()}
                </span>
                <span className="text-emerald-700 font-medium">
                  {ws.attendanceStatus === 'registered' ? '✓ Registered' : 'Pending Seat Confirmation'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Registered Workshops"
          description="You have not enrolled in any upcoming weekend masterclasses. Browse our offerings to deepen your practice."
          action={
            <Link href="/programs/workshops"
              className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
            >
              Explore Workshops
            </Link>
          }
        />
      )}
    </div>
  );
};

export default WorkshopsView;
