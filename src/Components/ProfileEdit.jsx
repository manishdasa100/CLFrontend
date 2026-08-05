/* ProfileEdit.jsx — edit-mode editors, toolbar, dialog, toast. */
import React, { useRef, useEffect, useState } from "react";
import Icon from "../Components/Icon";
import { isDefaultDp, initialsOf } from "./profileUtils";
import { useOccupations } from "../services/queries";
import { ImageCropModal } from "./ImageCropModal";

const DEFAULT_DP = "https://assets.codinglemon.com/users/default/default_user_dp.jpg";

function AddInline({ children, onClick }) {
  return (
    <button className="pf-addchip" type="button" onClick={onClick}>
      <Icon name="plus" size={11} /> {children}
    </button>
  );
}

/* ── editable identity card ──────────────────────────────────── */
export function EditIdentityCard({ draft, update, onFileSelect }) {
  const fileRef = useRef(null);
  const { data: occupations = [] } = useOccupations();
  const [otherMode, setOtherMode] = useState(false);
  const [cropFile, setCropFile] = useState(null);

  // When occupations load and the existing value isn't in the list, activate other mode
  useEffect(() => {
    if (occupations.length > 0 && draft.userOccupation && !occupations.includes(draft.userOccupation)) {
      setOtherMode(true);
    }
  }, [occupations]);

  const dropdownValue = !draft.userOccupation && !otherMode ? "" : otherMode ? "Other" : draft.userOccupation;

  const onPickFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setCropFile(f);
    e.target.value = "";
  };

  const onCropConfirm = (croppedFile, previewUrl) => {
    onFileSelect?.(croppedFile);
    update(d => { d.profilePictureUrl = previewUrl; });
    setCropFile(null);
  };

  const hasPic = draft.profilePictureUrl && !isDefaultDp(draft.profilePictureUrl);

  const addSkill = () => update(d => { d.skillTags = [...(d.skillTags || []), ""]; });
  const setSkill = (i, v) => update(d => { d.skillTags[i] = v; });
  const removeSkill = (i) => update(d => { d.skillTags.splice(i, 1); });

  const addExp = () => update(d => {
    d.workExperience = [...(d.workExperience || []), {
      companyName: "", jobTitle: "", startYear: "", endYear: ""
    }];
  });
  const setExp = (i, key, v) => update(d => { d.workExperience[i][key] = v; });
  const removeExp = (i) => update(d => { d.workExperience.splice(i, 1); });

  const SOCIAL = [
    { key: "githubUrl",   label: "GitHub",      icon: "github",   ph: "https://github.com/username" },
    { key: "linkedinUrl", label: "LinkedIn",    icon: "linkedin", ph: "https://linkedin.com/in/username" },
    { key: "twitterUrl",  label: "X / Twitter", icon: "twitter",  ph: "https://x.com/username" }
  ];

  return (
    <>
    <aside className="pf-id is-editing">
      <div className="pf-cover">
        <span className="pf-cover-badge"><Icon name="edit" size={12} style={{ color: "var(--cyan)" }} /> Editing</span>
      </div>
      <div className="pf-id-body">
        <div className="pf-avatar-wrap">
          <div className="pf-avatar">
            <div className="pf-avatar-inner">
              {hasPic ? <img src={draft.profilePictureUrl} alt="" /> : initialsOf(draft.firstName, draft.lastName)}
            </div>
          </div>
          <button className="pf-avatar-upload" type="button" aria-label="Upload photo" onClick={() => fileRef.current && fileRef.current.click()}>
            <Icon name="camera" size={15} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickFile} />
        </div>
        {hasPic && (
          <button className="pf-editbtn pf-editbtn-ghost" type="button" style={{ marginTop: 10 }}
                  onClick={() => { onFileSelect?.(null); update(d => { d.profilePictureUrl = DEFAULT_DP; }); }}>
            <Icon name="x" size={11} /> Remove photo
          </button>
        )}

        <div style={{ marginTop: 16 }}>
          <h1 className="pf-name">{draft.firstName} {draft.lastName}</h1>
          <div className="pf-handle">@{draft.username}</div>
        </div>

        {/* occupation */}
        <div className="pf-block" style={{ marginTop: 16 }}>
          <div className="pf-block-head">
            <span className="pf-block-label"><Icon name="briefcase" size={12} /> Occupation</span>
            {(draft.userOccupation != null || otherMode) && (
              <button className="pf-editbtn pf-editbtn-danger pf-editbtn-icon" type="button" aria-label="Remove occupation"
                      onClick={() => { setOtherMode(false); update(d => { d.userOccupation = null; }); }}><Icon name="x" size={12} /></button>
            )}
          </div>
          {(draft.userOccupation != null || otherMode) ? (
            <>
              <select
                className={`pf-input pf-input-sm pf-select${dropdownValue === "" ? " pf-select-empty" : ""}`}
                value={dropdownValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "Other") {
                    setOtherMode(true);
                    update(d => { d.userOccupation = ""; });
                  } else {
                    setOtherMode(false);
                    update(d => { d.userOccupation = val; });
                  }
                }}
              >
                <option value="" disabled>Select occupation…</option>
                {occupations.map(occ => (
                  <option key={occ} value={occ}>{occ}</option>
                ))}
                <option value="Other">Other…</option>
              </select>
              {otherMode && (
                <input
                  className="pf-input pf-input-sm"
                  style={{ marginTop: 6 }}
                  placeholder="Enter your occupation"
                  value={draft.userOccupation || ""}
                  onChange={(e) => update(d => { d.userOccupation = e.target.value; })}
                  autoFocus
                />
              )}
            </>
          ) : (
            <AddInline onClick={() => update(d => { d.userOccupation = ""; })}>Add occupation</AddInline>
          )}
        </div>

        <div className="pf-divider" />

        {/* location */}
        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="pin" size={12} /> Location</span></div>
          <div className="pf-edit-row">
            <input className="pf-input pf-input-sm" placeholder="City"
                   value={(draft.location && draft.location.city) || ""}
                   onChange={(e) => update(d => { d.location = d.location || {}; d.location.city = e.target.value; })} />
            <input className="pf-input pf-input-sm" placeholder="Country"
                   value={(draft.location && draft.location.country) || ""}
                   onChange={(e) => update(d => { d.location = d.location || {}; d.location.country = e.target.value; })} />
          </div>
        </div>

        {/* experience */}
        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="briefcase" size={12} /> Experience</span></div>
          <div className="pf-edit-stack">
            {(draft.workExperience || []).map((exp, i) => (
              <div className="pf-exp-edit" key={i}>
                <div className="pf-exp-edit-head">
                  <span className="pf-exp-edit-title">Role {i + 1}</span>
                  <button className="pf-editbtn pf-editbtn-danger pf-editbtn-icon" type="button" aria-label="Remove role"
                          onClick={() => removeExp(i)}><Icon name="x" size={12} /></button>
                </div>
                <input className="pf-input pf-input-sm" placeholder="Company" value={exp.companyName || ""}
                       onChange={(e) => setExp(i, "companyName", e.target.value)} />
                <input className="pf-input pf-input-sm" placeholder="Job title" value={exp.jobTitle}
                       onChange={(e) => setExp(i, "jobTitle", e.target.value)} />
                <div className="pf-edit-row">
                  <input className="pf-input pf-input-sm" placeholder="From" inputMode="numeric" value={exp.startYear}
                         onChange={(e) => setExp(i, "startYear", e.target.value.replace(/\D/g, "").slice(0, 4))} />
                  <input className="pf-input pf-input-sm" placeholder="To" inputMode="numeric" value={exp.endYear}
                         onChange={(e) => setExp(i, "endYear", e.target.value.replace(/\D/g, "").slice(0, 4))} />
                </div>
              </div>
            ))}
            <button className="pf-add-full" type="button" onClick={addExp}>
              <Icon name="plus" size={13} /> Add work experience
            </button>
          </div>
        </div>

        {/* school */}
        <div className="pf-block">
          <div className="pf-block-head">
            <span className="pf-block-label"><Icon name="graduation" size={12} /> Education</span>
            {(draft.school != null) && (
              <button className="pf-editbtn pf-editbtn-danger pf-editbtn-icon" type="button" aria-label="Remove school"
                      onClick={() => update(d => { d.school = null; })}><Icon name="x" size={12} /></button>
            )}
          </div>
          {draft.school != null
            ? <input className="pf-input pf-input-sm" placeholder="School / University" value={draft.school}
                     onChange={(e) => update(d => { d.school = e.target.value; })} />
            : <AddInline onClick={() => update(d => { d.school = ""; })}>Add school</AddInline>}
        </div>

        {/* skills */}
        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="target" size={12} /> Skills</span></div>
          <div className="pf-skills" style={{ marginBottom: 10 }}>
            {(draft.skillTags || []).map((s, i) => (
              <span className="pf-skill-edit" key={i}>
                <input
                  value={s} placeholder="Skill"
                  onChange={(e) => setSkill(i, e.target.value)}
                  style={{ background: "transparent", border: "none", outline: "none", color: "inherit",
                           font: "inherit", width: `${Math.max(4, (s || "Skill").length)}ch` }} />
                <button className="pf-skill-x" type="button" aria-label="Remove skill" onClick={() => removeSkill(i)}>
                  <Icon name="x" size={10} />
                </button>
              </span>
            ))}
            <AddInline onClick={addSkill}>Add skill</AddInline>
          </div>
        </div>

        {/* socials */}
        <div className="pf-block">
          <div className="pf-block-head"><span className="pf-block-label"><Icon name="globe" size={12} /> Connect</span></div>
          <div className="pf-edit-stack">
            {SOCIAL.map(s => (
              draft[s.key] != null ? (
                <div className="pf-edit-field" key={s.key}>
                  <span className="pf-edit-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name={s.icon} size={12} /> {s.label}</span>
                    <button className="pf-editbtn pf-editbtn-danger pf-editbtn-icon" type="button" aria-label={`Remove ${s.label}`}
                            onClick={() => update(d => { d[s.key] = null; })}><Icon name="x" size={11} /></button>
                  </span>
                  <input className="pf-input pf-input-sm" placeholder={s.ph} value={draft[s.key]}
                         onChange={(e) => update(d => { d[s.key] = e.target.value; })} />
                </div>
              ) : (
                <AddInline key={s.key} onClick={() => update(d => { d[s.key] = ""; })}>Add {s.label}</AddInline>
              )
            ))}
          </div>
        </div>
      </div>
    </aside>
    {cropFile && (
      <ImageCropModal
        file={cropFile}
        onConfirm={onCropConfirm}
        onCancel={() => setCropFile(null)}
      />
    )}
    </>
  );
}

