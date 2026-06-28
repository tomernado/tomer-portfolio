import { useEffect, useState } from 'react'
import { X, Download, ZoomIn, ZoomOut, ExternalLink, FileText } from 'lucide-react'
import { personalInfo } from '../data/content'

export default function CvModal({ isOpen, onClose }) {
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!isOpen) setZoom(1)
  }, [isOpen])

  const zoomIn  = () => setZoom(z => Math.min(+(z + 0.25).toFixed(2), 3))
  const zoomOut = () => setZoom(z => Math.max(+(z - 0.25).toFixed(2), 0.5))

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="קורות חיים"
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`relative w-full max-w-4xl bg-slate-900 border border-slate-700/60 sm:rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] transition-all duration-300 flex flex-col ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ height: 'min(100dvh, 800px)' }}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 dir="rtl" className="font-body font-semibold text-white text-sm sm:text-base">
              קורות חיים — תומר כהן
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Zoom controls — desktop only */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={zoomOut}
                disabled={zoom <= 0.5}
                aria-label="Zoom out"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomOut size={16} />
              </button>
              <span className="font-mono text-[11px] text-slate-500 w-9 text-center select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoom >= 3}
                aria-label="Zoom in"
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ZoomIn size={16} />
              </button>
              <div className="w-px h-5 bg-slate-700 mx-1" />
            </div>

            {/* Open in new tab — always visible */}
            <a
              href={personalInfo.cvPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition-all duration-200"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">פתח</span>
            </a>

            {/* Download */}
            <a
              href={personalInfo.cvPdf}
              download="Tomer_Cohen_Resume.pdf"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all duration-200"
            >
              <Download size={13} />
              <span className="hidden sm:inline">הורד PDF</span>
            </a>

            <button
              onClick={onClose}
              aria-label="Close"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Mobile: clean open-in-browser UI */}
        <div className="sm:hidden flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <FileText size={28} className="text-blue-400" />
          </div>
          <div>
            <p className="font-body font-semibold text-white text-base mb-1.5">
              קורות חיים — תומר כהן
            </p>
            <p className="font-body text-slate-400 text-sm leading-relaxed">
              לחץ על אחד הכפתורים להצגה או הורדה
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a
              href={personalInfo.cvPdf}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl font-semibold text-sm transition-all duration-200"
            >
              <ExternalLink size={16} />
              פתח קורות חיים
            </a>
            <a
              href={personalInfo.cvPdf}
              download="Tomer_Cohen_Resume.pdf"
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white rounded-xl font-semibold text-sm transition-all duration-200"
            >
              <Download size={16} />
              הורד PDF
            </a>
          </div>
        </div>

        {/* Desktop: embedded iframe with zoom */}
        <div
          className="hidden sm:block flex-1 overflow-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <iframe
            src={`${personalInfo.cvPdf}#toolbar=0&navpanes=0`}
            title="Tomer Cohen Resume"
            className="bg-white block"
            style={{
              width:  `${zoom * 100}%`,
              height: `${Math.max(zoom, 1) * 100}%`,
              minHeight: '100%',
            }}
          />
        </div>
      </div>
    </div>
  )
}
