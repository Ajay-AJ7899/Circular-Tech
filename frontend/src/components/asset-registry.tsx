"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Database, Cpu, Printer, Monitor, Tv2, X, Plus, Loader2 } from "lucide-react";
import { StatusBadge, PageHeader, EmptyState, PrimaryButton, SecondaryButton, MonoId, SectionReveal } from "./ui";

type Asset = {
  id: string;
  name: string;
  category: string;
  department: string;
  location: string;
  condition: string;
  usageStatus: string;
  lifecycleStatus: string;
  brand?: string | null;
  model?: string | null;
  purchaseYear?: number;
  replacementCost?: number | null;
  analyzed?: boolean;
};

function conditionVariant(c: string): "success" | "warning" | "error" | "muted" {
  if (c === "EXCELLENT" || c === "GOOD") return "success";
  if (c === "FAIR") return "warning";
  if (c === "POOR" || c === "UNSAFE") return "error";
  return "muted";
}

function lifecycleVariant(s: string): "success" | "warning" | "muted" | "info" {
  if (s === "AVAILABLE") return "success";
  if (s === "UNDER_REVIEW") return "warning";
  if (s === "IN_USE") return "info";
  return "muted";
}

const categoryIcons: Record<string, React.ReactNode> = {
  LAPTOP:    <Monitor size={14} />,
  MONITOR:   <Monitor size={14} />,
  PROJECTOR: <Tv2 size={14} />,
  PRINTER:   <Printer size={14} />,
};

