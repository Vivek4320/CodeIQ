import { Sparkles, Zap, GitBranch, Share2 } from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI code completion",
    desc: "Inline suggestions that adapt to your function, your variable names, and your intent — not generic boilerplate.",
  },
  {
    icon: Zap,
    title: "Instant execution",
    desc: "Run Python, JavaScript, C++, Java, Go, and Rust the moment you hit compile. No containers to wait on.",
  },
  {
    icon: GitBranch,
    title: "Auto-saved history",
    desc: "Every run is versioned automatically. Roll back to any point without thinking about it.",
  },
  {
    icon: Share2,
    title: "Shareable programs",
    desc: "Send a link that runs live for anyone who opens it — output included, not just source.",
  },
];

export default function Features() {
  return (
    <section id="features" className="border-t border-[#E3E6EC] bg-[#FAFBFC]">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <h2
          className="text-3xl font-semibold mb-3 tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Everything you need to write, run, and share code.
        </h2>
        <p className="text-[#5B6472] mb-12 max-w-lg">
          One editor, every language, and an assistant that&apos;s actually paying attention.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-[#E3E6EC] bg-white p-6 hover:border-[#1B3A6B]/30 hover:shadow-[0_8px_24px_-8px_rgba(15,20,32,0.08)] transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-[#EEF2F8] flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#1B3A6B]" />
              </div>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-[#5B6472] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}