"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactDropdown({
  storePhone,
  whatsappPhone,
}: {
  storePhone?: string;
  whatsappPhone?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`flex items-center gap-1.5 rounded-lg px-1.5 py-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 md:px-3 md:py-2 ${
          open ? "bg-neutral-100" : ""
        }`}
      >
        <svg className="h-4.5 w-4.5 text-neutral-900 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span className="hidden sm:inline">Contact</span>
        <svg
          className={`hidden h-3.5 w-3.5 text-neutral-500 transition-transform sm:inline ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 animate-fadeIn"
        >
          <div className="border-b border-neutral-100 px-4 pb-2 pt-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Get in touch
            </p>
          </div>

          {/* Call */}
          <a
            href={`tel:${storePhone?.replace(/\D/g, "")}`}
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-900">Call us</p>
              <p className="truncate text-xs text-neutral-500">{storePhone}</p>
            </div>
          </a>

          {/* WhatsApp */}
          {whatsappPhone && (
            <a
              href={`https://wa.me/${whatsappPhone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 border-t border-neutral-100 px-4 py-3 transition-colors hover:bg-neutral-50"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-green-50 text-green-600">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.35 5.01L2 22l5.09-1.34A9.96 9.96 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.58 0-3.05-.46-4.3-1.26l-.31-.19-3.06.8.82-2.83-.21-.33A8.02 8.02 0 014 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-900">WhatsApp</p>
                <p className="truncate text-xs text-neutral-500">Message us</p>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
