import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQueryClient } from "react-query";
import { useParams, Link } from "react-router-dom";
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
import { useUserSubmissionStatus, useProblemCounts, useUserLists, useProfileByUsername, useUpdateProfileMutation, useUploadProfilePicMutation } from "../services/queries";
import "../styles/profile.css";

export default function ProfilePage() {
  const { username } = useParams();
  const { setUser } = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync: updateProfile } = useUpdateProfileMutation();
  const { mutateAsync: uploadPic } = useUploadProfilePicMutation();
  const selectedFileRef = useRef(null);

  // isError was being destructured away, so a username that doesn't exist left
  // profileData undefined forever and the "Loading profile…" branch below never
  // exited — a permanent spinner rather than a slow error.
  const { data: profileData, isError: profileError, error: profileErr } = useProfileByUsername(username);
  const { data: submissionStats } = useUserSubmissionStatus();
  const { data: problemCounts } = useProblemCounts();
  const { data: lists } = useUserLists(username);

  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view");      // 'view' | 'edit'
  const [draft, setDraft] = useState(null);
  const [baseline, setBaseline] = useState(null);
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

  if (profileError) {
    const notFound = profileErr?.response?.status === 404;
    return (
      <BackgroundWrapper>
        <AppNavbar />
        <div className="pf-shell" style={{ flex: 1, display: "grid", placeItems: "center", textAlign: "center", padding: "60px 20px" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, letterSpacing: "-0.015em", marginBottom: 8 }}>
              {notFound ? "No profile for that username." : "We couldn't load this profile."}
            </div>
            <p className="cl-text-dim" style={{ fontSize: 14, lineHeight: 1.55, margin: "0 auto 24px", maxWidth: "46ch" }}>
              {notFound
                ? <>Nobody here goes by <span style={{ color: "var(--text)" }}>@{username}</span>. The name may have changed, or the link may have a typo.</>
                : "That's a problem on our end, not something you did."}
            </p>
            <Link to="/arena/problemset" className="cl-btn cl-btn-primary">
              Go to the arena <Icon name="arrowRight" size={13} />
            </Link>
          </div>
        </div>
        <Footer />
      </BackgroundWrapper>
    );
  }

  if (!profile) {
    return (
      <BackgroundWrapper>
        <AppNavbar />
        <div className="pf-shell" style={{ flex: 1, display: "grid", placeItems: "center", color: "var(--text-mute)" }}>
          Loading profile…
        </div>
        <Footer />
      </BackgroundWrapper>
    );
  }

  const isOwner = !!profile.profileOwner;
  const dirty = mode === "edit" && draft && baseline && !deepEqual(draft, baseline);
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
    setBaseline(clone(d));
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

    const hasProfileChanges = Object.keys(payload).length > 0;
    const file = selectedFileRef.current;

    if (!hasProfileChanges && !file) {
      setMode("view");
      setDraft(null);
      return;
    }

    setSaving(true);

    const tasks = [];
    if (hasProfileChanges) tasks.push(updateProfile(payload));
    if (file) tasks.push(uploadPic(file));

    const results = await Promise.allSettled(tasks);

    const profileResult = hasProfileChanges ? results[0] : null;
    const picResult     = file ? results[hasProfileChanges ? 1 : 0] : null;

    const profileOk = !profileResult || profileResult.status === "fulfilled";
    const picOk     = !picResult    || picResult.status    === "fulfilled";

    const shouldRefetch = profileOk || picOk;
    if (shouldRefetch) {
      await queryClient.refetchQueries(["profile", username]);
      const fresh = queryClient.getQueryData(["profile", username]);
      if (fresh?.profilePictureUrl) {
        setUser(u => ({ ...u, profilePictureUrl: fresh.profilePictureUrl }));
      }
    }

    if (profileOk) {
      selectedFileRef.current = null;
      setMode("view");
      setDraft(null);
      setBaseline(null);
      setConfirmOpen(false);
      setBannerDismissed(false);
    }

    if (profileOk && picOk) {
      showToast("Profile updated successfully");
    } else if (profileOk && !picOk) {
      const raw = picResult.reason?.response?.data;
      const msg = (typeof raw === "string" ? raw : raw?.message) || "Your details were saved, but the photo didn't upload. Try the photo again.";
      showToast(msg, "warning");
    } else if (!profileOk && picOk) {
      const raw = profileResult.reason?.response?.data;
      const msg = (typeof raw === "string" ? raw : raw?.message) || "We couldn't save your changes. Try again.";
      showToast(msg, "error");
    } else {
      const raw = profileResult?.reason?.response?.data;
      const msg = (typeof raw === "string" ? raw : raw?.message) || "We couldn't save your changes. Try again.";
      showToast(msg, "error");
    }

    setSaving(false);
  };

  const requestExit = () => { if (saving) return; if (dirty) setConfirmOpen(true); else { selectedFileRef.current = null; setMode("view"); setDraft(null); setBaseline(null); } };
  const discardExit = () => { selectedFileRef.current = null; setMode("view"); setDraft(null); setBaseline(null); setConfirmOpen(false); };

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
            ? <EditIdentityCard draft={draft} update={update} onFileSelect={(f) => { selectedFileRef.current = f; }} />
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
            <EarnedBadges groups={profile.earnedBadges} totalEarned={badgeCount} isOwner={isOwner} />
            <ListsCard lists={lists || []} />
            <SubmissionsCard username={username} isOwner={isOwner} />
          </div>
        </div>
      </div>

      {confirmOpen && <ConfirmExitDialog onSave={save} onDiscard={discardExit} onCancel={() => setConfirmOpen(false)} />}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <Footer />
    </BackgroundWrapper>
  );
}
