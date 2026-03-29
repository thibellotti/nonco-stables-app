"use client";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/page-transition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiKeys } from "@/lib/mock-data";
import { CornerBrackets } from "@/components/ui/corner-brackets";
import { GeoShape } from "@/components/ui/geo-shape";

// ---------------------------------------------------------------------------
// Permission scopes
// ---------------------------------------------------------------------------

const permissions = [
  { scope: "Read balances", production: true, sandbox: true },
  { scope: "Execute trades", production: true, sandbox: true },
  { scope: "Initiate payments", production: true, sandbox: false },
  { scope: "Manage payees", production: false, sandbox: true },
  { scope: "View reports", production: true, sandbox: true },
  { scope: "Manage API keys", production: false, sandbox: false },
];

// ---------------------------------------------------------------------------
// API Keys page
// ---------------------------------------------------------------------------

export default function ApiKeysPage() {
  return (
    <PageTransition className="px-4 sm:px-6 md:px-8 w-full space-y-6">
      {/* Top row */}
      <div className="flex items-center justify-end">
        <Button variant="cyan" size="sm">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-[11px] font-medium uppercase tracking-[.1em]">Generate key</span>
        </Button>
      </div>

      {/* Warning banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[var(--bg-card)] border border-[var(--border)] border-l-2 border-l-[var(--amber)] rounded-lg px-5 py-4 flex items-start gap-3"
      >
        <CornerBrackets size={14} color="rgba(255,255,255,0.06)" corners={["tl","br"]} />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5" aria-hidden="true">
          <path d="M8 5v3.5M8 10.5h.01M3.07 13h9.86c1.1 0 1.79-1.19 1.24-2.14L9.24 2.86c-.55-.95-1.93-.95-2.48 0L1.83 10.86C1.28 11.81 1.97 13 3.07 13z" stroke="var(--amber)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <p className="text-sm font-sans font-medium text-[var(--text)]">
            API keys are shown only once upon creation.
          </p>
          <p className="text-xs font-sans text-[var(--text-4)] mt-1">
            Store your secret key securely. If lost, you will need to revoke and
            generate a new key. Never share keys in client-side code.
          </p>
        </div>
      </motion.div>

      {/* Usage stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Requests today</div>
          <div className="text-xl font-mono font-bold text-white mt-1">1,247</div>
          <div className="text-[10px] text-[var(--status-positive)] mt-0.5">+12% vs avg</div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Success rate</div>
          <div className="text-xl font-mono font-bold text-[var(--status-positive)] mt-1">99.8%</div>
          <div className="text-[10px] text-[var(--text-4)] mt-0.5">Last 24h</div>
        </div>
        <div className="bg-[var(--bg-elevated)] rounded-lg p-4">
          <div className="text-[9px] text-[var(--text-4)] uppercase tracking-[0.1em]">Avg latency</div>
          <div className="text-xl font-mono font-bold text-white mt-1">48ms</div>
          <div className="text-[10px] text-[var(--text-4)] mt-0.5">p50</div>
        </div>
      </div>

      {/* Active keys */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        {/* Grafismo — Technical theme */}
        <GeoShape variant="square-dots" size={36} className="absolute" style={{ top: 12, right: 16, opacity: 0.2 }} />
        <GeoShape variant="bracket-tl" size={20} className="absolute" style={{ top: 8, left: 8, opacity: 0.15 }} />
        <GeoShape variant="hex" size={30} className="absolute" style={{ bottom: 14, right: 18, opacity: 0.12 }} />

        <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
            Active keys
          </span>
        </div>

        <div className="divide-y divide-[var(--border-row)]">
          {apiKeys.map((key, i) => {
            const isLive = key.environment === "live";
            return (
              <motion.div
                key={key.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                {/* Status dot + name */}
                <div className="flex items-center gap-3 sm:w-48">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: isLive ? "var(--green)" : "var(--amber)",
                    }}
                  />
                  <div>
                    <span className="text-sm font-sans font-medium text-white block">
                      {key.name}
                    </span>
                    <span className="text-[10px] font-sans text-[var(--text-4)] block mt-0.5">
                      Created {key.createdAt} &middot; Last used {key.lastUsed}
                    </span>
                  </div>
                </div>

                {/* Masked prefix */}
                <div className="flex-1">
                  <code className="text-xs font-mono text-[var(--text-4)] bg-[var(--bg-elevated)] px-3 py-1.5 rounded">
                    {key.prefix}
                  </code>
                </div>

                {/* Environment badge */}
                <Badge variant={isLive ? "green" : "amber"}>
                  {isLive ? "Live" : "Sandbox"}
                </Badge>

                {/* Revoke button */}
                <button className="text-[11px] uppercase tracking-wider font-bold text-[var(--red)] hover:text-white transition-colors cursor-pointer font-sans">
                  Revoke
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Permissions table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden"
      >
        <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--bg-elevated)]">
          <span className="text-[11px] uppercase tracking-[.15em] font-sans text-[var(--text-3)]">
            Permissions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em]">
                  Scope
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-center">
                  Production
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-[var(--text-4)] uppercase tracking-[0.1em] text-center">
                  Sandbox
                </th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <motion.tr
                  key={p.scope}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="border-b border-[var(--border-row)]"
                >
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-sans text-[var(--text)]">{p.scope}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={p.production ? "green" : "default"}>
                      {p.production ? "On" : "Off"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={p.sandbox ? "green" : "default"}>
                      {p.sandbox ? "On" : "Off"}
                    </Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </PageTransition>
  );
}