/* ── edit toolbar ────────────────────────────────────────────── */
export function EditToolbar({ dirty, onSave, onExit, saving }) {
  return (
    <div className="pf-editbar">
      <span className="pf-editbar-pulse" />
      <div className="pf-editbar-text">
        <div className="pf-editbar-title">Editing your profile</div>
        <div className="pf-editbar-sub">
          {saving
            ? <span className="dirty">Saving…</span>
            : dirty ? <span className="dirty">Unsaved changes</span> : "All changes saved"
          } · changes are private until you save
        </div>
      </div>
      <div className="pf-editbar-actions">
        <button className="cl-btn cl-btn-ghost cl-btn-sm" type="button" onClick={onExit} disabled={saving}
                style={saving ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
          <Icon name="logout" size={13} /> Exit
        </button>
        <button className="cl-btn cl-btn-primary cl-btn-sm" type="button" onClick={onSave}
                disabled={!dirty || saving}
                style={(!dirty || saving) ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
          {saving ? "Saving…" : <><Icon name="save" size={13} /> Save changes</>}
        </button>
      </div>
    </div>
  );
}

/* ── confirm dialog (exit with unsaved changes) ──────────────── */
export function ConfirmExitDialog({ onSave, onDiscard, onCancel }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onCancel]);
  return (
    <div className="pf-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="pf-dialog" role="dialog" aria-modal="true">
        <div className="pf-dialog-icon"><Icon name="warn" size={22} /></div>
        <div className="pf-dialog-title">Save your changes?</div>
        <div className="pf-dialog-body">
          You have unsaved edits to your profile. Do you want to save them before leaving edit mode, or discard them?
        </div>
        <div className="pf-dialog-actions">
          <button className="cl-btn cl-btn-subtle" type="button" onClick={onDiscard}>Discard</button>
          <button className="cl-btn cl-btn-primary" type="button" onClick={onSave}><Icon name="check" size={14} /> Save &amp; exit</button>
        </div>
        <button className="cl-btn cl-btn-ghost cl-btn-sm" type="button" onClick={onCancel}
                style={{ width: "100%", marginTop: 10 }}>Keep editing</button>
      </div>
    </div>
  );
}

/* ── toast ───────────────────────────────────────────────────── */
/* `surface` replaces the tinted 1px border each state used to carry — same
   signal, cast across the fill instead of drawn around it. Matches Toast.jsx. */
const TOAST_STYLES = {
  success: { tint: "var(--easy)",   ico: { bg: "rgba(110,231,183,0.2)", color: "var(--easy)"   }, icon: "check" },
  warning: { tint: "var(--medium)", ico: { bg: "rgba(252,211,77,0.2)",  color: "var(--medium)" }, icon: "warn"  },
  error:   { tint: "var(--hard)",   ico: { bg: "rgba(251,113,133,0.2)", color: "var(--hard)"   }, icon: "close" },
};
export function Toast({ message, type = "success" }) {
  const s = TOAST_STYLES[type] || TOAST_STYLES.success;
  return (
    <div className="pf-toast" style={{ background: `color-mix(in srgb, ${s.tint} 13%, var(--bg-4))` }}>
      <span className="pf-toast-ico" style={{ background: s.ico.bg, color: s.ico.color }}>
        <Icon name={s.icon} size={15} />
      </span>
      <span className="pf-toast-text">{message}</span>
    </div>
  );
}
