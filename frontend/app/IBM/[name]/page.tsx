"use client";

import { use, useState, useEffect, useRef, type FormEvent } from "react";
import type { PageVideo } from "@/lib/videos";
import { EnvelopeGate } from "@/components/ibm/envelope-gate";
import { IbmHeader } from "@/components/ibm/ibm-header";

// ─── Per-person letter data ────────────────────────────────────────────────────
// `body` supports multiple paragraphs separated by "\n\n".
// `assets` is a list of public-folder image paths for the gallery.
// `extras` is an open slot for anything you want to add later per person.
const letterData: Record<string, {
  greeting: string;          // e.g. "Dear Bushra,"
  body: string;              // multi-paragraph letter text
  signature: string;         // sign-off line
  videoId?: string;          // Redis key segment: video:ibm-<videoId>:en (optional)
  assets: string[];          // /public image paths
  extras?: React.ReactNode;  // future slot — leave undefined for now
}> = {
  Bushra: {
    greeting: "Dear Bushra,",
    body: `Working alongside you this year has been one of the highlights of my internship. Your sharp instincts and calm under pressure are qualities I genuinely admire.\n\nEvery sprint planning, every late-night debug session, every random hallway chat — they all added up to something I'll carry with me long after this internship ends.\n\nThank you for being exactly who you are.`,
    signature: "With appreciation, Fermi",
    assets: [],
  },
  Eknoor: {
    greeting: "Dear Eknoor,",
    body: `You have a rare gift for making complex things feel simple — watching you break down a gnarly data pipeline problem is something I always learned from.\n\nI'm grateful for every knowledge-share, every patient explanation, and every time you pushed me to think more carefully.\n\nThis one's for you.`,
    signature: "Warmly, Fermi",
    assets: [],
  },
  Kamran: {
    greeting: "Dear Kamran,",
    body: `You made the whole team better just by showing up. Your energy is contagious and your code reviews are the most useful feedback I've ever received.\n\nI won't forget the moment you casually fixed a bug that had stumped us for two days. Legendary.\n\nCheers to you, friend.`,
    signature: "With gratitude, Fermi",
    assets: [],
  },
  Kunal: {
    greeting: "Dear Kunal,",
    body: `Your dedication to getting things right — not just done, but right — set the bar for everyone around you. I learned more from watching how you work than from any tutorial.\n\nThanks for always having the team's back. You're the kind of colleague people are lucky to find once.`,
    signature: "Best, Fermi",
    assets: [],
  },
  Anmol: {
    greeting: "Dear Anmol,",
    body: `From the first week you made me feel like I belonged on this team. Your openness and your technical depth are a rare combination.\n\nEvery API we built together, every architecture decision we debated — I treasure all of it.\n\nKeep building cool things.`,
    signature: "With respect, Fermi",
    assets: [],
  },
  Christophe: {
    greeting: "Dear Christophe,",
    body: `You see things most engineers miss — the tiny interaction, the off-by-one pixel, the tooltip nobody else noticed. Working with you raised my attention to detail permanently.\n\nI hope one day I'm half as deliberate about craft as you are.\n\nThank you for everything.`,
    signature: "Gratefully, Fermi",
    assets: [],
  },
  Ricky: {
    greeting: "Dear Ricky,",
    body: `Your calm confidence in the middle of an infrastructure fire is something I genuinely aspire to. You made the scary parts of cloud feel approachable.\n\nI learned so much just by being in the same room as you during incident reviews.\n\nHere's to many more deployments that go smoothly.`,
    signature: "With admiration, Fermi",
    assets: [],
  },
  Jay: {
    greeting: "Dear Jay,",
    body: `You never let anything slip past you. Every security concern you raised was another lesson in thinking like an adversary — a mindset I'll carry into every project going forward.\n\nThank you for caring enough to ask the hard questions.`,
    signature: "With gratitude, Fermi",
    assets: [],
  },
  Daniel: {
    greeting: "Dear Daniel,",
    body: `You have a talent for translating between worlds — between what users need and what engineers can build, between vision and reality. That's genuinely rare.\n\nEvery roadmap session you led left me feeling clearer. Thank you for keeping us pointed in the right direction.`,
    signature: "Best, Fermi",
    assets: [],
  },
  Patrick: {
    greeting: "Dear Patrick,",
    body: `You reminded me that good design is fundamentally about empathy. Every mockup you shared made me think about the person on the other side of the screen.\n\nThank you for bringing beauty and intention to everything the team touched.`,
    signature: "Warmly, Fermi",
    assets: [],
  },
  Alvin: {
    greeting: "Dear Alvin,",
    body: `Watching you context-switch between platforms without missing a beat was inspiring. You made mobile feel like a superpower, not a constraint.\n\nI'm grateful for every conversation we had about UX trade-offs and for your generosity in sharing what you knew.`,
    signature: "With respect, Fermi",
    assets: [],
  },
  Wener: {
    greeting: "Dear Wener,",
    body: `The depth of thinking you brought to every AI problem was something else. You asked the questions nobody else thought to ask and then actually went and answered them.\n\nThank you for expanding what I thought was possible. I'll be watching your career from a distance with great admiration.`,
    signature: "Gratefully, Fermi",
    assets: [],
  },
  Fermi: {
    greeting: "Dear Fermi,",
    body: `You did it. A full year at IBM, a team you love, and a product you're proud of.\n\nDon't forget how much this meant. Don't forget the people. Don't forget the late nights that turned into something real.\n\nKeep going.`,
    signature: "— Yourself",
    assets: [],
  },
};

