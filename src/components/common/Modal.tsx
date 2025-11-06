"use client";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

export default function Modal({ open, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      }  inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm`}
    >
      {children}
    </div>
  );
}
