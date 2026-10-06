'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '../../components/Badge';
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface AdminModulePlaceholderProps {
  moduleName: string;
  category: string;
  description: string;
  sampleColumns: string[];
  sampleCount: number;
}

export const AdminModulePlaceholder: React.FC<AdminModulePlaceholderProps> = ({
  moduleName,
  category,
  description,
  sampleColumns,
  sampleCount,
}) => {
  return (
    <div className="space-y-5">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-border shadow-soft">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-ink-muted">
            <Link href="/admin" className="hover:text-plum-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Dashboard
            </Link>
            <span>/</span>
            <span className="uppercase text-gold-700 font-semibold">{category}</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-plum-900 font-bold tracking-tight">
            {moduleName}
          </h1>
          <p className="text-xs text-ink-muted mt-0.5 max-w-2xl">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="gold" size="sm" className="font-mono text-[10px]">
            Foundation Active
          </Badge>
        </div>
      </div>

      {/* Control Bar: Search & Action Shell */}
      <div className="bg-white p-3.5 rounded border border-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            placeholder={`Search ${moduleName.toLowerCase()}...`}
            className="w-full bg-canvas text-xs pl-8 pr-3 py-1.5 rounded border border-border focus:outline-none focus:border-gold-500 font-sans"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono border border-border rounded bg-white hover:bg-surface text-ink-muted transition-colors"
          >
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-plum-900 text-gold-200 rounded hover:bg-plum-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>
      </div>

      {/* Structured Schema Data Table */}
      <div className="bg-white rounded border border-border shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-canvas border-b border-border text-ink-muted font-mono uppercase tracking-wider text-[10px]">
                <th scope="col" className="py-2.5 px-4 font-semibold w-12">#</th>
                {sampleColumns.map((col, idx) => (
                  <th key={idx} scope="col" className="py-2.5 px-4 font-semibold">
                    {col}
                  </th>
                ))}
                <th scope="col" className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[1, 2, 3].map((row) => (
                <tr key={row} className="hover:bg-canvas/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-ink-faint">
                    0{row}
                  </td>
                  {sampleColumns.map((col, colIdx) => (
                    <td key={colIdx} className="py-3 px-4 text-plum-900 font-medium">
                      {colIdx === 0 ? (
                        <div className="font-semibold text-xs text-plum-900">
                          {moduleName} Entry #{row}
                        </div>
                      ) : col.toLowerCase().includes('status') ? (
                        <Badge variant="success" size="sm" className="text-[10px]">
                          Published
                        </Badge>
                      ) : col.toLowerCase().includes('date') ? (
                        <span className="text-[11px] font-mono text-ink-muted">Oct 0{row}, 2026</span>
                      ) : (
                        <span className="text-[11px] font-mono text-ink-faint">
                          {col} Value
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] font-mono text-gold-700 hover:underline cursor-pointer">
                      Edit
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Records Summary */}
        <div className="p-4 bg-canvas border-t border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {sampleCount} entries recorded.
            </span>
          </div>

          <span className="text-[10px] font-mono text-ink-faint">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminModulePlaceholder;
