import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import AppNavbar from "../Components/AppNavbar";
import Footer from "../Components/Footer";
import BackgroundWrapper from "../Components/BackgroundWrapper";
import Icon from "../Components/Icon";
import {
  CompletenessBanner, IdentityCard, MetricRow,
  ProgressCard, EarnedBadges, ListsCard, SubmissionsCard
} from "../Components/ProfileView";
import { EditIdentityCard, EditToolbar, ConfirmExitDialog, Toast } from "../Components/ProfileEdit";
import { clone, deepEqual, evaluateCompleteness, buildProgress, countBadges, sanitizeProfile, buildProfileUpdatePayload } from "../Components/profileUtils";
import { useUser } from "../context/UserContext";
import { useUserSubmissionStatus, useProblemCounts, useUserLists, useProfileByUsername, useUpdateProfileMutation } from "../services/queries";
import "../styles/profile.css";

/* Recent submissions are hardcoded until the backend ships the endpoint. */
const RECENT_SUBMISSIONS = [
  { id: 1,   title: "Two Sum",              lang: "Java", status: "AC",  diff: "easy", when: "2 hours ago" },
  { id: 217, title: "Contains Duplicate",   lang: "Java", status: "WA",  diff: "easy", when: "yesterday" },
  { id: 23,  title: "Merge k Sorted Lists", lang: "Java", status: "AC",  diff: "hard", when: "2 days ago" },
  { id: 42,  title: "Trapping Rain Water",  lang: "Java", status: "TLE", diff: "hard", when: "4 days ago" }
];

export default function ProfilePage() {
  const { username } = useParams();
  const { setUser } = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync: updateProfile } = useUpdateProfileMutation();

  const { data: profileData } = useProfileByUsername(username);
  const { data: submissionStats } = useUserSubmissionStatus();
  const { data: problemCounts } = useProblemCounts();
  const { data: lists } = useUserLists(username);

  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view");      // 'view' | 'edit'
  const [draft, setDraft] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (profileData) setProfile(clone(profileData)); }, [profileData]);

  const update = useCallback((mutator) => {
    setDraft(d => { const n = clone(d); mutator(n); return n; });
  }, []);

  // Keep all hooks above any early return to satisfy the rules of hooks
  const progress = useMemo(
    () => buildProgress(submissionStats || {}, problemCounts || {}),
    [submissionStats, problemCounts]
  );
  const completeness = useMemo(() => evaluateCompleteness(profile || {}), [profile]);

  if (!profile) {
    return (
      <BackgroundWrapper>
        <AppNavbar />
        <div className="pf-shell" style={{ minHeight: "50vh", display: "grid", placeItems: "center", color: "var(--text-mute)" }}>
          Loading profile…
        </div>
        <Footer />
      </BackgroundWrapper>
    );
  }

  const isOwner = !!profile.profileOwner;
  const dirty = mode === "edit" && draft && !deepEqual(draft, profile);
  const badgeCount = countBadges(profile.earnedBadges);
  const showBanner = mode === "view" && isOwner && completeness.showBanner && !bannerDismissed;

  const enterEdit = () => {
    const d = clone(profile);
    d.workExperience = (d.workExperience || []).map(e => ({
      companyName: e.company?.name || "",
      jobTitle:    e.jobTitle    || "",
      startYear:   e.startYear   || "",
      endYear:     e.endYear     || "",
    }));
    setDraft(d);
    setMode("edit");
  };

  const showToast = (msg, type = "success") => { setToast({ message: msg, type }); setTimeout(() => setToast(null), 2600); };

  const save = async () => {
    const clean = sanitizeProfile(draft);
    const { payload, locationWarning } = buildProfileUpdatePayload(profile, clean);

    if (locationWarning) {
      showToast("Location needs both city and country — fix or clear both to save.", "warning");
      return;
    }

    setSaving(true);
    try {
      if (Object.keys(payload).length > 0) await updateProfile(payload);
      await queryClient.refetchQueries(["profile", username]);
      setMode("view");
      setDraft(null);
      setConfirmOpen(false);
      setBannerDismissed(false);
      showToast("Profile updated successfully");
    } catch (err) {
      const raw = err?.response?.data;
      const msg = (typeof raw === "string" ? raw : raw?.message) || "Failed to save profile changes.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const requestExit = () => { if (saving) return; if (dirty) setConfirmOpen(true); else { setMode("view"); setDraft(null); } };
  const discardExit = () => { setMode("view"); setDraft(null); setConfirmOpen(false); };

  return (
    <BackgroundWrapper>
      <AppNavbar />

      <div className="pf-shell">
        {showBanner && (
          <CompletenessBanner stats={completeness} onAction={enterEdit} onDismiss={() => setBannerDismissed(true)} />
        )}

        {mode === "edit" && <EditToolbar dirty={dirty} onSave={save} onExit={requestExit} saving={saving} />}

        <div className="pf-grid" style={saving ? { pointerEvents: "none", opacity: 0.6 } : undefined}>
          {mode === "edit"
            ? <EditIdentityCard draft={draft} update={update} />
            : <IdentityCard p={profile} />}

          <div className="pf-rcol">
            {mode === "view" && isOwner && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="cl-btn cl-btn-cyan cl-btn-sm" type="button" onClick={enterEdit}>
                  <Icon name="edit" size={13} /> Edit profile
                </button>
              </div>
            )}

            <MetricRow p={profile} solved={progress.solved} total={progress.total}
                       listCount={(lists || []).length} badgeCount={badgeCount} />
            <ProgressCard rows={progress.rows} solved={progress.solved} total={progress.total} langs={progress.langs} />
            <EarnedBadges groups={profile.earnedBadges} totalEarned={badgeCount} />
            <ListsCard lists={lists || []} />
            <SubmissionsCard rows={RECENT_SUBMISSIONS} />
          </div>
        </div>
      </div>

      {confirmOpen && <ConfirmExitDialog onSave={save} onDiscard={discardExit} onCancel={() => setConfirmOpen(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <Footer />
    </BackgroundWrapper>
  );
}
