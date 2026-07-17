"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "../admin.css";

type Mode = "login" | "forgot" | "forgot-sent";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`
    });
    setLoading(false);
    if (error) {
      setMsg(error.message);
    } else {
      setMode("forgot-sent");
    }
  }

  if (mode === "forgot-sent") {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-dot" />
            <strong>BTR Admin</strong>
          </div>
          <h1>Check your email</h1>
          <p>We sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.</p>
          <button
            style={{ marginTop: 24, width: "100%" }}
            onClick={() => { setMode("login"); setMsg(""); }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (mode === "forgot") {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="login-brand">
            <div className="login-brand-dot" />
            <strong>BTR Admin</strong>
          </div>
          <h1>Reset password</h1>
          <p>Enter your email and we&apos;ll send you a reset link.</p>
          <form onSubmit={handleForgot}>
            {msg && <div className="alert alert-error">{msg}</div>}
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <button
            className="btn-ghost"
            style={{ marginTop: 12, width: "100%", fontSize: 13 }}
            onClick={() => { setMode("login"); setMsg(""); }}
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-dot" />
          <strong>BTR Admin</strong>
        </div>
        <h1>Sign in</h1>
        <p>Behind the Reels content management</p>
        <form onSubmit={handleLogin}>
          {msg && <div className="alert alert-error">{msg}</div>}
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <button
          className="btn-ghost"
          style={{ marginTop: 12, width: "100%", fontSize: 13 }}
          onClick={() => { setMode("forgot"); setMsg(""); }}
        >
          Forgot password?
        </button>
      </div>
    </div>
  );
}
