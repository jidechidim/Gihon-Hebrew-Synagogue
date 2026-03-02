"use client";

import { useMemo, useState } from "react";
import CTAButton from "../../components/CTAButton";
import { encodeCmsPreviewData } from "@/lib/cmsPreview";

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: 16,
};

const modalStyle = {
  width: "min(900px, 96vw)",
  maxHeight: "90vh",
  overflow: "auto",
  background: "#fff",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
  padding: 16,
};

const sectionStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: 12,
  marginTop: 12,
};

const iframeStyle = {
  width: "100%",
  minHeight: 520,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  background: "#fff",
};

function formatValue(value) {
  if (value === undefined) return "undefined";
  if (typeof value === "string") return value === "" ? '""' : value;
  if (value === null) return "null";

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function collectDiffs(before, after, path = "", diffs = []) {
  if (Object.is(before, after)) return diffs;

  const beforeIsObj = before !== null && typeof before === "object";
  const afterIsObj = after !== null && typeof after === "object";

  if (beforeIsObj && afterIsObj) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    keys.forEach((key) => {
      const childPath = path ? `${path}.${key}` : key;
      collectDiffs(before[key], after[key], childPath, diffs);
    });
    return diffs;
  }

  diffs.push({
    path: path || "(root)",
    before,
    after,
  });

  return diffs;
}

export default function ContentPreviewModal({
  data,
  originalData,
  onConfirmSave,
  saving = false,
  previewLabel = "Preview Changes",
  confirmLabel = "Confirm & Save",
  websitePreviewPath = "",
  websitePreviewData = null,
  className = "",
  style = {},
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const differences = useMemo(() => {
    if (!originalData || !data) return [];
    return collectDiffs(originalData, data);
  }, [originalData, data]);

  const hasChanges = differences.length > 0;
  const visibleDiffs = differences.slice(0, 40);

  const websitePreview = useMemo(() => {
    if (!websitePreviewPath) {
      return { src: "", usesDraftData: false };
    }

    const encoded = encodeCmsPreviewData(websitePreviewData ?? data);
    if (!encoded) {
      return { src: websitePreviewPath, usesDraftData: false };
    }

    const params = new URLSearchParams();
    params.set("cmsPreview", "1");
    params.set("previewData", encoded);

    const joiner = websitePreviewPath.includes("?") ? "&" : "?";
    const srcWithDraft = `${websitePreviewPath}${joiner}${params.toString()}`;

    if (srcWithDraft.length > 7500) {
      return { src: websitePreviewPath, usesDraftData: false };
    }

    return { src: srcWithDraft, usesDraftData: true };
  }, [websitePreviewPath, websitePreviewData, data]);

  const handleConfirm = async () => {
    if (!onConfirmSave || submitting) return;

    setSubmitting(true);
    try {
      const result = await onConfirmSave();
      if (result !== false) setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CTAButton
        onClick={() => setOpen(true)}
        disabled={saving || !data}
        type="button"
        variant="secondary"
        className={className}
        style={style}
      >
        {previewLabel}
      </CTAButton>

      {open ? (
        <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Preview changes">
          <div style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3 style={{ margin: 0 }}>Preview Changes</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  border: "1px solid #d1d5db",
                  background: "#fff",
                  borderRadius: 6,
                  padding: "4px 8px",
                  cursor: "pointer",
                }}
                aria-label="Close preview"
              >
                Close
              </button>
            </div>

            <section style={sectionStyle}>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {hasChanges
                  ? `${differences.length} unsaved field change${differences.length === 1 ? "" : "s"} detected`
                  : "No unsaved changes detected"}
              </p>

              {hasChanges ? (
                <ul style={{ marginTop: 8, paddingLeft: 18, marginBottom: 0 }}>
                  {visibleDiffs.map((item, index) => (
                    <li key={`${item.path}-${index}`} style={{ marginBottom: 6 }}>
                      <code>{item.path}</code>: <strong>{formatValue(item.before)}</strong> {" -> "}{" "}
                      <strong>{formatValue(item.after)}</strong>
                    </li>
                  ))}
                </ul>
              ) : null}

              {differences.length > visibleDiffs.length ? (
                <p style={{ marginTop: 8, marginBottom: 0, color: "#4b5563" }}>
                  Showing first {visibleDiffs.length} changes.
                </p>
              ) : null}
            </section>

            {websitePreview.src ? (
              <section style={sectionStyle}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", marginBottom: 8 }}>
                  <h4 style={{ margin: 0 }}>Website Preview</h4>
                  <a
                    href={websitePreview.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1d4ed8", textDecoration: "underline", fontSize: 13 }}
                  >
                    Open full page
                  </a>
                </div>
                {!websitePreview.usesDraftData ? (
                  <p style={{ marginTop: 0, color: "#4b5563", fontSize: 13 }}>
                    Showing saved page version.
                  </p>
                ) : null}
                <iframe
                  src={websitePreview.src}
                  title="Website preview"
                  style={iframeStyle}
                />
              </section>
            ) : null}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14 }}>
              <CTAButton type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </CTAButton>
              <CTAButton
                type="button"
                variant="primary"
                onClick={handleConfirm}
                disabled={saving || submitting || !hasChanges}
              >
                {saving || submitting ? "Saving..." : confirmLabel}
              </CTAButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
