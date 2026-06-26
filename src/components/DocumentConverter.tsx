import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileImage, UploadCloud, X, FileOutput, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { convertImagesToPdf, formatBytes } from '../lib/convert';

export default function DocumentConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [outputName, setOutputName] = useState('converted-document');
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only accept jpeg and png for now, as implemented in convert.ts
    const filteredFiles = acceptedFiles.filter(
      file => file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
    );
    
    setFiles(prev => [...prev, ...filteredFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    }
  });

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    
    setIsConverting(true);
    try {
      const pdfBlob = await convertImagesToPdf(files);
      
      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${outputName.trim() || 'document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error converting files:', error);
      alert('Failed to convert files. See console for details.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="converter-container glass-panel">
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="dropzone-icon" />
        <div className="dropzone-text">
          {isDragActive ? 'Drop your images here' : 'Drag & drop images here'}
        </div>
        <div className="dropzone-subtext">
          Supports JPEG, JPG, PNG
        </div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="file-list"
          >
            {files.map((file, index) => (
              <motion.div 
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="file-item"
              >
                <div className="file-info">
                  <FileImage className="file-icon" size={24} />
                  <div>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatBytes(file.size)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(index)} 
                  className="remove-btn"
                  title="Remove file"
                >
                  <X size={20} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="controls">
        <div className="input-group">
          <label htmlFor="filename">Output File Name</label>
          <input 
            type="text" 
            id="filename"
            className="text-input" 
            value={outputName}
            onChange={(e) => setOutputName(e.target.value)}
            placeholder="e.g. my-awesome-document"
          />
        </div>
        
        <button 
          className="action-btn"
          onClick={handleConvert}
          disabled={files.length === 0 || isConverting}
        >
          {isConverting ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <FileOutput size={24} />
          )}
          {isConverting ? 'Converting...' : 'Convert to PDF'}
        </button>
      </div>
    </div>
  );
}
