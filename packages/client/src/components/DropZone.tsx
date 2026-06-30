import { useRef, useState, type DragEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { UploadCloud, FolderUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { gatherFilesFromDataTransfer } from '@/lib/files';
import { cn } from '@/lib/utils';

/**
 * Large drag-and-drop target supporting single files, multiple files, and whole
 * folders (via drop or the folder picker).
 */
export function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false);
  const reduce = useReducedMotion();
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const onDrop = async (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = await gatherFilesFromDataTransfer(e.dataTransfer);
    if (files.length) onFiles(files);
  };

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      animate={{ scale: dragging ? 1.015 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={cn(
        'relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-[var(--radius-card)] border border-dashed px-6 py-16 text-center transition-colors duration-300',
        dragging
          ? 'border-[var(--color-signal)] bg-[var(--color-signal)]/[0.06] shadow-[0_0_0_4px_rgba(47,107,255,0.10),0_20px_60px_-20px_rgba(47,107,255,0.45)]'
          : 'border-[var(--color-line-strong)] bg-white/40',
      )}
    >
      <div className="dotgrid pointer-events-none absolute inset-0 opacity-[0.5] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_42%,#000,transparent_80%)]" />

      {/* Icon with a soft pulsing glow + gentle float */}
      <div className="relative flex h-16 w-16 items-center justify-center">
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[var(--color-signal)] blur-xl"
          animate={
            dragging
              ? { opacity: 0.55, scale: 1.25 }
              : reduce
                ? { opacity: 0.24, scale: 1 }
                : { opacity: [0.18, 0.34, 0.18], scale: [1, 1.15, 1] }
          }
          transition={
            dragging || reduce
              ? { duration: 0.3 }
              : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
        />
        <motion.div
          className={cn(
            'relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-white shadow-sm transition-colors',
            dragging ? 'border-[var(--color-signal)]' : 'border-[var(--color-line-strong)]',
          )}
          animate={dragging || reduce ? { y: 0 } : { y: [0, -6, 0] }}
          transition={
            dragging || reduce
              ? { duration: 0.2 }
              : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <UploadCloud
            className={cn(
              'h-6 w-6 transition-colors',
              dragging ? 'text-[var(--color-signal)]' : 'text-[var(--color-ink-soft)]',
            )}
          />
        </motion.div>
      </div>

      <div className="relative space-y-1.5">
        <p className="font-display text-xl text-[var(--color-ink)]">
          {dragging ? 'Release to encrypt' : 'Drop files or folders'}
        </p>
        <p className="eyebrow text-[var(--color-ink-faint)]">
          encrypted before they leave your device
        </p>
      </div>
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => fileInput.current?.click()}>
          <UploadCloud className="h-4 w-4" /> Choose files
        </Button>
        <Button variant="secondary" onClick={() => folderInput.current?.click()}>
          <FolderUp className="h-4 w-4" /> Choose folder
        </Button>
      </div>

      <input
        ref={fileInput}
        type="file"
        multiple
        hidden
        onChange={(e) => e.target.files && onFiles(Array.from(e.target.files))}
      />
      <input
        ref={folderInput}
        type="file"
        hidden
        // @ts-expect-error non-standard but widely supported folder selection
        webkitdirectory=""
        directory=""
        multiple
        onChange={(e) => e.target.files && onFiles(Array.from(e.target.files))}
      />
    </motion.div>
  );
}
