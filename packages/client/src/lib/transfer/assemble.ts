/**
 * Reassemble received chunks into downloadable files.
 *
 * Runs once at the end of a transfer. For each file in the manifest, its chunks
 * are streamed back out of IndexedDB in byte order into a Blob, and an object
 * URL is produced for download. Only one file is materialised at a time; the
 * browser disk-backs large Blobs, so peak memory stays modest.
 *
 * (A future enhancement streams directly to disk via the File System Access
 * API during receipt, avoiding the final Blob entirely on Chromium browsers.)
 */
import type { ManifestMessage } from '@beam/shared';
import type { ResumeStore } from './resumeStore.js';
import type { CompletedFile } from './types.js';

export async function assembleFiles(
  store: ResumeStore,
  manifest: ManifestMessage,
): Promise<CompletedFile[]> {
  const out: CompletedFile[] = [];

  for (let fileIndex = 0; fileIndex < manifest.files.length; fileIndex++) {
    const descriptor = manifest.files[fileIndex]!;
    const chunks = await store.getChunksForFile(manifest.transferId, fileIndex);
    const parts = chunks.map((c) => c.data);
    const blob = new Blob(parts, {
      type: descriptor.type || 'application/octet-stream',
    });
    out.push({
      name: descriptor.name,
      size: descriptor.size,
      type: descriptor.type,
      url: URL.createObjectURL(blob),
    });
  }

  return out;
}
