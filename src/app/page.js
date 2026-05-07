"use client";

import { useState, useEffect } from 'react';
import ramos from '../data/ramos.json';

export default function Home() {
  const [aprobados, setAprobados] = useState([]);

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
    if (id.startsWith('CBM') || id.startsWith('CBF') || id.startsWith('CBQ')) return '#3b82f6'; // Azul - Básicas
    if (id.startsWith('CII') || id.startsWith('CIT')) return '#eab308'; // Amarillo - Especialidad
    if (id.startsWith('FIC') || id.startsWith('CFG') || id.startsWith('CIG')) return '#f97316'; // Naranja - Transversales
    return '#64748b';
  };

  const semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <main className="p-4 md:p-8 min-h-screen bg-[#050505] text-slate-200 font-sans select-none">
      <div className="max-w-[1800px] mx-auto">
        
        {/* HEADER SIN IMAGEN */}
        <header className="mb-10 flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              MY MALLA <span className="text-blue-500">ICI</span>
            </h1>
            <a 
              href="https://github.com/miguelesss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-slate-500 hover:text-blue-400 transition-colors tracking-widest uppercase flex items-center gap-2 mt-1"
            >
              <span>GitHub</span>
              <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
              <span>@miguelesss</span>
            </a>
          </div>

          <div className="bg-white/5 px-6 py-2 rounded-xl border border-white/10 text-right">
            <span className="block text-[10px] font-black text-slate-500 uppercase">Avance Carrera</span>
            <span className="text-2xl font-black text-emerald-400">
              {Math.round((aprobados.length / ramos.length) * 100)}%
            </span>
          </div>
        </header>

        <div className="flex gap-4 overflow-x-auto pb-8 snap-x custom-scrollbar">
          {semestres.map((sem) => {
            const ramosSemestre = ramos.filter(r => r.semestre === sem);
            const totalCreditos = ramosSemestre.reduce((acc, r) => acc + r.creditos, 0);
            const aprobadosSem = ramosSemestre
              .filter(r => aprobados.includes(r.id))
              .reduce((acc, r) => acc + r.creditos, 0);

            return (
              <div key={sem} className="min-w-[200px] md:min-w-[240px] flex-1 snap-start">
                <div className="text-center mb-6 py-2 bg-white/5 rounded-lg border border-white/5">
                  <h3 className="font-black text-white uppercase text-[10px] tracking-widest">
                    Semestre {sem}
                  </h3>
                  {/* CONTADOR DE CRÉDITOS */}
                  <p className={`text-[10px] font-bold mt-1 ${aprobadosSem === totalCreditos ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {aprobadosSem} / {totalCreditos} CR
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  {ramosSemestre.map((ramo) => {
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
                          {esAprobado && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                        </div>

                        <h2 className="text-[10px] md:text-xs font-bold leading-tight mb-3 h-8 overflow-hidden uppercase">
                          {ramo.nombre}
                        </h2>

                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-black text-slate-500">{ramo.creditos} CR.</span>
                          {!esAprobado && estaAbierto && (
                            <span className="text-[8px] font-black text-blue-400 uppercase">Abierto</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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