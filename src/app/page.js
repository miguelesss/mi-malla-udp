"use client";

import { useState, useEffect } from 'react';
import ramos from '../data/ramos.json';

export default function Home() {
  const [aprobados, setAprobados] = useState([]);
  const [enfocado, setEnfocado] = useState(null);

  useEffect(() => {
    const guardados = localStorage.getItem('malla-progreso');
    if (guardados) setAprobados(JSON.parse(guardados));
  }, []);

  useEffect(() => {
    localStorage.setItem('malla-progreso', JSON.stringify(aprobados));
  }, [aprobados]);

  const toggleAprobado = (id) => {
    setAprobados(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const getColorArea = (id) => {
    if (id.startsWith('CBM') || id.startsWith('CBF') || id.startsWith('CBQ')) return '#3b82f6'; // Azul - Ciencias Básicas
    if (id.startsWith('CII') || id.startsWith('CIT')) return '#eab308'; // Amarillo - Ciencias de la Ingeniería
    if (id.startsWith('FIC') || id.startsWith('CFG') || id.startsWith('CIG')) return '#f97316'; // Naranja - Transversales/Inglés
    return '#64748b';
  };

  const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <main className="p-4 md:p-8 min-h-screen bg-[#050505] text-slate-200 font-sans select-none">
      <div className="max-w-[1800px] mx-auto">
        <header className="mb-8 flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
            INGENIERIA CIVIL INDUSTRIAL<span className="text-blue-500"> UDP</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Malla 2020</p>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 text-center">
            <span className="block text-[10px] font-black text-slate-500 uppercase">Completado</span>
            <span className="text-xl font-black text-emerald-400">
              {Math.round((aprobados.length / ramos.length) * 100)}%
            </span>
          </div>
        </header>

        <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar">
          {semestres.map((sem) => (
            <div key={sem} className="min-w-[200px] md:min-w-[240px] flex-1 snap-start">
              <h3 className="text-center font-black text-slate-600 uppercase text-[9px] mb-4 tracking-widest">
                Semestre {sem}
              </h3>
              
              <div className="flex flex-col gap-3">
                {ramos.filter(r => r.semestre === sem).map((ramo) => {
                  const esAprobado = aprobados.includes(ramo.id);
                  const colorArea = getColorArea(ramo.id);
                  const estaAbierto = ramo.prerrequisitos.every(p => aprobados.includes(p));
                  
                  return (
                    <button 
                      key={ramo.id}
                      onClick={() => toggleAprobado(ramo.id)}
                      className={`
                        relative w-full text-left p-3 rounded-xl border-2 transition-all duration-200 active:scale-95
                        ${esAprobado 
                          ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                          : estaAbierto 
                            ? 'bg-white/5 border-white/20' 
                            : 'bg-white/5 border-transparent opacity-30 grayscale'}
                      `}
                      style={!esAprobado && estaAbierto ? { borderLeftColor: colorArea, borderLeftWidth: '6px' } : {}}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[8px] font-black tracking-widest ${esAprobado ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {ramo.id}
                        </span>
                        {esAprobado && <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                      </div>

                      <h2 className="text-[11px] md:text-xs font-bold leading-tight mb-3 h-8 overflow-hidden">
                        {ramo.nombre}
                      </h2>

                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-500">{ramo.creditos} CR.</span>
                        {!esAprobado && estaAbierto && (
                          <span className="text-[8px] font-black text-white/40 uppercase">Disponible</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </main>
  );
}