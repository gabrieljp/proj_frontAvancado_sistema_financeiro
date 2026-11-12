import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

export function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
    users: (
      <>
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21v-3a7 7 0 0 1 14 0v3M17 4a4 4 0 0 1 0 8M22 21v-3a7 7 0 0 0-4-6" />
      </>
    ),
    tag: (
      <>
        <path d="M3 3h8l10 10-8 8L3 11Z" />
        <circle cx="7.5" cy="7.5" r=".5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    up: <path d="M7 17 17 7M7 7h10v10" />,
    down: <path d="m7 7 10 10M7 17h10V7" />,
    wallet: (
      <path d="M20 8V5H4a2 2 0 0 0 0 4h17v11H4a2 2 0 0 1-2-2V7M21 12h-6v5h6" />
    ),
    exit: <path d="M9 3H3v18h6M9 12h12m-5-5 5 5-5 5" />,
    download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" />,
  };
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.list}
    </svg>
  );
}
export function Brand() {
  return (
    <div className="brand">
      <span className="brand-symbol">f</span> financeiro
      <span className="brand-dot">.</span>
    </div>
  );
}
export function Field({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "field wide" : "field"}>
      <span>{label}</span>
      {children}
    </label>
  );
}
export function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      aria-labelledby="modal-title"
    >
      <header className="modal-head">
        <h2 id="modal-title">{title}</h2>
        <button className="icon-button" onClick={close} aria-label="Fechar">
          ×
        </button>
      </header>
      {children}
    </dialog>
  );
}
