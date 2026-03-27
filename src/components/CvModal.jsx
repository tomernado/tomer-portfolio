import { X, Download } from 'lucide-react'
import { personalInfo } from '../data/content'

export default function CvModal({ isOpen, onClose }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="קורות חיים"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
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
        className={`relative w-full max-w-4xl bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.8)] transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{ height: 'min(90vh, 800px)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <h3 dir="rtl" className="font-body font-semibold text-white text-base">
              קורות חיים — תומר כהן
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={personalInfo.cvPdf}
              download="Tomer_Cohen_Resume.pdf"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
            >
              <Download size={14} />
              הורד PDF
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

        {/* PDF iframe */}
        <iframe
          src={`${personalInfo.cvPdf}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Tomer Cohen Resume"
          className="w-full bg-white"
          style={{ height: 'calc(100% - 65px)' }}
        />
      </div>
    </div>
  )
}
