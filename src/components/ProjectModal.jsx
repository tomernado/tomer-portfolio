import { X, Github, Linkedin } from 'lucide-react'

export default function ProjectModal({ project, onClose }) {
  const isOpen = !!project

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        className={`relative w-full max-w-2xl bg-slate-900 border border-slate-700/60 rounded-2xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        dir="rtl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 left-3 z-20 p-2 bg-slate-800/90 backdrop-blur-sm hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700/50 transition-all duration-200 hover:scale-105"
        >
          <X size={16} />
        </button>

        {/* Media area */}
        {project && (
          <div className="relative w-full aspect-video bg-slate-800 overflow-hidden">
            {project.mediaType === 'video' ? (
              <video
                key={project.id}
                src={project.media}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={project.media}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
            {/* Bottom gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Content */}
        {project && (
          <div className="px-7 pt-6 pb-7">
            {/* Title */}
            <h3 className="font-body font-extrabold text-white text-2xl sm:text-3xl leading-snug mb-4">
              {project.title}
            </h3>

            {/* Description */}
            <p className="font-body text-slate-300 text-base leading-[2] mb-8">
              {project.description}
            </p>

            {/* Divider */}
            <div className="h-px bg-slate-700/50 mb-6" />

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-end">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 text-white rounded-xl text-sm font-semibold font-body transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Github size={15} />
                GitHub
              </a>
              <a
                href={project.linkedinPost}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 bg-[#0077b5]/15 hover:bg-[#0077b5]/30 border border-[#0077b5]/40 hover:border-[#0077b5]/70 text-[#60c0f0] hover:text-white rounded-xl text-sm font-semibold font-body transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Linkedin size={15} />
                LinkedIn Post
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
