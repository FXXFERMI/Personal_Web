"use client";

import { useState, type FormEvent } from "react";
import { IbmHeader } from "@/components/ibm/ibm-header";

export default function IBMPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/ibm/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json() as { ok: boolean; name?: string; error?: string };

      if (data.ok && data.name) {
        // Hard navigation — forces a full HTTP request so the proxy
        // can verify the session cookie before serving the page.
        window.location.href = `/IBM/${data.name}`;
        return;
      }
      setError(data.error ?? "Invalid username or password.");
    } catch {
      setError("Network error — please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <IbmHeader />

      {/* Hero — full-viewport video section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {/* YouTube iframe */}
        <iframe
          className="absolute inset-0 w-full h-full pointer-events-none"
          src="https://player.mux.com/7GUYja5400Z7qALxC286dRklTeDcOVpOBaTdS8fbimX00?metadata-video-title=IBM+Landing+Placeholder&video-title=IBM+Landing+Placeholder&autoplay=true&muted=true&loop=true"
          title="IBM Team Video"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          style={{ border: "none" }}
        />

        {/* Hero text */}
        <div className="relative z-20 text-center px-4 animate-fade-in-up translate-y-10">
          <p className="text-white/70 uppercase tracking-[0.3em] text-sm font-medium mb-4">
            IBM Canada — Bob Team
          </p>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            For the Team
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-10">
            A small thank-you for an unforgettable internship.
          </p>
          {/* Scroll hint */}
          <div className="flex flex-col items-center gap-2 text-white/50 animate-bounce">
            <span className="text-sm tracking-widest uppercase">Scroll</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* Login section */}
      <section className="flex flex-col items-center justify-center px-4 py-24">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Open Your Letter</h2>
            {/* <p className="text-muted-foreground mt-3">Sign in with the infor on the card Fermi gave you.</p> */}
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-card border border-border rounded-2xl p-8 space-y-5"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. Fermi"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    // Eye icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    // Eye-off icon
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-foreground text-background font-semibold py-2.5 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </section>

      {/* Footer note */}
      <footer className="text-center pb-12 text-muted-foreground text-sm">
        Made with Love by Fermi · IBM Internship 2025 – 2026
      </footer>

    </div>
  );
}

// Made with Bob
