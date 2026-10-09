import React from 'react';
import Button from './Button';

export default function Modal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
  confirmVariant = 'primary',
  children,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#161B22] border border-[#8B98A9]/50 w-full max-w-md p-5 rounded-[3px] hard-shadow reg-mark-card relative space-y-4">
        <div>
          <span className="font-mono-data text-[10px] tracking-widest text-[#FF5A1F] uppercase font-bold block mb-1">
            CONFIRMATION PROTOCOL
          </span>
          <h3 className="font-heading text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-[#8B98A9] mt-1.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {children && <div className="text-xs text-[#E2E8F0]">{children}</div>}

        <div className="flex justify-end items-center gap-2.5 pt-3 border-t border-[#8B98A9]/20">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
