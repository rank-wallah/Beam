import { useRef, useState, type DragEvent } from 'react';
import { motion } from 'framer-motion';
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        'relative flex flex-col items-center justify-center gap-5 rounded-[var(--radius-card)] border border-dashed px-6 py-16 text-center transition-colors',
        dragging
          ? 'border-[var(--color-accent)] bg-[rgba(99,102,241,0.06)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)]',
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] ring-1 ring-[var(--color-border)]">
        <UploadCloud className="h-7 w-7 text-[var(--color-accent-2)]" />
      </div>
      <div className="space-y-1.5">
        <p className="text-lg font-medium text-[var(--color-ink)]">
          Drop files or folders to send
        </p>
        <p className="text-sm text-[var(--color-ink-subtle)]">
          They're encrypted in your browser before they leave your device.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
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