// ─── Change Password Panel ────────────────────────────────────────────────────
function ChangePasswordPanel({ name }: { name: string }) {
  const [hasCustom,   setHasCustom]   = useState(false);
  const [newPw,       setNewPw]       = useState("");
  const [confirmPw,   setConfirmPw]   = useState("");
  const [showNewPw,   setShowNewPw]   = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState("");
  const [saving,      setSaving]      = useState(false);

  useEffect(() => {
    fetch(`/api/ibm/password?name=${name}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { customPassword: string | null }) => setHasCustom(!!data.customPassword))
      .catch(() => {});
  }, [name]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (newPw.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (newPw !== confirmPw) { setError("Passwords don't match."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/ibm/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: newPw }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      if (data.ok) {
        setHasCustom(true); setSuccess(true);
        setNewPw(""); setConfirmPw("");
        setTimeout(() => setSuccess(false), 3000);
      } else { setError(data.error ?? "Something went wrong."); }
    } catch { setError("Network error — please try again."); }
    finally { setSaving(false); }
  }

  async function handleClear() {
    setSaving(true);
    try {
      await fetch("/api/ibm/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: null }),
      });
      setHasCustom(false);
    } catch { setError("Network error — please try again."); }
    finally { setSaving(false); }
  }

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  function PasswordInput({ id, label, value, show, onToggle, onChange, placeholder }: {
    id: string; label: string; value: string; show: boolean;
    onToggle: () => void; onChange: (v: string) => void; placeholder: string;
  }) {
    return (
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground" htmlFor={id}>{label}</label>
        <div className="relative">
          <input
            id={id} type={show ? "text" : "password"} value={value}
            onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 pr-11 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30 transition"
          />
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={show ? "Hide" : "Show"}>
            {show ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="letter-section mt-6 border-t border-dashed border-border/60 pt-8">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Password Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {hasCustom
              ? "You have a custom password set. Either your default or custom password works for login."
              : "Set a custom password — both will work alongside your default one."}
          </p>
        </div>
        {hasCustom && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1 text-xs font-medium text-green-600">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Custom set
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <PasswordInput id="new-pw" label="New password" value={newPw} show={showNewPw}
          onToggle={() => setShowNewPw(v => !v)} onChange={setNewPw} placeholder="Min. 4 characters" />
        <PasswordInput id="confirm-pw" label="Confirm new password" value={confirmPw} show={showConfirm}
          onToggle={() => setShowConfirm(v => !v)} onChange={setConfirmPw} placeholder="Repeat password" />
        {error   && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-600">Saved — both passwords now work.</p>}
        <div className="flex items-center gap-3 pt-1">
          <button type="submit" disabled={saving}
            className="rounded-lg bg-foreground text-background font-semibold px-5 py-2.5 hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-50 text-sm">
            {saving ? "Saving…" : hasCustom ? "Update password" : "Set custom password"}
          </button>
          {hasCustom && (
            <button type="button" disabled={saving} onClick={handleClear}
              className="rounded-lg border border-border px-5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all duration-150 disabled:opacity-50">
              Remove custom password
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

// ─── Letter Page ───────────────────────────────────────────────────────────────
export default function PersonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const letter = letterData[name] ?? {
    greeting: `Dear ${name},`,
    body: `This page was made just for you. More coming soon.`,
    signature: "— Fermi",
    assets: [],
  };

  // Fetch video config from the API route (keeps this client component clean)
  const [video, setVideo] = useState<PageVideo | null>(null);
  useEffect(() => {
    fetch(`/api/video?page=ibm-${name.toLowerCase()}&locale=en`)
      .then((r) => r.json())
      .then((d) => setVideo(d?.video ?? null))
      .catch(() => {});
  }, [name]);

  // Refs for smooth-scroll navigation
  const letterRef  = useRef<HTMLDivElement>(null);
  const videoRef   = useRef<HTMLDivElement>(null);
  const assetsRef  = useRef<HTMLDivElement>(null);

  function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const paragraphs = letter.body.split("\n\n").filter(Boolean);

  return (
    <EnvelopeGate personName={name}>
    <div className="min-h-screen bg-background">
      <IbmHeader showLogout />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-16 space-y-24">

        {/* ══ SECTION 1 — LETTER ════════════════════════════════════════════ */}
        <section ref={letterRef} className="animate-fade-in-up">
          {/* Paper envelope decoration
          <div className="mb-10 flex items-center gap-3 text-muted-foreground">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs uppercase tracking-widest font-medium">Personal · IBM Internship 2025–2026</span>
          </div> */}

          {/* The letter itself — paper-card aesthetic */}
          <div className="relative rounded-2xl border border-border bg-card shadow-sm px-8 py-10 md:px-12 md:py-14 letter-paper">

            {/* Decorative left border rule */}
            <div className="absolute left-0 top-8 bottom-8 w-0.5 rounded-full bg-gradient-to-b from-transparent via-border to-transparent" />

            {/* Date + from */}
            <div className="flex items-start justify-between mb-8 text-sm text-muted-foreground">
              <span>IBM Canada · Bob Team</span>
              <span>Internship 2025–2026</span>
            </div>

            {/* Greeting */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 leading-snug">
              {letter.greeting}
            </h1>

            {/* Body */}
            <div className="space-y-5 text-lg leading-relaxed text-foreground/80">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Signature */}
            <div className="mt-12 pt-8 border-t border-border/60">
              <p className="text-muted-foreground text-sm mb-3">With warmth,</p>
              <p className="text-xl font-semibold text-foreground italic">{letter.signature}</p>
              {/* Fermi's avatar/initial mark */}
              <div className="mt-4 w-10 h-10 rounded-full bg-gradient-to-br from-foreground/80 to-foreground/50 flex items-center justify-center text-background text-sm font-bold shadow">
                F
              </div>
            </div>
          </div>
        </section>

        {/* ══ SECTION 2 — VIDEO ════════════════════════════════════════════ */}
        <section ref={videoRef} className="animate-fade-in-up animation-delay-200">
          <SectionHeading icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.677v6.646a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
            </svg>
          } title="A message in video" />

          {video ? (
            <VideoBlock video={video} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.677v6.646a1 1 0 01-1.447.894L15 14M4 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
              </svg>
              <p className="text-sm">Video coming soon</p>
            </div>
          )}
        </section>

        {/* ══ SECTION 3 — ASSETS ══════════════════════════════════════════ */}
        <section ref={assetsRef} className="animate-fade-in-up animation-delay-400">
          <SectionHeading icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          } title="Memories & assets" />

          {/* Photo gallery */}
          {letter.assets.length > 0 ? (
            <PhotoGallery images={letter.assets} name={name} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
              <svg className="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Photos coming soon</p>
            </div>
          )}

          {/* Extras slot — add anything here per-person via letterData[name].extras */}
          {letter.extras && (
            <div className="mt-8">
              {letter.extras}
            </div>
          )}
        </section>

        {/* ── Settings / Password ──────────────────────────────────────── */}
        <div className="pb-12">
          <ChangePasswordPanel name={name} />
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 text-center py-10 text-muted-foreground text-xs tracking-wide">
        Made with Love by Fermi · IBM Internship 2025–2026
      </footer>
    </div>
    </EnvelopeGate>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="text-muted-foreground">{icon}</div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
}

function VideoBlock({ video }: { video: PageVideo }) {
  if (video.provider === "mux" && video.playbackId) {
    // TODO: replace with <MuxPlayer> once @mux/mux-player-react is installed
    return (
      <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
        <video className="w-full" controls preload="metadata" playsInline poster={video.poster} aria-label={video.title}>
          <source src={`https://stream.mux.com/${video.playbackId}.m3u8`} type="application/x-mpegURL" />
          Your browser does not support the video tag.
        </video>
        {video.title && <p className="px-4 py-2 text-sm text-white/50 bg-black/90">{video.title}</p>}
      </div>
    );
  }

  if (video.provider === "cloudflare" && video.playbackId) {
    return (
      <div className="rounded-2xl overflow-hidden shadow-lg aspect-video">
        <iframe
          src={`https://customer-${video.playbackId}.cloudflarestream.com/iframe`}
          className="w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen title={video.title}
        />
      </div>
    );
  }

  if (video.url) {
    return (
      <div className="rounded-2xl overflow-hidden bg-black shadow-lg">
        <video className="w-full" controls preload="metadata" playsInline poster={video.poster} aria-label={video.title}>
          <source src={video.url} />
          Your browser does not support the video tag.
        </video>
        {video.title && <p className="px-4 py-2 text-sm text-white/50 bg-black/90">{video.title}</p>}
      </div>
    );
  }

  return null;
}

function PhotoGallery({ images, name }: { images: string[]; name: string }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setLightbox(src)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-foreground/30"
            style={{ animationDelay: `${i * 0.07}s` }}
            aria-label={`Photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${name} memory ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            aria-label="Close">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Full size" className="max-w-full max-h-full rounded-xl shadow-2xl object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

// Made with Bob
