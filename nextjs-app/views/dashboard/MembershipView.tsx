'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { StudentService } from '../../services/studentService';
import { StudentMembership } from '../../types/student';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { CheckCircle2, Shield, ExternalLink } from 'lucide-react';

export const MembershipView: React.FC = () => {
  const [membership, setMembership] = useState<StudentMembership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    StudentService.getDashboard()
      .then((data) => {
        if (mounted) setMembership(data.currentMembership || null);
      })
      .catch(() => {
        if (mounted) {
          setMembership({
            planName: 'Daily Sadhana Shala Pass',
            billingCycle: 'monthly',
            status: 'active',
            validUntil: 'Nov 30, 2026',
            batch: 'Morning Shala (06:00 AM – 07:30 AM)',
            perks: [
              'Unlimited weekday morning & evening sadhana',
              'Access to Vedic scripture reading library',
              'Complimentary herbal decoctions and herbal tea',
              '10% preferred discount on weekend retreats & intensives',
              'Monthly 1-on-1 alignment review with lead Acharya',
            ],
          });
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
    return <LoadingState message="Loading your membership..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
            Shala Affiliation
          </span>
          <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
            Membership
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Details of your current sadhana membership pass, shala batch, and student privileges.
          </p>
        </div>

        <Link href="/programs/membership"
          className="inline-flex items-center text-xs font-mono text-plum-900 hover:text-gold-600 border border-border px-3 py-2 rounded bg-surface hover:bg-surface-subtle transition-colors shrink-0"
        >
          View All Tiers <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
        </Link>
      </div>

      {membership ? (
        <div className="space-y-6">
          {/* Main Membership Card */}
          <div className="bg-surface border border-border rounded p-6 sm:p-8 shadow-card relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-plum-800 via-gold-500 to-plum-900" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="success" size="sm" className="capitalize">
                    {membership.status}
                  </Badge>
                  <span className="text-xs font-mono text-ink-faint capitalize">
                    {membership.billingCycle} Billing Cycle
                  </span>
                </div>
                <h2 className="font-editorial text-3xl text-plum-900 font-bold">
                  {membership.planName}
                </h2>
              </div>

              <div className="bg-canvas border border-border px-4 py-3 rounded text-left sm:text-right shrink-0">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-faint block">
                  Renewal Date
                </span>
                <span className="font-mono text-sm font-bold text-plum-900">
                  {membership.validUntil}
                </span>
              </div>
            </div>

            {/* Batch & Timing */}
            <div className="py-6 border-b border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-canvas p-4 rounded border border-border/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gold-600 font-semibold block mb-1">
                  Enrolled Practice Batch
                </span>
                <p className="font-semibold text-plum-900 text-sm">{membership.batch}</p>
                <p className="text-[11px] text-ink-faint mt-0.5">Hall 1 (Main Wooden Shala)</p>
              </div>

              <div className="bg-canvas p-4 rounded border border-border/80">
                <span className="text-[10px] uppercase font-mono tracking-wider text-gold-600 font-semibold block mb-1">
                  Attendance Rule
                </span>
                <p className="font-semibold text-plum-900 text-sm">Consistent Sadhana Commitment</p>
                <p className="text-[11px] text-ink-faint mt-0.5">80% attendance required for batch progression</p>
              </div>
            </div>

            {/* Privileges Checklist */}
            <div className="pt-6 space-y-3">
              <h3 className="text-xs uppercase font-mono tracking-widest text-ink-muted font-semibold">
                Included Privileges & Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {membership.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-plum-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shala Etiquette Card */}
          <div className="bg-canvas border border-border rounded p-6 text-xs text-ink space-y-2">
            <h4 className="font-semibold text-plum-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-gold-600" />
              Gurukula Tradition & Guidelines
            </h4>
            <p className="text-ink-muted leading-relaxed">
              Silence is observed in the main shala 10 minutes prior to chanting. Mobile phones must be deposited in the secure cloak lockers. Mat spaces are honored in traditional order.
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Active Membership"
          description="You currently do not have an active sadhana pass. Join our daily shala batches to practice under traditional lineage."
          action={
            <Link href="/programs/membership"
              className="inline-flex items-center text-xs font-semibold text-plum-900 border border-gold-500/70 px-4 py-2 rounded bg-surface hover:bg-gold-50 transition-colors"
            >
              View Membership Plans
            </Link>
          }
        />
      )}
    </div>
  );
};

export default MembershipView;
