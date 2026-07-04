import React, { useState } from 'react';

const PAGES = [
  { label: 'Inicio', src: '/website/index.html' },
  { label: 'Sistema', src: '/website/pages/sistema.html' },
  { label: 'App', src: '/website/pages/app.html' },
  { label: 'Inversión', src: '/website/pages/inversion.html' },
  { label: 'Organizaciones', src: '/website/pages/organizaciones.html' },
  { label: 'Territorios', src: '/website/pages/territorios.html' },
  { label: 'Retiros', src: '/website/pages/retiros.html' },
  { label: 'Diplomado', src: '/website/pages/diplomado.html' },
  { label: 'Colección', src: '/website/pages/coleccion.html' },
  { label: 'Equipo', src: '/website/pages/jose-y-mar.html' },
];

export default function WebsitePreview() {
  const [currentSrc, setCurrentSrc] = useState(PAGES[0].src);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col">
      <iframe
        key={currentSrc}
        src={currentSrc}
        title="Arquitectura de la Percepción"
        className="flex-1 w-full border-0"
        style={{ minHeight: 'calc(100vh - 48px)' }}
      />
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050D1A]/95 backdrop-blur-md border-t border-[#D4AF37]/30 px-2 py-2 flex items-center justify-center gap-1 overflow-x-auto"
        style={{ scrollbarWidth: 'none' }}>
        {PAGES.map((page) => {
          const isActive = currentSrc === page.src;
          return (
            <button
              key={page.src}
              onClick={() => setCurrentSrc(page.src)}
              className={`whitespace-nowrap text-xs font-medium px-3 py-1.5 rounded-full transition-all ${
                isActive
                  ? 'bg-[#D4AF37] text-[#050D1A]'
                  : 'text-[#D4AF37]/70 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10'
              }`}
            >
              {page.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}