// ---- Modal helpers (must be defined before AddAssetModal function) ----
const API = process.env.NEXT_PUBLIC_API_URL ?? "";

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
        {label} {required && <span style={{ color: "#f87171" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const iStyle: React.CSSProperties = {
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 13,
  width: "100%",
  outline: "none",
};

interface AssetRegistryProps {
  assets: Asset[];
  loading: boolean;
  onAnalyze: (asset: Asset) => void;
  onAdd: (asset: Asset) => void;
}

export function AssetRegistry({ assets, loading, onAnalyze, onAdd }: AssetRegistryProps) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");
  const [condFilter, setCondFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const perPage = 12;

  const categories  = ["ALL", ...Array.from(new Set(assets.map(a => a.category)))];
  const conditions  = ["ALL", "EXCELLENT", "GOOD", "FAIR", "POOR", "UNSAFE"];
  const statuses    = ["ALL", "AVAILABLE", "IN_USE", "UNDER_REVIEW", "RETIRED"];

  const filtered = useMemo(() => {
    return assets.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.department.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q);
      const matchCat    = catFilter    === "ALL" || a.category === catFilter;
      const matchCond   = condFilter   === "ALL" || a.condition === condFilter;
      const matchStatus = statusFilter === "ALL" || a.lifecycleStatus === statusFilter;
      return matchSearch && matchCat && matchCond && matchStatus;
    });
  }, [assets, search, catFilter, condFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems  = filtered.slice((page - 1) * perPage, page * perPage);

  // Reset to page 1 when filters change
  const handleFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const hasFilters = search || catFilter !== "ALL" || condFilter !== "ALL" || statusFilter !== "ALL";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Inventory"
        title="Asset Registry"
        subtitle="Your complete circular resource inventory. Search, filter and analyze assets."
        actions={
          <PrimaryButton size="md" onClick={() => setShowAddModal(true)}>
            <Plus size={14} />
            Add Asset
          </PrimaryButton>
        }
      />

      {/* Add Asset Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddAssetModal
            onClose={() => setShowAddModal(false)}
            onCreated={(asset) => { onAdd(asset); setShowAddModal(false); }}
          />
        )}
      </AnimatePresence>

      {/* Filters */}
      <SectionReveal>
        <div
          className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search assets, IDs, departments…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Category filter */}
          <FilterSelect
            value={catFilter}
            options={categories}
            onChange={handleFilter(setCatFilter)}
            placeholder="Category"
          />

          {/* Condition filter */}
          <FilterSelect
            value={condFilter}
            options={conditions}
            onChange={handleFilter(setCondFilter)}
            placeholder="Condition"
          />

          {/* Status filter */}
          <FilterSelect
            value={statusFilter}
            options={statuses}
            onChange={handleFilter(setStatusFilter)}
            placeholder="Status"
          />

          {/* Clear */}
          {hasFilters && (
            <motion.button
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium"
              style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setSearch(""); setCatFilter("ALL"); setCondFilter("ALL"); setStatusFilter("ALL"); setPage(1); }}
            >
              <X size={12} /> Clear
            </motion.button>
          )}
        </div>
      </SectionReveal>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {loading ? "Loading…" : `${filtered.length} asset${filtered.length !== 1 ? "s" : ""}`}
          {hasFilters && !loading && ` matching filters`}
        </p>
        {!loading && totalPages > 1 && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* Table / Cards */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Database size={22} />}
          title="No assets found"
          description={hasFilters ? "Try adjusting your search or filters." : "No resources in the registry yet."}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
            {/* Header */}
            <div
              className="grid gap-4 px-5 py-3 text-xs font-semibold tracking-widest uppercase"
              style={{
                color: "var(--text-muted)",
                background: "var(--bg-surface)",
                borderBottom: "1px solid var(--border)",
                gridTemplateColumns: "1fr 120px 160px 110px 110px 90px",
              }}
            >
              <span>Asset</span>
              <span>Category</span>
              <span>Location</span>
              <span>Condition</span>
              <span>Status</span>
              <span />
            </div>

            <AnimatePresence mode="popLayout">
              {pageItems.map((asset, i) => (
                <motion.div
                  key={asset.id}
                  className="grid gap-4 px-5 py-4 items-center group cursor-pointer"
                  style={{
                    gridTemplateColumns: "1fr 120px 160px 110px 110px 90px",
                    borderBottom: i < pageItems.length - 1 ? "1px solid var(--border)" : "none",
                    background: "var(--bg-surface)",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ background: "var(--bg-elevated)" }}
                  onClick={() => onAnalyze(asset)}
                >
                  {/* Name + ID */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "var(--bg-overlay)", color: "var(--text-secondary)" }}
                    >
                      {categoryIcons[asset.category] ?? <Database size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                        {asset.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MonoId>{asset.id}</MonoId>
                        <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                          {asset.department}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                    {asset.category}
                  </span>

                  <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                    {asset.location}
                  </span>

                  <StatusBadge variant={conditionVariant(asset.condition)} label={asset.condition} />

                  <StatusBadge
                    variant={lifecycleVariant(asset.lifecycleStatus)}
                    label={asset.lifecycleStatus.replace("_", " ")}
                  />

                  <motion.button
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "var(--emerald-soft)", color: "var(--emerald)" }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={e => { e.stopPropagation(); onAnalyze(asset); }}
                  >
                    <Cpu size={11} />
                    Analyze
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 md:hidden">
            {pageItems.map((asset, i) => (
              <motion.div
                key={asset.id}
                className="glass p-4 flex flex-col gap-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => onAnalyze(asset)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                      {asset.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <MonoId>{asset.id}</MonoId>
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>{asset.department}</span>
                    </div>
                  </div>
                  <StatusBadge variant={conditionVariant(asset.condition)} label={asset.condition} />
                </div>
                <div className="flex items-center justify-between">
                  <StatusBadge
                    variant={lifecycleVariant(asset.lifecycleStatus)}
                    label={asset.lifecycleStatus.replace("_", " ")}
                  />
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "var(--emerald-soft)", color: "var(--emerald)" }}
                    onClick={e => { e.stopPropagation(); onAnalyze(asset); }}
                  >
                    Analyze →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <SecondaryButton
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                size="sm"
              >
                Previous
              </SecondaryButton>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        background: page === p ? "var(--emerald)" : "var(--bg-elevated)",
                        color: page === p ? "#0a0f0d" : "var(--text-secondary)",
                        border: "1px solid var(--border)",
                      }}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <SecondaryButton
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                size="sm"
              >
                Next
              </SecondaryButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ============================================================
// FilterSelect helper
// ============================================================
function FilterSelect({
  value,
  options,
  onChange,
  placeholder,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 rounded-lg text-xs font-medium outline-none transition-colors"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: value !== "ALL" ? "var(--text-primary)" : "var(--text-muted)",
          cursor: "pointer",
          minWidth: 120,
        }}
      >
        {options.map(o => (
          <option key={o} value={o} style={{ background: "#1a2420" }}>
            {o === "ALL" ? placeholder : o.replace("_", " ")}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "var(--text-muted)" }}
      />
    </div>
  );
}

// ============================================================
// Add Asset Modal
// ============================================================
// Add Asset Modal
// ============================================================

function AddAssetModal({ onClose, onCreated }: { onClose: () => void; onCreated: (asset: Asset) => void }) {
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", category: "LAPTOP", brand: "", model: "",
    department: "", location: "", condition: "GOOD",
    usageStatus: "ACTIVE", purchaseYear: String(new Date().getFullYear()),
    replacementCost: "", reportedIssue: "", specs: "",
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim() || null,
        model: form.model.trim() || null,
        department: form.department.trim(),
        location: form.location.trim(),
        condition: form.condition,
        usageStatus: form.usageStatus,
        purchaseYear: Number(form.purchaseYear),
        replacementCost: form.replacementCost ? Number(form.replacementCost) : null,
        reportedIssue: form.reportedIssue.trim(),
        specs: form.specs ? form.specs.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      };
      const res = await fetch(`${API}/api/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error ?? `Failed: ${res.status}`);
      onCreated(payload.data as Asset);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create asset.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.25 }}>
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}
          onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--emerald)" }}>Asset Registry</p>
              <h2 className="text-lg font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>Add New Asset</h2>
            </div>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ color: "var(--text-muted)", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
              <X size={15} />
            </button>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <FormField label="Asset Name" required>
              <input style={iStyle} value={form.name} onChange={set("name")} placeholder="e.g. Library Projector A1" required />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Category" required>
                <select style={{ ...iStyle, cursor: "pointer" }} value={form.category} onChange={set("category")}>
                  {["LAPTOP","MONITOR","PROJECTOR","PRINTER"].map(c => <option key={c} value={c} style={{ background: "#1a2420" }}>{c}</option>)}
                </select>
              </FormField>
              <FormField label="Condition" required>
                <select style={{ ...iStyle, cursor: "pointer" }} value={form.condition} onChange={set("condition")}>
                  {["EXCELLENT","GOOD","FAIR","POOR","UNSAFE"].map(c => <option key={c} value={c} style={{ background: "#1a2420" }}>{c}</option>)}
                </select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Brand">
                <input style={iStyle} value={form.brand} onChange={set("brand")} placeholder="e.g. Dell, HP" />
              </FormField>
              <FormField label="Model">
                <input style={iStyle} value={form.model} onChange={set("model")} placeholder="e.g. ThinkPad E14" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Department" required>
                <input style={iStyle} value={form.department} onChange={set("department")} placeholder="e.g. Engineering" required />
              </FormField>
              <FormField label="Location" required>
                <input style={iStyle} value={form.location} onChange={set("location")} placeholder="e.g. Store Room B" required />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Usage Status" required>
                <select style={{ ...iStyle, cursor: "pointer" }} value={form.usageStatus} onChange={set("usageStatus")}>
                  {["ACTIVE","UNUSED","MAINTENANCE"].map(s => <option key={s} value={s} style={{ background: "#1a2420" }}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="Purchase Year" required>
                <input style={iStyle} type="number" min="1990" max={new Date().getFullYear()} value={form.purchaseYear} onChange={set("purchaseYear")} required />
              </FormField>
            </div>
            <FormField label="Replacement Cost (₹)">
              <input style={iStyle} type="number" min="0" value={form.replacementCost} onChange={set("replacementCost")} placeholder="e.g. 45000" />
            </FormField>
            <FormField label="Specifications (comma-separated)">
              <input style={iStyle} value={form.specs} onChange={set("specs")} placeholder="e.g. 16GB RAM, 256GB SSD, HDMI" />
            </FormField>
            <FormField label="Reported Issue">
              <textarea style={{ ...iStyle, resize: "vertical", minHeight: 72 } as React.CSSProperties}
                value={form.reportedIssue} onChange={set("reportedIssue")} placeholder="Describe any known issues, or leave blank" />
            </FormField>
            {formError && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
                ⚠ {formError}
              </div>
            )}
            <div className="flex items-center gap-3 justify-end pt-2" style={{ borderTop: "1px solid var(--border)" }}>
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold"
                style={{ background: saving ? "var(--emerald-dim)" : "var(--emerald)", color: "#0a0f0d", opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Plus size={14} /> Add Asset</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
}

