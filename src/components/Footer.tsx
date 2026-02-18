import React from "react";
import Reveal from "./Reveal";

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.51a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.57-1.09a2 2 0 0 1 2.11-.45c.81.26 1.65.45 2.51.57A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16v16H4z" opacity="0" />
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" />
      <path d="M12 11.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4Z" />
    </svg>
  );
}

function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#070814] text-white">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.22),transparent_60%)]" />
        <div className="absolute -right-40 -bottom-52 h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-black/20" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <Reveal>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <div className="text-2xl font-semibold tracking-tight">MumbaiRentals</div>
              <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">
                Premium rental solutions in Mumbai’s Western Suburbs.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <div className="text-sm font-semibold text-white">Quick Links</div>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <a className="transition hover:text-white" href="/">
                    Home
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-white" href="/#how">
                    How It Works
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-white" href="/#lead">
                    Find a Home
                  </a>
                </li>
                <li>
                  <a className="transition hover:text-white" href="/#faq">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div className="text-sm font-semibold text-white">Contact</div>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-3">
                  <IconPhone className="h-4 w-4 text-white/60" />
                  <a className="hover:text-white" href="tel:+919876543210">
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <IconMail className="h-4 w-4 text-white/60" />
                  <a className="hover:text-white" href="mailto:hello@mumbairentals.com">
                    hello@mumbairentals.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <IconPin className="h-4 w-4 text-white/60" />
                  <span>Malad West, Mumbai - 400064</span>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <div className="text-sm font-semibold text-white">Follow Us</div>
              <div className="mt-4 flex items-center gap-3">
                <SocialIcon label="Instagram" href="#">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="4" />
                    <path d="M16 11.999a4 4 0 1 1-7.999.001A4 4 0 0 1 16 12Z" />
                    <path d="M17.5 6.5h.01" />
                  </svg>
                </SocialIcon>
                <SocialIcon label="Facebook" href="#">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v3H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1Z" />
                  </svg>
                </SocialIcon>
                <SocialIcon label="X" href="#">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l16 16" />
                    <path d="M20 4 4 20" />
                  </svg>
                </SocialIcon>
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="mt-12 h-px w-full bg-white/10" />

          <div className="py-8 text-center text-xs text-white/50">
            © {new Date().getFullYear()} MumbaiRentals. All rights reserved.
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
