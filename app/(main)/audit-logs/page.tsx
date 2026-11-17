'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ShieldAlert, Search } from 'lucide-react'

type AuditLog = {
  audit_id: string | number
  table_name: string
  action: string
  record_key: string | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  action_by: string | null
  action_at: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTable, setSelectedTable] = useState('ALL')
  const supabase = createClient()

  useEffect(() => {
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('action_at', { ascending: false })

      if (!error && data) {
        setLogs(data as AuditLog[])
      }
      setLoading(false)
    }

    fetchLogs()
  }, [supabase])

  // Kunin ang unique table names para sa filter dropdown
  const tableNames = ['ALL', ...Array.from(new Set(logs.map((log) => log.table_name)))]

  const filteredLogs = logs.filter((log) => {
    const matchesTable = selectedTable === 'ALL' || log.table_name === selectedTable
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      log.table_name?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      (log.record_key && log.record_key.toLowerCase().includes(query)) ||
      (log.action_by && log.action_by.toLowerCase().includes(query))

    return matchesTable && matchesSearch
  })

  return (
    <div className="p-8 text-white w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-emerald-400" size={28} />
          <h1 className="text-2xl font-bold tracking-tight">Audit Log Viewer</h1>
        </div>
      </div>

      {/* Search & Table Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search table, action, record key, or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
        >
          {tableNames.map((table) => (
            <option key={table} value={table}>
              {table === 'ALL' ? 'All Tables' : table}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider bg-slate-950/50">
              <th className="p-4">Timestamp</th>
              <th className="p-4">Table</th>
              <th className="p-4">Action</th>
              <th className="p-4">Record Key</th>
              <th className="p-4">Action By</th>
              <th className="p-4">Changes (Old → New)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  Loading audit logs...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-white/[0.02] transition align-top">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.action_at).toLocaleString()}
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-300">{log.table_name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-emerald-500/15 text-emerald-400 rounded text-xs font-semibold uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-300">{log.record_key || '—'}</td>
                  <td className="p-4 text-slate-300">{log.action_by || 'System'}</td>
                  <td className="p-4 text-xs font-mono text-slate-400 max-w-xs">
                    {log.old_values && (
                      <div className="mb-1 text-rose-400/90 break-all">
                        <span className="font-semibold">Old:</span> {JSON.stringify(log.old_values)}
                      </div>
                    )}
                    {log.new_values && (
                      <div className="text-emerald-400/90 break-all">
                        <span className="font-semibold">New:</span> {JSON.stringify(log.new_values)}
                      </div>
                    )}
                    {!log.old_values && !log.new_values && '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}