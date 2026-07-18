"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "../admin.css";

function ResetPasswordInner() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendSent, setResendSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    // Detect expired/invalid link redirected here with error params
    const errorCode = params.get("error_code");
    const errorDesc = params.get("error_description");
    if (errorCode) {
      setLinkError(
        errorDesc
          ? decodeURIComponent(errorDesc).replace(/\+/g, " ")
          : "This link is invalid or has expired."
      );
      return;
    }

    // Wait for Supabase to establish the session from the URL hash
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setMsg("Passwords do not match."); return; }
    if (password.length < 8) { setMsg("Password must be at least 8 characters."); return; }
    setLoading(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setMsg(error.message);
    } else {
      router.push("/admin");
    }
  }

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!resendEmail) return;
    setResendLoading(true);
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(resendEmail, {
      redirectTo: `${window.location.origin}/admin/reset-password`
    });
    setResendLoading(false);
    setResendSent(true);
  }

  // Expired / invalid link state
  if (linkError) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="login-brand"><div className="login-brand-dot" /><strong>BTR Admin</strong></div>
          <h1>Link expired</h1>
          <div className="alert alert-error" style={{ marginBottom: 20 }}>{linkError}</div>
          {resendSent ? (
            <div className="alert alert-success">New reset link sent! Check your inbox.</div>
          ) : (
            <form onSubmit={handleResend}>
              <p style={{ marginBottom: 12, fontSize: 14, color: "var(--muted)" }}>Enter your email to get a fresh link:</p>
              <label>Email</label>
              <input
                type="email"
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
              <button type="submit" disabled={resendLoading} style={{ marginTop: 8 }}>
                {resendLoading ? "Sending…" : "Send new link"}
              </button>
            </form>
          )}
          <button
            className="btn-ghost"
            style={{ marginTop: 12, width: "100%", fontSize: 13 }}
            onClick={() => router.push("/admin/login")}
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="login-brand"><div className="login-brand-dot" /><strong>BTR Admin</strong></div>
          <p style={{ color: "var(--muted)", textAlign: "center", marginTop: 24 }}>
            Verifying reset link…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand"><div className="login-brand-dot" /><strong>BTR Admin</strong></div>
        <h1>Set new password</h1>
        <p>Choose a strong password for your account.</p>
        <form onSubmit={handleSubmit}>
          {msg && <div className="alert alert-error">{msg}</div>}
          <label>New password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters" required autoFocus />
          <label>Confirm password</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" required />
          <button type="submit" disabled={loading}>{loading ? "Updating…" : "Update password"}</button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
