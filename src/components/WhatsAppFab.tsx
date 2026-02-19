import React, { useMemo } from "react";

export default function WhatsAppFab({ phone10 }: { phone10?: string }) {
<<<<<<< HEAD
  const businessNumber = "919999999999"; // TODO: replace with your number (91 + 10 digits)
=======
  const businessNumber = "917498369191"; // your number (91 + 10 digits)
>>>>>>> aecf813064853b7cecc2de82b03b31aed1fd97db
  const waNumber = useMemo(() => {
    const cleaned = (phone10 ?? "").replace(/\D+/g, "");
    if (cleaned.length === 10) return "91" + cleaned;
    return businessNumber;
  }, [phone10]);

  const href = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    "Hi! I'm looking for a rental home in Mumbai. Please share options."
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] shadow-[0_18px_60px_rgba(37,211,102,0.45)] ring-1 ring-white/20 transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(37,211,102,0.55)] active:translate-y-0 active:scale-[0.99]"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      {/* chat bubble icon */}
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
        <path
          d="M20 11.5c0 4.142-3.582 7.5-8 7.5a9.3 9.3 0 0 1-3.01-.5L4 20l1.08-3.2A7.02 7.02 0 0 1 4 11.5C4 7.358 7.582 4 12 4s8 3.358 8 7.5Z"
          fill="white"
          opacity="0.95"
        />
        <path
          d="M9.6 10.2c.2-.5.4-.5.6-.5h.5c.1 0 .3.05.4.25l.8 1.6c.1.2.1.35 0 .55l-.25.45c-.1.15-.2.25-.05.5.15.25.65 1.2 1.55 1.85.75.55 1.4.75 1.65.85.25.1.4.05.55-.1l.55-.65c.2-.2.35-.2.55-.1l1.45.7c.25.1.4.2.45.35.05.15.05.95-.35 1.45-.4.5-1.2 1-2.65.65-1.45-.35-2.85-1.2-3.95-2.2-1.05-1-1.95-2.35-2.2-3.4-.25-1.05.2-1.9.55-2.25.15-.15.35-.3.5-.3Z"
          fill="#25D366"
        />
      </svg>
    </a>
  );
}
