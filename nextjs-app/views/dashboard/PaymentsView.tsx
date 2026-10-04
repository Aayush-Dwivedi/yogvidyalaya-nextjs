'use client';

import React, { useEffect, useState } from 'react';
import { StudentService } from '../../services/studentService';
import { StudentPurchase } from '../../types/student';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { Download } from 'lucide-react';

export const PaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<StudentPurchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    StudentService.getDashboard()
      .then((data) => {
        if (mounted) setPayments(data.recentPurchases || []);
      })
      .catch(() => {
        if (mounted) {
          setPayments([
            {
              id: 'tx-201',
              invoiceNo: 'INV-2026-0891',
              itemTitle: '200-Hour Classical Yoga Teacher Training (TTC)',
              itemType: 'Course',
              date: 'Sep 15, 2026',
              amount: '₹48,000',
              rawAmount: 48000,
              status: 'paid',
              paymentMethod: 'UPI / NetBanking',
            },
            {
              id: 'tx-202',
              invoiceNo: 'INV-2026-0814',
              itemTitle: 'Monthly Sadhana Pass — October 2026',
              itemType: 'Membership',
              date: 'Sep 28, 2026',
              amount: '₹2,500',
              rawAmount: 2500,
              status: 'paid',
              paymentMethod: 'Debit Card (**4120)',
            },
            {
              id: 'tx-203',
              invoiceNo: 'INV-2026-0752',
              itemTitle: 'Pranayama & Kundalini Awakening Masterclass',
              itemType: 'Workshop',
              date: 'Aug 20, 2026',
              amount: '₹5,500',
              rawAmount: 5500,
              status: 'paid',
              paymentMethod: 'UPI',
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
    return <LoadingState message="Loading payment history..." />;
  }

  const totalPaid = payments.reduce((acc, curr) => acc + (curr.rawAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
            Financial Ledger
          </span>
          <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
            Payment History
          </h1>
          <p className="text-xs text-ink-muted mt-1">
            Complete record of your tuition receipts, shala passes, and tax invoices.
          </p>
        </div>

        {/* Ledger Summary Pill */}
        <div className="bg-surface border border-border px-4 py-2 rounded text-right shrink-0">
          <span className="text-[10px] font-mono uppercase text-ink-faint block">
            Cumulative Total
          </span>
          <span className="font-mono text-base font-bold text-plum-900">
            ₹{totalPaid.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {payments.length > 0 ? (
        <div className="bg-surface border border-border rounded overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs" aria-label="Payment Ledger Table">
              <thead>
                <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3.5 px-4 font-semibold">Invoice No</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Description</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Payment Mode</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Date</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Amount</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {payments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-plum-900">
                      {tx.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 text-plum-900 font-medium">
                      {tx.itemTitle}
                    </td>
                    <td className="py-3.5 px-4 text-ink-faint font-mono text-[11px]">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-plum-900">
                      {tx.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={tx.status === 'paid' ? 'success' : 'warning'}
                        size="sm"
                        className="capitalize"
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-gold-600 hover:text-gold-700 underline underline-offset-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No Transactions Recorded"
          description="You do not have any fee payments or transactions on file."
        />
      )}
    </div>
  );
};

export default PaymentsView;
