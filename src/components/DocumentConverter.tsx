import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  X,
  FileOutput,
  Loader2,
  FileImage,
  FileText,
  FileCode,
  FileSpreadsheet,
  File,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import type { StagedFile } from '../types/converter';
import {
  getCategoryForFile,
  getLabelForFile,
  formatBytes,
  DROPZONE_ACCEPT,
} from '../lib/registry';
import { convertFiles, triggerDownload } from '../lib/convert';

function getCategoryIcon(category: StagedFile['category']) {
  const props = { size: 22, strokeWidth: 1.8 };
  switch (category) {
    case 'image':       return <FileImage {...props} className="icon-image" />;
    case 'document':    return <FileText {...props} className="icon-doc" />;
    case 'spreadsheet': return <FileSpreadsheet {...props} className="icon-sheet" />;
    case 'code':        return <FileCode {...props} className="icon-code" />;
    case 'text':        return <FileText {...props} className="icon-text" />;
    default:            return <File {...props} className="icon-default" />;
  }
}

function StatusBadge({ status }: { status: StagedFile['status'] }) {
  if (status === 'pending') return null;
  if (status === 'converting') return <Loader2 size={16} className="spin icon-muted" />;
  if (status === 'done')  return <CheckCircle size={16} className="icon-success" />;
  if (status === 'error') return <AlertCircle size={16} className="icon-error" />;
  return null;
}

export default function DocumentConverter() {
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [outputName, setOutputName] = useState('converted-document');
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems: StagedFile[] = acceptedFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      category: getCategoryForFile(file),
      status: 'pending',
    }));
    setStagedFiles((prev) => [...prev, ...newItems]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: DROPZONE_ACCEPT,
  });

  const removeFile = (id: string) => {
    setStagedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleConvert = async () => {
    const pending = stagedFiles.filter(
      (f) => f.status === 'pending' && f.category !== 'unsupported'
    );
    if (pending.length === 0) return;

    setIsConverting(true);

    // Group by category so each group calls the right converter
    const groups = pending.reduce<Record<string, StagedFile[]>>((acc, sf) => {
      if (!acc[sf.category]) acc[sf.category] = [];
      acc[sf.category].push(sf);
      return acc;
    }, {});

    // Mark all as converting
    setStagedFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'converting' } : f
      )
    );

    for (const [category, group] of Object.entries(groups)) {
      const files = group.map((sf) => sf.file);
      const ids = group.map((sf) => sf.id);

      try {
        const blob = await convertFiles(files, category as StagedFile['category']);
        const suffix = Object.keys(groups).length > 1 ? `-${category}` : '';
        triggerDownload(blob, `${outputName.trim() || 'document'}${suffix}`);

        setStagedFiles((prev) =>
          prev.map((f) =>
            ids.includes(f.id) ? { ...f, status: 'done' } : f
          )
        );
      } catch (err) {
        console.error(`Error converting ${category}:`, err);
        setStagedFiles((prev) =>
          prev.map((f) =>
            ids.includes(f.id)
              ? { ...f, status: 'error', error: String(err) }
              : f
          )
        );
      }
    }

    setIsConverting(false);
  };

  const clearAll = () => setStagedFiles([]);

  const pendingCount = stagedFiles.filter(
    (f) => f.status === 'pending' && f.category !== 'unsupported'
  ).length;

  return (
    <div className="converter-container glass-panel">
      {/* ── Drop Zone ───────────────────────────────── */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''}`}
        id="dropzone-area"
      >
        <input {...getInputProps()} id="file-input" />
        <UploadCloud className="dropzone-icon" />
        <div className="dropzone-text">
          {isDragActive ? 'Release to add files' : 'Drag & drop any supported file'}
        </div>
        <div className="dropzone-subtext">
          Images · Word · Excel · CSV · Text · Markdown · HTML · Code files · and more
        </div>
      </div>

      {/* ── File List ────────────────────────────────── */}
      <AnimatePresence>
        {stagedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="file-list"
          >
            <div className="file-list-header">
              <span className="file-count">
                {stagedFiles.length} file{stagedFiles.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={clearAll}
                className="clear-btn"
                title="Clear all"
                id="clear-all-btn"
              >
                Clear all
              </button>
            </div>

            {stagedFiles.map((sf) => (
              <motion.div
                key={sf.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`file-item status-${sf.status}`}
              >
                <div className="file-info">
                  {getCategoryIcon(sf.category)}
                  <div>
                    <div className="file-name">{sf.file.name}</div>
                    <div className="file-meta">
                      <span className="file-label">{getLabelForFile(sf.file)}</span>
                      <span className="dot">·</span>
                      <span className="file-size">{formatBytes(sf.file.size)}</span>
                    </div>
                  </div>
                </div>
                <div className="file-actions">
                  <StatusBadge status={sf.status} />
                  {sf.status !== 'converting' && (
                    <button
                      onClick={() => removeFile(sf.id)}
                      className="remove-btn"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Controls ─────────────────────────────────── */}
      <div className="controls">
        <div className="input-group">
          <label htmlFor="filename">Output File Name</label>
          <input
            type="text"
            id="filename"
            className="text-input"
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            placeholder="e.g. my-converted-doc"
          />
        </div>

        <button
          id="convert-btn"
          className="action-btn"
          onClick={handleConvert}
          disabled={pendingCount === 0 || isConverting}
        >
          {isConverting ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <FileOutput size={20} />
          )}
          {isConverting
            ? 'Converting…'
            : `Convert ${pendingCount > 0 ? pendingCount : ''} File${pendingCount !== 1 ? 's' : ''} to PDF`}
        </button>
      </div>
    </div>
  );
}
