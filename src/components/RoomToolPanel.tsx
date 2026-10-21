import React, { useEffect, useRef } from 'react';

export function RoomToolPanel({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <dialog ref={ref} className="room-panel" aria-label={title} onCancel={onClose} onClose={onClose}
    onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); } }}>
    <div className="room-panel-heading"><h2>{title}</h2><button onClick={onClose} aria-label={`Close ${title}`}>Close ×</button></div>{children}
  </dialog>;
}
