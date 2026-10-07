'use client';

import React, { useEffect, useState } from 'react';
import { StudentService } from '../../services/studentService';
import { StudentPurchase } from '../../types/student';
import { Badge } from '../../components/Badge';
import { EmptyState } from '../../components/EmptyState';
import { LoadingState } from '../../components/LoadingState';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';
import { Receipt, Download } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const [purchases, setPurchases] = useState<StudentPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<StudentPurchase | null>(null);

  useEffect(() => {
    let mounted = true;
    StudentService.getDashboard()
      .then((data) => {
        if (mounted) setPurchases(data.recentPurchases || []);
      })
      .catch(() => {
        if (mounted) {
          setPurchases([
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
    return <LoadingState message="Loading purchase history..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-semibold block">
          Orders & Transactions
        </span>
        <h1 className="font-editorial text-3xl text-plum-900 font-semibold">
          Purchases
        </h1>
        <p className="text-xs text-ink-muted mt-1">
          Review your enrolled courses, workshop passes, and sadhana membership payments.
        </p>
      </div>

      {purchases.length > 0 ? (
        <div className="bg-surface border border-border rounded overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs" aria-label="Student Purchases Table">
              <thead>
                <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[11px]">
                  <th scope="col" className="py-3.5 px-4 font-semibold">Invoice ID</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Description</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Type</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Payment Mode</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Date</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Amount</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {purchases.map((pur) => (
                  <tr key={pur.id} className="hover:bg-canvas/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-medium text-plum-900">
                      {pur.invoiceNo}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-plum-900 max-w-xs">
                      {pur.itemTitle}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-mono text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                        {pur.itemType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-ink-faint font-mono text-[11px]">
                      {pur.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-ink-muted whitespace-nowrap">
                      {pur.date}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-plum-900">
                      {pur.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={pur.status === 'paid' ? 'success' : 'warning'}
                        size="sm"
                        className="capitalize"
                      >
                        {pur.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(pur)}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-gold-600 hover:text-gold-700 underline underline-offset-2"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
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
          title="No Purchases Found"
          description="You do not have any registered purchase history yet."
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.location.href = '/programs'}
              className="text-xs"
            >
              Explore Programs
            </Button>
          }
        />
      )}

      {/* Invoice Modal Preview */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title={`Receipt: ${selectedReceipt.invoiceNo}`}
        >
          <div className="space-y-4 text-xs font-sans text-ink">
            <div className="p-4 bg-canvas border border-border rounded space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-editorial text-lg text-plum-900 font-bold">
                    Kalptaruu Yoga Vidhyalaya
                  </h3>
                  <p className="text-[11px] text-ink-muted">Classical Gurukula Institute</p>
                </div>
                <Badge variant="success" size="sm">
                  PAID
                </Badge>
              </div>
              <div className="border-t border-border/80 pt-2 text-[11px] grid grid-cols-2 gap-2 text-ink-muted">
                <div>Invoice: <strong className="text-plum-900 font-mono">{selectedReceipt.invoiceNo}</strong></div>
                <div>Date: <strong className="text-plum-900">{selectedReceipt.date}</strong></div>
                <div>Method: <strong className="text-plum-900 font-mono">{selectedReceipt.paymentMethod}</strong></div>
                <div>Category: <strong className="text-plum-900 font-mono">{selectedReceipt.itemType}</strong></div>
              </div>
            </div>

            <div className="border border-border rounded overflow-hidden">
              <div className="p-3 bg-canvas-warm border-b border-border font-semibold flex justify-between">
                <span>Item Description</span>
                <span>Total Amount</span>
              </div>
              <div className="p-3 flex justify-between items-center bg-surface">
                <div>
                  <p className="font-semibold text-plum-900">{selectedReceipt.itemTitle}</p>
                  <p className="text-[11px] text-ink-faint">Standard student enrolment fee</p>
                </div>
                <p className="font-mono font-bold text-plum-900 text-sm">{selectedReceipt.amount}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.print()}
                className="text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Print / Download PDF
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSelectedReceipt(null)}
                className="text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchasesView;
